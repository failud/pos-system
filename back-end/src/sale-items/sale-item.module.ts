import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleItem } from './sale-item.entity';
import { SaleItemService } from './sale-item.service';
import { SaleItemController } from './sale-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SaleItem])],
  controllers: [SaleItemController],
  providers: [SaleItemService],
  exports: [SaleItemService],
})
export class SaleItemModule {}