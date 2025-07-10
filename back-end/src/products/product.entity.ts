import { Brand } from 'src/brands/brand.entity';
import { Category } from 'src/categorys/category.entity';
import { SaleItem } from 'src/sale-items/sale-item.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';


@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ unique: true, length: 100 })
  sku: string;

  @Column({ unique: true, length: 100, nullable: true })
  barcode: string;

  @Column({ name: 'cost_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
  costPrice: number;

  @Column({ name: 'selling_price', type: 'decimal', precision: 10, scale: 2 })
  sellingPrice: number;

  @Column({ name: 'discount_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountPrice: number;

  @Column({ name: 'stock_quantity', default: 0 })
  stockQuantity: number;

  @Column({ name: 'min_stock_level', default: 0 })
  minStockLevel: number;

  @Column({ name: 'max_stock_level', nullable: true })
  maxStockLevel: number;

  @Column({ length: 20, default: 'piece' })
  unit: string;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @ManyToOne(() => Brand, brand => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ name: 'brand_id', nullable: true })
  brandId: string;

  @OneToMany(() => SaleItem, saleItem => saleItem.product)
  saleItems: SaleItem[];
}