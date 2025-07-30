// src/services/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../interfaces/pagination.interface';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['category', 'brand'],
      where: { isActive: true },
    });
  }

  async findAllPaginated(query: PaginationQueryDto): Promise<PaginatedResult<Product>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    let queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .where('product.isActive = :isActive', { isActive: true });

    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(product.name ILIKE :searchTerm OR product.sku ILIKE :searchTerm OR product.barcode ILIKE :searchTerm)',
        { searchTerm: `%${search}%` }
      );
    }

    const total = await queryBuilder.getCount();
    
    const data = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('product.createdAt', 'DESC')
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

  async getLowStockProductsPaginated(query: PaginationQueryDto): Promise<PaginatedResult<Product>> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .where('product.stockQuantity <= product.minStockLevel')
      .andWhere('product.isActive = :isActive', { isActive: true });

    const total = await queryBuilder.getCount();
    
    const data = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('product.stockQuantity', 'ASC')
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

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'brand'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySku(sku: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { sku },
      relations: ['category', 'brand'],
    });

    if (!product) {
      throw new NotFoundException(`Product with SKU ${sku} not found`);
    }

    return product;
  }

  async findByBarcode(barcode: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { barcode },
      relations: ['category', 'brand'],
    });

    if (!product) {
      throw new NotFoundException(`Product with barcode ${barcode} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    product.isActive = false;
    await this.productRepository.save(product);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stockQuantity += quantity;
    return await this.productRepository.save(product);
  }

  async getLowStockProducts(): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.stockQuantity <= product.minStockLevel')
      .andWhere('product.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .where('product.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('product.sku ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('product.barcode ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .getMany();
  }

  private createProductQueryBuilder(): SelectQueryBuilder<Product> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .where('product.isActive = :isActive', { isActive: true });
  }
}