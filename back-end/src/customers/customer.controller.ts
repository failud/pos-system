import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto } from './customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
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