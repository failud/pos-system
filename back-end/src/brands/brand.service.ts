// brand.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandDto, UpdateBrandDto } from './brand.dto';
import { PaginationQueryDto, PaginatedResult } from '../common/dto/pagination.dto';
import { BrandOption, BrandWithProductCount } from './brand.interface';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) { }

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const brand = this.brandRepository.create(createBrandDto);
    return await this.brandRepository.save(brand);
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<BrandWithProductCount> & { activeBrandCount: number }> {
    const { page = 1, limit = 10, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.products', 'product')
    // .where('brand.is_active = :isActive', { isActive: true });

    if (search) {
      queryBuilder.andWhere(
        '(brand.name ILIKE :search OR brand.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    let orderField: string;
    switch (sortBy) {
      case 'name':
        orderField = 'brand.name';
        break;
      case 'productCount':
        queryBuilder.addSelect(
          '(SELECT COUNT(*) FROM product p WHERE p.brand_id = brand.id AND p.is_active = true)',
          'productCount'
        );
        orderField = 'productCount';
        break;
      case 'createdAt':
      default:
        orderField = 'brand.created_at';
        break;
    }

    queryBuilder.orderBy(orderField, sortOrder);

    const total = await queryBuilder.getCount();
    queryBuilder.skip(skip).take(limit);
    const brands = await queryBuilder.getMany();

    const brandsWithProductCount: BrandWithProductCount[] = brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      description: brand.description,
      is_active: brand.is_active,
      created_at: brand.created_at,
      updated_at: brand.updated_at,
      products: brand.products,
      productCount: brand.products ? brand.products.filter(p => p.isActive).length : 0,
    }));

    if (sortBy === 'productCount') {
      brandsWithProductCount.sort((a, b) => {
        const comparison = a.productCount - b.productCount;
        return sortOrder === 'ASC' ? comparison : -comparison;
      });
    }

    const totalPages = Math.ceil(total / limit);

    const activeBrandCount = await this.brandRepository.count({
      where: { is_active: true },
    });

    return {
      data: brandsWithProductCount,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      activeBrandCount,
    };
  }


  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);
    Object.assign(brand, updateBrandDto);
    return await this.brandRepository.save(brand);
  }

  async remove(id: string): Promise<{ message: string; action: 'deactivated' | 'deleted' }> {
    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    const hasActiveProducts = brand.products && brand.products.some(product => product.isActive);
    const hasAnyProducts = brand.products && brand.products.length > 0;

    if (hasActiveProducts) {
      brand.is_active = false;
      await this.brandRepository.save(brand);
      return {
        message: `this Brand has been deactivated because it has active products`,
        action: 'deactivated'
      };
    } else if (hasAnyProducts) {
      brand.is_active = false;
      await this.brandRepository.save(brand);
      return {
        message: `this has been deactivated because it has associated products`,
        action: 'deactivated'
      };
    } else {
      await this.brandRepository.remove(brand);
      return {
        message: `Brand has been permanently deleted`,
        action: 'deleted'
      };
    }
  }

  async removeStrict(id: string): Promise<{ message: string; action: 'deactivated' | 'deleted' }> {
    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    const activeProductCount = await this.brandRepository
      .createQueryBuilder('brand')
      .leftJoin('brand.products', 'product')
      .where('brand.id = :brandId', { brandId: id })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .getCount();

    if (activeProductCount > 0) {
      brand.is_active = false;
      await this.brandRepository.save(brand);
      return {
        message: `Brand "${brand.name}" cannot be deleted because it has ${activeProductCount} active product(s). Brand has been deactivated instead.`,
        action: 'deactivated'
      };
    } else {
      await this.brandRepository.remove(brand);
      return {
        message: `Brand "${brand.name}" has been permanently deleted`,
        action: 'deleted'
      };
    }
  }

  async findAllActiveOptions(): Promise<BrandOption[]> {
    const brands = await this.brandRepository.find({
      where: { is_active: true },
      select: ['id', 'name', 'description'],
      order: { name: 'ASC' },
    });

    return brands as BrandOption[];
  }




}