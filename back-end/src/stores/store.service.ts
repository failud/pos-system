import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto, UpdateStoreDto } from './store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.storeRepository.create(createStoreDto);
    return await this.storeRepository.save(store);
  }

  async findAll(): Promise<Store[]> {
    return await this.storeRepository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id, is_active: true },
    });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);
    Object.assign(store, updateStoreDto);
    return await this.storeRepository.save(store);
  }

  async remove(id: string): Promise<void> {
    const store = await this.findOne(id);
    store.is_active = false;
    await this.storeRepository.save(store);
  }

  async findByName(name: string): Promise<Store[]> {
    return await this.storeRepository.find({
      where: { 
        name: name,
        is_active: true 
      },
    });
  }
}