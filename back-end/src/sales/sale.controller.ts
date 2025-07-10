
import { Controller, Get, Post, Body, Patch, Param, Query, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto, UpdateSaleDto } from './sale.dto';
import { Sale } from './sale.entity';


@Controller('sales')
@UseInterceptors(ClassSerializerInterceptor)
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto): Promise<Sale> {
    return await this.saleService.create(createSaleDto);
  }

  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Sale[]> {
    if (startDate && endDate) {
      return await this.saleService.findByDateRange(
        new Date(startDate),
        new Date(endDate)
      );
    }
    return await this.saleService.findAll();
  }

  @Get('daily-report')
  async getDailySales(@Query('date') date: string): Promise<{
    totalSales: number;
    totalTransactions: number;
    totalAmount: number;
    totalTax: number;
    totalDiscount: number;
  }> {
    const reportDate = date ? new Date(date) : new Date();
    return await this.saleService.getDailySales(reportDate);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Sale> {
    return await this.saleService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto): Promise<Sale> {
    return await this.saleService.update(id, updateSaleDto);
  }

  @Patch(':id/cancel')
  async cancelSale(@Param('id') id: string): Promise<Sale> {
    return await this.saleService.cancelSale(id);
  }
}