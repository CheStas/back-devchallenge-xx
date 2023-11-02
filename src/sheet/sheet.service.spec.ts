import { UnprocessableEntityException } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import { SheetRepository } from './sheet.repository';
import { Cell, Sheet } from './sheet.schema';
import { SheetService } from './sheet.service';

describe('SheetService', () => {
  let repository: SheetRepository;
  let service: SheetService;

  beforeEach(async () => {
    repository = mock<SheetRepository>({
      update: jest.fn().mockImplementation((data) => {
        return {
          name: data?.name,
        };
      }),
      upsert: jest.fn().mockImplementation((data) => {
        return {
          name: data?.sheetId,
          cells: data?.cells,
        };
      }),
    });
    service = new SheetService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upsert', () => {
    it('should add new sheet, cell', async () => {
      const result = await service.upsert({
        sheetId: 'test',
        cellId: 'test',
        value: 'initial',
      });
      expect(result).toStrictEqual({
        value: 'initial',
        result: 'initial',
      });
    });

    it('should throw error on circular dependency', async () => {
      await expect(
        service.upsert({
          sheetId: 'test',
          cellId: 'a',
          value: '=a',
        }),
      ).rejects.toThrowError(
        new UnprocessableEntityException({
          value: '=a',
          result: 'ERROR',
        }),
      );
    });

    it('should throw error on circular dependency, cross reference', async () => {
      repository.findSheet = jest.fn().mockResolvedValue({
        name: 'test',
        cells: new Map(
          Object.entries({
            var1: {
              value: '100',
              result: '100',
              usedIn: { var2: true },
            },
            var2: {
              value: '=var1',
              result: '100',
              vars: { var1: true } as { [key: string]: boolean },
            },
          }),
        ),
      });
      await expect(
        service.upsert({
          sheetId: 'test',
          cellId: 'var1',
          value: '=var2',
        }),
      ).rejects.toThrowError(
        new UnprocessableEntityException({
          value: '=var2',
          result: 'ERROR',
        }),
      );
    });
  });

  describe('updateDependentCells', () => {
    it('should update dependent formula', () => {
      const currentCell: Cell = {
        value: '100',
        result: '100',
        usedIn: { b: true },
      };
      const sheet: Sheet = {
        name: 'test',
        cells: new Map(
          Object.entries({
            a: currentCell,
            b: {
              value: '=a',
              result: '1',
              vars: { a: true },
            },
          }),
        ),
      };

      const spy = jest.spyOn(service, 'updateDependentCells' as any);
      service['updateDependentCells'](sheet, currentCell);

      expect(sheet.cells.get('b')?.result).toBe(currentCell.result);
      expect(spy).toBeCalledTimes(2);
    });

    it('should update dependent formula recursively', () => {
      const currentCell: Cell = {
        value: '100',
        result: '100',
        usedIn: { b: true },
      };
      const sheet: Sheet = {
        name: 'test',
        cells: new Map(
          Object.entries({
            a: currentCell,
            b: {
              value: '=a',
              result: '1',
              vars: { a: true } as { [key: string]: boolean },
              usedIn: { c: true },
            },
            c: {
              value: '=b',
              result: '1',
              vars: { b: true },
            },
          }),
        ),
      };

      const spy = jest.spyOn(service, 'updateDependentCells' as any);
      service['updateDependentCells'](sheet, currentCell);

      expect(sheet.cells.get('c')?.result).toBe(currentCell.result);
      expect(spy).toBeCalledTimes(3);
    });
  });
});
