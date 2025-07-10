// src/entities/sale.entity.ts
import { Customer } from 'src/customers/customer.entity';
import { SaleItem } from 'src/sale-items/sale-item.entity';
import { Store } from 'src/stores/store.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';


@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sale_number', unique: true, length: 50 })
  saleNumber: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ name: 'payment_status', length: 20, default: 'pending' })
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';

  @Column({ name: 'sale_status', length: 20, default: 'completed' })
  saleStatus: 'completed' | 'cancelled' | 'returned';

  @Column({ name: 'payment_method', length: 20, nullable: true })
  paymentMethod: 'cash' | 'card' | 'transfer' | 'mixed';

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Store, store => store.sales)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'store_id', nullable: true })
  storeId: string;

  @ManyToOne(() => User, user => user.sales)
  @JoinColumn({ name: 'cashier_id' })
  cashier: User;

  @Column({ name: 'cashier_id', nullable: true })
  cashierId: string;

  @ManyToOne(() => Customer, customer => customer.sales)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'customer_id', nullable: true })
  customerId: string;

  @OneToMany(() => SaleItem, saleItem => saleItem.sale)
  saleItems: SaleItem[];
}