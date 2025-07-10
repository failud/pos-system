// src/services/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './product.dto';
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
}