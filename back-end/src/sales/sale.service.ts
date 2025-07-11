
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { SaleItem } from 'src/sale-items/sale-item.entity';
import { Repository, DataSource } from 'typeorm';
import { CreateSaleDto, UpdateSaleDto } from './sale.dto';
import { Sale } from './sale.entity';


@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private saleItemRepository: Repository<SaleItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sale = queryRunner.manager.create(Sale, {
        saleNumber: createSaleDto.saleNumber,
        storeId: createSaleDto.storeId,
        cashierId: createSaleDto.cashierId,
        customerId: createSaleDto.customerId,
        paymentStatus: createSaleDto.paymentStatus || 'pending',
        paymentMethod: createSaleDto.paymentMethod,
        notes: createSaleDto.notes,
      });

      const savedSale = await queryRunner.manager.save(sale);

      let subtotal = 0;
      let totalTax = 0;
      let totalDiscount = 0;

      for (const itemDto of createSaleDto.items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: itemDto.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${itemDto.productId} not found`);
        }

        if (product.stockQuantity < itemDto.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.name}. Available: ${product.stockQuantity}, Requested: ${itemDto.quantity}`
          );
        }

        const lineTotal = itemDto.unitPrice * itemDto.quantity;
        const discountAmount = itemDto.discountAmount || 0;
        const taxableAmount = lineTotal - discountAmount;
        const taxAmount = (taxableAmount * product.taxRate) / 100;
        const totalAmount = taxableAmount + taxAmount;

        const saleItem = queryRunner.manager.create(SaleItem, {
          saleId: savedSale.id,
          productId: itemDto.productId,
          quantity: itemDto.quantity,
          unitPrice: itemDto.unitPrice,
          discountAmount: discountAmount,
          taxAmount: taxAmount,
          totalAmount: totalAmount,
        });

        await queryRunner.manager.save(saleItem);

        product.stockQuantity -= itemDto.quantity;
        await queryRunner.manager.save(product);

        subtotal += lineTotal;
        totalTax += taxAmount;
        totalDiscount += discountAmount;
      }

      savedSale.subtotal = subtotal;
      savedSale.taxAmount = totalTax;
      savedSale.discountAmount = totalDiscount;
      savedSale.totalAmount = subtotal + totalTax - totalDiscount;

      const finalSale = await queryRunner.manager.save(savedSale);

      await queryRunner.commitTransaction();

      return this.findOne(finalSale.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Sale[]> {
    return await this.saleRepository.find({
      relations: ['saleItems', 'saleItems.product', 'cashier', 'customer', 'store'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['saleItems', 'saleItems.product', 'cashier', 'customer', 'store'],
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return sale;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return await this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.saleItems', 'saleItems')
      .leftJoinAndSelect('saleItems.product', 'product')
      .leftJoinAndSelect('sale.cashier', 'cashier')
      .leftJoinAndSelect('sale.customer', 'customer')
      .where('sale.createdAt >= :startDate', { startDate })
      .andWhere('sale.createdAt <= :endDate', { endDate })
      .orderBy('sale.createdAt', 'DESC')
      .getMany();
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.findOne(id);
    
    Object.assign(sale, updateSaleDto);
    await this.saleRepository.save(sale);
    
    return this.findOne(id);
  }

  async cancelSale(id: string): Promise<Sale> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sale = await this.findOne(id);
      
      if (sale.saleStatus !== 'completed') {
        throw new BadRequestException('Can only cancel completed sales');
      }

      for (const item of sale.saleItems) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.product_id },
        });
        
        if (product) {
          product.stockQuantity += item.quantity;
          await queryRunner.manager.save(product);
        }
      }

      sale.saleStatus = 'cancelled';
      const updatedSale = await queryRunner.manager.save(sale);

      await queryRunner.commitTransaction();
      return updatedSale;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getDailySales(date: Date): Promise<{
    totalSales: number;
    totalTransactions: number;
    totalAmount: number;
    totalTax: number;
    totalDiscount: number;
  }> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await this.saleRepository
      .createQueryBuilder('sale')
      .select([
        'COUNT(sale.id) as totalTransactions',
        'SUM(sale.totalAmount) as totalAmount',
        'SUM(sale.taxAmount) as totalTax',
        'SUM(sale.discountAmount) as totalDiscount',
      ])
      .where('sale.createdAt >= :startOfDay', { startOfDay })
      .andWhere('sale.createdAt <= :endOfDay', { endOfDay })
      .andWhere('sale.saleStatus = :status', { status: 'completed' })
      .getRawOne();

    return {
      totalSales: parseInt(result.totalTransactions) || 0,
      totalTransactions: parseInt(result.totalTransactions) || 0,
      totalAmount: parseFloat(result.totalAmount) || 0,
      totalTax: parseFloat(result.totalTax) || 0,
      totalDiscount: parseFloat(result.totalDiscount) || 0,
    };
  }
}