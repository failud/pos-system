import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandDto, UpdateBrandDto } from './brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const brand = this.brandRepository.create(createBrandDto);
    return await this.brandRepository.save(brand);
  }

  async findAll(): Promise<Brand[]> {
    return await this.brandRepository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandRepository.findOne({
      where: { id, is_active: true },
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

  async remove(id: string): Promise<void> {
    const brand = await this.findOne(id);
    brand.is_active = false;
    await this.brandRepository.save(brand);
  }
}