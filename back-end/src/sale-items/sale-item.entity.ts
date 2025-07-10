import { Product } from 'src/products/product.entity';
import { Sale } from 'src/sales/sale.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('sale_items')
export class SaleItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Sale, sale => sale.saleItems)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @Column({ name: 'sale_id' })
  saleId: string;

  @ManyToOne(() => Product, product => product.saleItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id' })
  productId: string;
}