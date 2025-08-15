import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CategoryWithProductCount, CreateCategoryDto, UpdateCategoryDto } from './category.dto';
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
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['products'],
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        const hasActiveProducts = category.products && category.products.length > 0;

        if (hasActiveProducts) {
            category.isActive = false;
            await this.categoryRepository.save(category);

            return {
                message: 'Category has been deactivated because it contains products',
                action: 'soft_deleted'
            };
        } else {
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

    async findAllPaginated(query: PaginationQueryDto): Promise<PaginatedResult<CategoryWithProductCount | Category>> {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
        const skip = (page - 1) * limit;

        if (sortBy === 'productCount') {
            let searchCondition = '';
            let searchParams: any[] = [true];

            if (search) {
                searchCondition = `AND (category.name ILIKE $2 OR category.description ILIKE $2)`;
                searchParams.push(`%${search}%`);
            }

            const countQuery = `
            SELECT COUNT(DISTINCT category.id) as total
            FROM categories category
            LEFT JOIN products products ON products.category_id = category.id
            WHERE category.is_active = $1 ${searchCondition}
        `;

            const countResult = await this.categoryRepository.query(countQuery, searchParams);
            const total = parseInt(countResult[0].total);

            const dataQuery = `
            SELECT 
                category.id,
                category.name,
                category.description,
                category.is_active,
                category.created_at,
                category.updated_at,
                category.parent_id,
                parent.id as parent_id_data,
                parent.name as parent_name,
                parent.description as parent_description,
                parent.is_active as parent_is_active,
                parent.created_at as parent_created_at,
                parent.updated_at as parent_updated_at,
                parent.parent_id as parent_parent_id,
                COUNT(products.id) as product_count
            FROM categories category
            LEFT JOIN categories parent ON parent.id = category.parent_id
            LEFT JOIN products products ON products.category_id = category.id
            WHERE category.is_active = $1 ${searchCondition}
            GROUP BY 
                category.id, 
                parent.id, 
                parent.name, 
                parent.description, 
                parent.is_active, 
                parent.created_at, 
                parent.updated_at, 
                parent.parent_id
            ORDER BY product_count ${sortOrder}, category.created_at DESC
            LIMIT $${searchParams.length + 1} OFFSET $${searchParams.length + 2}
        `;

            searchParams.push(limit, skip);

            const rawData = await this.categoryRepository.query(dataQuery, searchParams);

            const data: CategoryWithProductCount[] = await Promise.all(
                rawData.map(async (row: any) => {
                    const childrenQuery = `
                    SELECT id, name, description, is_active, created_at, updated_at, parent_id
                    FROM categories 
                    WHERE parent_id = $1 AND is_active = true
                `;
                    const children = await this.categoryRepository.query(childrenQuery, [row.id]);

                    const productsQuery = `
                    SELECT id, name, description, selling_price , stock_quantity, is_active, created_at, updated_at, category_id
                    FROM products 
                    WHERE category_id = $1 AND is_active = true
                `;
                    const products = await this.categoryRepository.query(productsQuery, [row.id]);

                    return {
                        id: row.id,
                        name: row.name,
                        description: row.description,
                        isActive: row.is_active,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at,
                        parentId: row.parent_id,
                        parent: row.parent_id_data ? {
                            id: row.parent_id_data,
                            name: row.parent_name,
                            description: row.parent_description,
                            isActive: row.parent_is_active,
                            createdAt: row.parent_created_at,
                            updatedAt: row.parent_updated_at,
                            parentId: row.parent_parent_id,
                        } : null,
                        children: children.map((child: any) => ({
                            id: child.id,
                            name: child.name,
                            description: child.description,
                            isActive: child.is_active,
                            createdAt: child.created_at,
                            updatedAt: child.updated_at,
                            parentId: child.parent_id,
                        })),
                        products: products.map((product: any) => ({
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            selling_price : parseFloat(product.selling_price ),
                            stockQuantity: parseInt(product.stock_quantity),
                            isActive: product.is_active,
                            createdAt: product.created_at,
                            updatedAt: product.updated_at,
                            categoryId: product.category_id,
                        })),
                        productCount: parseInt(row.product_count),
                    } as CategoryWithProductCount;
                })
            );

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
        } else {
            const queryBuilder = this.categoryRepository
                .createQueryBuilder('category')
                .leftJoinAndSelect('category.parent', 'parent')
                .leftJoinAndSelect('category.children', 'children')
                .leftJoinAndSelect('category.products', 'products') // เพิ่ม products
                .where('category.isActive = :isActive', { isActive: true });

            if (search) {
                queryBuilder.andWhere(
                    '(category.name ILIKE :searchTerm OR category.description ILIKE :searchTerm)',
                    { searchTerm: `%${search}%` }
                );
            }

            if (sortBy === 'name') {
                queryBuilder.orderBy('category.name', sortOrder);
            } else {
                queryBuilder.orderBy('category.createdAt', sortOrder);
            }

            const total = await queryBuilder.getCount();

            const data = await queryBuilder
                .skip(skip)
                .take(limit)
                .getMany();

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




}