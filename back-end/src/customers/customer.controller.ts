import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, CustomerPaginationQueryDto, UpdateCustomerDto } from './customer.dto';
import { Customer } from './customer.entity';
import { PaginatedResult } from 'src/common/dto/pagination.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  findAll(@Query() paginationQuery: CustomerPaginationQueryDto): Promise<PaginatedResult<Customer>> {
    return this.customerService.findAll(paginationQuery);
  }

  @Get('stats')
  getStats() {
    return this.customerService.getCustomerStats();
  }

  @Get('search')
  async search(@Query('phone') phone?: string, @Query('email') email?: string) {
    if (phone) {
      return await this.customerService.findByPhone(phone);
    }
    if (email) {
      return await this.customerService.findByEmail(email);
    }
    return { message: 'Please provide phone or email parameter' };
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customerService.remove(id);
  }
}