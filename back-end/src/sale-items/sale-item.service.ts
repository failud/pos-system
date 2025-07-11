import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaleItem } from './sale-item.entity';
import { CreateSaleItemDto, UpdateSaleItemDto } from './sale-item.dto';

@Injectable()
export class SaleItemService {
  constructor(
    @InjectRepository(SaleItem)
    private saleItemRepository: Repository<SaleItem>,
  ) {}

  async create(createSaleItemDto: CreateSaleItemDto): Promise<SaleItem> {
    const saleItem = this.saleItemRepository.create(createSaleItemDto);
    return await this.saleItemRepository.save(saleItem);
  }

  async findAll(): Promise<SaleItem[]> {
    return await this.saleItemRepository.find({
      relations: ['sale', 'product'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<SaleItem> {
    const saleItem = await this.saleItemRepository.findOne({
      where: { id },
      relations: ['sale', 'product'],
    });
    if (!saleItem) {
      throw new NotFoundException(`Sale item with ID ${id} not found`);
    }
    return saleItem;
  }

  async findBySaleId(saleId: string): Promise<SaleItem[]> {
    return await this.saleItemRepository.find({
      where: { sale_id: saleId },
      relations: ['product'],
      order: { created_at: 'ASC' },
    });
  }

  async findByProductId(productId: string): Promise<SaleItem[]> {
    return await this.saleItemRepository.find({
      where: { product_id: productId },
      relations: ['sale'],
      order: { created_at: 'DESC' },
    });
  }

  async update(id: string, updateSaleItemDto: UpdateSaleItemDto): Promise<SaleItem> {
    const saleItem = await this.findOne(id);
    Object.assign(saleItem, updateSaleItemDto);
    return await this.saleItemRepository.save(saleItem);
  }

  async remove(id: string): Promise<void> {
    const saleItem = await this.findOne(id);
    await this.saleItemRepository.remove(saleItem);
  }

  async getSaleItemsSummary(saleId: string): Promise<{
    totalItems: number;
    totalQuantity: number;
    subtotal: number;
    totalDiscount: number;
    totalTax: number;
    grandTotal: number;
  }> {
    const saleItems = await this.findBySaleId(saleId);
    
    const summary = saleItems.reduce((acc, item) => {
      acc.totalItems += 1;
      acc.totalQuantity += item.quantity;
      acc.subtotal += item.unit_price * item.quantity;
      acc.totalDiscount += item.discount_amount;
      acc.totalTax += item.tax_amount;
      acc.grandTotal += item.total_amount;
      return acc;
    }, {
      totalItems: 0,
      totalQuantity: 0,
      subtotal: 0,
      totalDiscount: 0,
      totalTax: 0,
      grandTotal: 0,
    });

    return summary;
  }
}