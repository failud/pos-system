// src/controllers/product.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../interfaces/pagination.interface';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productService.create(createProductDto);
  }

  @Get()
  async findAll(@Query() query: PaginationQueryDto): Promise<PaginatedResult<Product>> {
    return await this.productService.findAllPaginated(query);
  }

  @Get('low-stock')
  async getLowStockProducts(@Query() query: PaginationQueryDto): Promise<PaginatedResult<Product>> {
    return await this.productService.getLowStockProductsPaginated(query);
  }

  @Get('sku/:sku')
  async findBySku(@Param('sku') sku: string): Promise<Product> {
    return await this.productService.findBySku(sku);
  }

  @Get('barcode/:barcode')
  async findByBarcode(@Param('barcode') barcode: string): Promise<Product> {
    return await this.productService.findByBarcode(barcode);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    return await this.productService.update(id, updateProductDto);
  }

  @Patch(':id/stock')
  async updateStock(
    @Param('id') id: string,
    @Body() body: { quantity: number }
  ): Promise<Product> {
    return await this.productService.updateStock(id, body.quantity);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.productService.remove(id);
    return { message: 'Product deleted successfully' };
  }
}