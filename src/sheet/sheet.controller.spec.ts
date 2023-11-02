import { mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { SheetController } from './sheet.controller';
import { SheetRepository } from './sheet.repository';
import { SheetService } from './sheet.service';

describe('SheetController', () => {
  let appController: SheetController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SheetController],
      providers: [
        SheetService,
        {
          provide: SheetRepository,
          useExisting: mock<SheetRepository>({}),
        },
      ],
    }).compile();

    appController = app.get<SheetController>(SheetController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });
});
