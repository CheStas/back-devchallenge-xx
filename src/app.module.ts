import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SheetService } from './sheet/sheet.service';
import { Sheet, SheetSchema } from './sheet/sheet.schema';
import { SheetController } from './sheet/sheet.controller';
import { SheetRepository } from './sheet/sheet.repository';

const { DATABASE_URI = '' } = process.env;

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_URI),
    MongooseModule.forFeature([
      {
        name: Sheet.name,
        schema: SheetSchema,
      },
    ]),
  ],
  controllers: [SheetController],
  providers: [SheetRepository, SheetService],
})
export class AppModule {}
