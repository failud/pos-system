
// brand.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto, UpdateBrandDto } from './brand.dto';
import { PaginationQueryDto, PaginatedResult } from '../common/dto/pagination.dto';
import { BrandWithProductCount } from './brand.interface';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto): Promise<PaginatedResult<BrandWithProductCount>> {
    return this.brandService.findAll(query);
  }

  @Get('/active')
  findAllActiveOptions(): Promise<{ id: string; name: string; description?: string }[]> {
    return this.brandService.findAllActiveOptions();
  }



  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string; action: 'deactivated' | 'deleted' }> {
    return this.brandService.remove(id);
  }


}