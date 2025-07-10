import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Sale } from '../sales/sale.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true, nullable: true })
  customer_code: string;

  @Column({ length: 50, nullable: true })
  first_name: string;

  @Column({ length: 50, nullable: true })
  last_name: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ length: 10, nullable: true })
  gender: string; // male, female, other

  @Column({ type: 'int', default: 0 })
  loyalty_points: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_spent: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Sale, sale => sale.customer)
  sales: Sale[];
}
