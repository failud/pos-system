import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Category } from './categorys/category.entity';
import { Brand } from './brands/brand.entity';
import { Customer } from './customers/customer.entity';
import { Store } from './stores/store.entity';
import { Sale } from './sales/sale.entity';
import { SaleItem } from './sale-items/sale-item.entity';


import { ProductModule } from './products/product.module';
import { CategoryModule } from './categorys/category.module';
import { SaleModule } from './sales/dale.module';
import { BrandModule } from './brands/brand.module';
import { CustomerModule } from './customers/customer.module';
import { StoreModule } from './stores/store.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'pos_system',
      entities: [
        User,
        Product,
        Category,
        Brand,
        Customer,
        Store,
        Sale,
        SaleItem
      ],
      synchronize: false, 
      logging: true, 
    }),
    ProductModule,
    CategoryModule,
    SaleModule,
    BrandModule,
    CustomerModule,
    StoreModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }