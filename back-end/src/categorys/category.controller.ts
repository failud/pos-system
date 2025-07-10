
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from './category.entity';


@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
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
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.categoryService.remove(id);
    return { message: 'Category deleted successfully' };
  }
}