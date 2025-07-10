// src/modules/product.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/brands/brand.entity';
import { Category } from 'src/categorys/category.entity';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Brand])
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}