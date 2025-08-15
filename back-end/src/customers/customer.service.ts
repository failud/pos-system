import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateCustomerDto, CustomerPaginationQueryDto, UpdateCustomerDto } from './customer.dto';
import { Customer } from './customer.entity';
import { PaginatedResult } from 'src/common/dto/pagination.dto';

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

    async findAll(paginationQuery?: CustomerPaginationQueryDto): Promise<PaginatedResult<Customer>> {
        const {
            page = 1,
            limit = 10,
            search = '',
            sortBy = 'createdAt',
            sortOrder = 'DESC',
            gender,
            minLoyaltyPoints,
            maxLoyaltyPoints,
            minTotalSpent,
            maxTotalSpent,
            dateFrom,
            dateTo
        } = paginationQuery || {};

        const queryBuilder = this.customerRepository.createQueryBuilder('customer');
        
        // Base filter for active customers
        queryBuilder.where('customer.is_active = :isActive', { isActive: true });

        // Apply filters
        this.applyFilters(queryBuilder, {
            search,
            gender,
            minLoyaltyPoints,
            maxLoyaltyPoints,
            minTotalSpent,
            maxTotalSpent,
            dateFrom,
            dateTo
        });

        // Add sorting
        const sortField = this.mapSortField(sortBy);
        queryBuilder.orderBy(`customer.${sortField}`, sortOrder);

        // Add pagination
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);

        // Execute query and get total count
        const [data, total] = await queryBuilder.getManyAndCount();

        // Calculate pagination metadata
        const totalPages = Math.ceil(total / limit);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            }
        };
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

    async getCustomerStats(): Promise<{
        totalCustomers: number;
        activeCustomers: number;
        totalLoyaltyPoints: number;
        totalSpent: number;
        averageSpent: number;
    }> {
        const activeCustomers = await this.customerRepository.find({
            where: { is_active: true }
        });

        const totalCustomers = await this.customerRepository.count();
        const totalLoyaltyPoints = activeCustomers.reduce((sum, customer) => sum + (customer.loyalty_points || 0), 0);
        const totalSpent = activeCustomers.reduce((sum, customer) => sum + (customer.total_spent || 0), 0);
        const averageSpent = activeCustomers.length > 0 ? totalSpent / activeCustomers.length : 0;

        return {
            totalCustomers,
            activeCustomers: activeCustomers.length,
            totalLoyaltyPoints,
            totalSpent,
            averageSpent: Math.round(averageSpent * 100) / 100
        };
    }

    private applyFilters(
        queryBuilder: SelectQueryBuilder<Customer>,
        filters: {
            search?: string;
            gender?: string;
            minLoyaltyPoints?: number;
            maxLoyaltyPoints?: number;
            minTotalSpent?: number;
            maxTotalSpent?: number;
            dateFrom?: string;
            dateTo?: string;
        }
    ): void {
        const {
            search,
            gender,
            minLoyaltyPoints,
            maxLoyaltyPoints,
            minTotalSpent,
            maxTotalSpent,
            dateFrom,
            dateTo
        } = filters;

        // Search functionality
        if (search) {
            queryBuilder.andWhere(
                '(customer.first_name ILIKE :search OR ' +
                'customer.last_name ILIKE :search OR ' +
                'customer.email ILIKE :search OR ' +
                'customer.phone ILIKE :search OR ' +
                'customer.customer_code ILIKE :search)',
                { search: `%${search}%` }
            );
        }

        // Gender filter
        if (gender) {
            queryBuilder.andWhere('customer.gender = :gender', { gender });
        }

        // Loyalty points range filter
        if (minLoyaltyPoints !== undefined) {
            queryBuilder.andWhere('customer.loyalty_points >= :minLoyaltyPoints', { minLoyaltyPoints });
        }
        if (maxLoyaltyPoints !== undefined) {
            queryBuilder.andWhere('customer.loyalty_points <= :maxLoyaltyPoints', { maxLoyaltyPoints });
        }

        // Total spent range filter
        if (minTotalSpent !== undefined) {
            queryBuilder.andWhere('customer.total_spent >= :minTotalSpent', { minTotalSpent });
        }
        if (maxTotalSpent !== undefined) {
            queryBuilder.andWhere('customer.total_spent <= :maxTotalSpent', { maxTotalSpent });
        }

        // Date range filter (for created_at)
        if (dateFrom) {
            queryBuilder.andWhere('customer.created_at >= :dateFrom', { dateFrom });
        }
        if (dateTo) {
            queryBuilder.andWhere('customer.created_at <= :dateTo', { dateTo: `${dateTo} 23:59:59` });
        }
    }

    private mapSortField(sortBy: string): string {
        const sortFieldMap = {
            'createdAt': 'created_at',
            'firstName': 'first_name',
            'lastName': 'last_name',
            'email': 'email',
            'phone': 'phone',
            'customerCode': 'customer_code',
            'totalSpent': 'total_spent',
            'loyaltyPoints': 'loyalty_points'
        };
        
        return sortFieldMap[sortBy] || 'created_at';
    }

    private async generateCustomerCode(): Promise<string> {
        const count = await this.customerRepository.count();
        return `CUS${String(count + 1).padStart(6, '0')}`;
    }
}