
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { SaleItem } from 'src/sale-items/sale-item.entity';
import { SaleController } from './sale.controller';
import { Sale } from './sale.entity';
import { SaleService } from './sale.service';


@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleItem, Product])],
  controllers: [SaleController],
  providers: [SaleService],
  exports: [SaleService],
})
export class SaleModule {}