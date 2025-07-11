import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { SaleItemService } from './sale-item.service';
import { CreateSaleItemDto, UpdateSaleItemDto } from './sale-item.dto';

@Controller('sale-items')
export class SaleItemController {
  constructor(private readonly saleItemService: SaleItemService) {}

  @Post()
  create(@Body() createSaleItemDto: CreateSaleItemDto) {
    return this.saleItemService.create(createSaleItemDto);
  }

  @Get()
  findAll() {
    return this.saleItemService.findAll();
  }

  @Get('by-sale/:saleId')
  findBySaleId(@Param('saleId', ParseUUIDPipe) saleId: string) {
    return this.saleItemService.findBySaleId(saleId);
  }

  @Get('by-product/:productId')
  findByProductId(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.saleItemService.findByProductId(productId);
  }

  @Get('summary/:saleId')
  getSaleItemsSummary(@Param('saleId', ParseUUIDPipe) saleId: string) {
    return this.saleItemService.getSaleItemsSummary(saleId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.saleItemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateSaleItemDto: UpdateSaleItemDto) {
    return this.saleItemService.update(id, updateSaleItemDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.saleItemService.remove(id);
  }
}