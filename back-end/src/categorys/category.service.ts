import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from './category.entity';
import { PaginatedResult, PaginationQueryDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepository.create(createCategoryDto);
        return await this.categoryRepository.save(category);
    }

    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find({
            relations: ['parent', 'children', 'products'],
            where: { isActive: true },
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['parent', 'children', 'products'],
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return category;
    }

    async findRootCategories(): Promise<Category[]> {
        return await this.categoryRepository.find({
            where: { parentId: IsNull(), isActive: true },
            relations: ['children'],
        });
    }

    async findByParent(parentId: string): Promise<Category[]> {
        return await this.categoryRepository.find({
            where: { parentId, isActive: true },
            relations: ['children'],
        });
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);

        Object.assign(category, updateCategoryDto);
        return await this.categoryRepository.save(category);
    }

    async remove(id: string): Promise<{ message: string; action: 'soft_deleted' | 'hard_deleted' }> {
        // ค้นหา category พร้อมกับ products ที่เกี่ยวข้อง
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['products'],
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        // เช็คว่ามี products ที่ยังใช้งานอยู่หรือไม่
        const hasActiveProducts = category.products && category.products.length > 0;

        if (hasActiveProducts) {
            // ถ้ามี products ให้ทำ soft delete (ตั้ง isActive = false)
            category.isActive = false;
            await this.categoryRepository.save(category);
            
            return {
                message: 'Category has been deactivated because it contains products',
                action: 'soft_deleted'
            };
        } else {
            // ถ้าไม่มี products ให้ลบออกจากฐานข้อมูลเลย (hard delete)
            await this.categoryRepository.remove(category);
            
            return {
                message: 'Category has been permanently deleted',
                action: 'hard_deleted'
            };
        }
    }

    async getCategoryTree(): Promise<Category[]> {
        const categories = await this.categoryRepository.find({
            where: { isActive: true },
            relations: ['parent', 'children'],
        });

        const rootCategories = categories.filter(cat => !cat.parentId);

        const buildTree = (parent: Category): Category => {
            const children = categories.filter(cat => cat.parentId === parent.id);
            return {
                ...parent,
                children: children.map(child => buildTree(child))
            };
        };

        return rootCategories.map(root => buildTree(root));
    }

    async findAllPaginated(query: PaginationQueryDto): Promise<PaginatedResult<Category>> {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
        const skip = (page - 1) * limit;

        const queryBuilder = this.categoryRepository
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.parent', 'parent')
            .leftJoinAndSelect('category.children', 'children')
            .leftJoinAndSelect('category.products', 'products')
            .where('category.isActive = :isActive', { isActive: true });

        // Add search functionality
        if (search) {
            queryBuilder.andWhere(
                '(category.name ILIKE :searchTerm OR category.description ILIKE :searchTerm)',
                { searchTerm: `%${search}%` }
            );
        }

        // Add sorting logic
        switch (sortBy) {
            case 'productCount':
                // Count products for each category and sort by count
                queryBuilder
                    .addSelect('COUNT(products.id)', 'productCount')
                    .groupBy('category.id')
                    .addGroupBy('parent.id')
                    .addGroupBy('children.id')
                    .orderBy('productCount', sortOrder)
                    .addOrderBy('category.createdAt', 'DESC'); // Secondary sort
                break;
            
            case 'name':
                queryBuilder.orderBy('category.name', sortOrder);
                break;
            
            case 'createdAt':
            default:
                queryBuilder.orderBy('category.createdAt', sortOrder);
                break;
        }

        // Get total count (before pagination)
        const totalQueryBuilder = queryBuilder.clone();
        const total = await totalQueryBuilder.getCount();

        // Apply pagination
        const data = await queryBuilder
            .skip(skip)
            .take(limit)
            .getMany();

        // If sorting by productCount, we need to manually add the product count to each category
        if (sortBy === 'productCount') {
            const dataWithCounts = data.map(category => ({
                ...category,
                productCount: category.products ? category.products.length : 0
            }));
            
            const totalPages = Math.ceil(total / limit);

            return {
                data: dataWithCounts,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            };
        }

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }
}