import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto, UpdateCustomerDto } from './customer.dto';
import { Customer } from './customer.entity';


@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
    ) { }

    async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        // Generate customer code if not provided
        if (!createCustomerDto.customer_code) {
            createCustomerDto.customer_code = await this.generateCustomerCode();
        }

        const customer = this.customerRepository.create(createCustomerDto);
        return await this.customerRepository.save(customer);
    }

    async findAll(): Promise<Customer[]> {
        return await this.customerRepository.find({
            where: { is_active: true },
            order: { created_at: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Customer> {
        const customer = await this.customerRepository.findOne({
            where: { id, is_active: true },
        });
        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }

    async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
        const customer = await this.findOne(id);
        Object.assign(customer, updateCustomerDto);
        return await this.customerRepository.save(customer);
    }

    async remove(id: string): Promise<void> {
        const customer = await this.findOne(id);
        customer.is_active = false;
        await this.customerRepository.save(customer);
    }

    async findByPhone(phone: string): Promise<Customer> {
        const customer = await this.customerRepository.findOne({
            where: { phone, is_active: true },
        });
        if (!customer) {
            throw new NotFoundException(`Customer with phone ${phone} not found`);
        }
        return customer;
    }

    async findByEmail(email: string): Promise<Customer> {
        const customer = await this.customerRepository.findOne({
            where: { email, is_active: true },
        });
        if (!customer) {
            throw new NotFoundException(`Customer with email ${email} not found`);
        }
        return customer;
    }

    private async generateCustomerCode(): Promise<string> {
        const count = await this.customerRepository.count();
        return `CUS${String(count + 1).padStart(6, '0')}`;
    }
}