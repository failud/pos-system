import { Product } from 'src/products/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';


@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Self-referencing relationship for parent category
  @ManyToOne(() => Category, category => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  // Relations
  @OneToMany(() => Product, product => product.category)
  products: Product[];
}