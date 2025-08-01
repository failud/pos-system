import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from './category.entity';
import { PaginatedResult, PaginationQueryDto, CategoryWithProductCount } from 'src/common/dto/pagination.dto';

@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  // Enhanced paginated endpoint with sorting and search
  @Get('paginated')
  async findAllPaginated(@Query() query: PaginationQueryDto): Promise<PaginatedResult<Category | CategoryWithProductCount>> {
    return await this.categoryService.findAllPaginated(query);
  }

  @Get('tree')
  async getCategoryTree(): Promise<Category[]> {
    return await this.categoryService.getCategoryTree();
  }

  @Get('root')
  async findRootCategories(): Promise<Category[]> {
    return await this.categoryService.findRootCategories();
  }

  @Get('parent/:parentId')
  async findByParent(@Param('parentId') parentId: string): Promise<Category[]> {
    return await this.categoryService.findByParent(parentId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return await this.categoryService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string; action: 'soft_deleted' | 'hard_deleted' }> {
    return await this.categoryService.remove(id);
  }
}