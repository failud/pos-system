import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from './category.entity';


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

    async remove(id: string): Promise<void> {
        const category = await this.findOne(id);
        category.isActive = false;
        await this.categoryRepository.save(category);
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
}