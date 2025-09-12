import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { Content } from 'antd/es/layout/layout'
import { useLanguage } from '../components/languages/LanguageContext'
import { Button, Card, Col, Input, Row, Space, Statistic, Table, Tag, Typography } from 'antd'
import { Blocks, CopyCheck, Plus } from 'lucide-react'
import dayjs from 'dayjs'
import { createBrand, deleteBrand, editBrand, getALLBrandPaginated } from '../services/BrandSV'
import type { Brand, BrandInput, BrandResponse } from '../types/BrandType'
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
} from '@ant-design/icons'
import type { Product } from '../types/ProductType'
import { useForm } from 'antd/es/form/Form'
import { successMessage, warningMessage } from '../utils/AntdMessage'
import ConfirmModal from '../components/common/modals/ConfirmModal'
import BrandFormModal from '../components/modals/brand/AddEditBrand'
import ProductListModal from '../components/modals/brand/ProductListInBrand'


function BrandPage() {
    const { Text, Title } = Typography
    const { Search } = Input
    const { t } = useLanguage();
    const [brandList, setBrandList] = useState<BrandResponse | null>(null);
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchText, setSearchText] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false);

    const [isProductModalVisible, setIsProductModalVisible] = useState(false)
    const [selectedCategoryProducts, setSelectedCategoryProducts] = useState<Product[]>([])
    const [selectedCategoryName, setSelectedCategoryName] = useState('')

    const [form] = useForm();
    const [modalADD, setModalADD] = useState<boolean>(false);
    const [currentBrand, setCurrentBrand] = useState<Brand | null>(null)
    const [modalLoading, setModalLoading] = useState<boolean>(false);

    const [deleteID, setDeleteID] = useState<string | null>(null);
    const [modalDelete, setModalDelete] = useState<boolean>(false);

    const getBrandList = async () => {
        try {
            setLoading(true);
            const response = await getALLBrandPaginated(currentPage, pageSize, searchText);
            setBrandList(response.data);
            console.log("Brand response: ", response);
        } catch (error: any) {
            console.log(error.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getBrandList();
    }, [pageSize, currentPage, searchText]);

    const brandData = brandList?.data ? brandList.data : [];

    const handleShowProducts = (brands: Brand) => {
        setSelectedCategoryProducts(brands.products || [])
        setSelectedCategoryName(brands.name)
        setIsProductModalVisible(true)
    }

    const handleADD = async () => {
        try {
            setModalLoading(true);
            const values = await form.validateFields()
            const body = {
                name: values.name,
                description: values.description || '',
                is_active: values.isActive !== undefined ? values.isActive : true,
            }

            if (currentBrand) {
                await editBrand(currentBrand.id, body);
                successMessage.edit('Brand')
            } else {
                await createBrand(body)
                successMessage.create('Brand')
            }

            // Reset form and close modal
            form.resetFields();
            setModalADD(false);
            setCurrentBrand(null);
            getBrandList();

        } catch (error: any) {
            console.log("Error Add new brand", error.data.message)
        } finally {
            setModalLoading(false);
        }
    }

    const handleTableChange = (page: number, size: number) => {
        setCurrentPage(page);
        setPageSize(size);
    }

    const handleSearch = (value: string) => {
        setSearchText(value);
        setCurrentPage(1);
    }

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            const response = await deleteBrand(id);
            console.log("Deleting... ", response.data)
            if (response.data.action == 'deactivated') {
                warningMessage.custom(t(`${response.data.message}`))
            } else if (response.data.action == 'deleted') {
                successMessage.delete(t('Brands'));
            }
            getBrandList();
        } catch (error: any) {
            console.log("Error delete brand", error.data.message);
        } finally {
            setLoading(false);
            setModalDelete(false);
        }
    }

    const handleCloseFormModal = () => {
        setModalADD(false);
        setCurrentBrand(null);
        form.resetFields();
    }

    const handleEditBrand = (record: Brand) => {
        setCurrentBrand(record);
        form.setFieldsValue({
            name: record.name,
            description: record.description,
            isActive: record.is_active
        });
        setModalADD(true);
    }

    const handleAddBrand = () => {
        setCurrentBrand(null);
        form.resetFields();
        setModalADD(true);
    }

    const columns = [
        {
            title: t('No.'),
            key: 'index',
            width: 60,
            render: (_: any, __: Brand, index: number) => (
                <Text className='flex justify-center'>{(currentPage - 1) * pageSize + index + 1}</Text>
            )
        },
        {
            title: t('Name'),
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: t('Description'),
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => <Text>{text || '-'}</Text>
        },
        {
            title: <p className='text-center'>{t('Status')}</p>,
            dataIndex: 'is_active',
            key: 'status',
            render: (isActive: boolean) => (
                <Content className='flex justify-center'>
                    <Tag className='text-center' color={isActive ? 'blue' : 'red'}>
                        {isActive ? t('Active') : t('Inactive')}
                    </Tag>
                </Content>
            )
        },
        {
            title: t('Products used'),
            dataIndex: 'products',
            key: 'products',
            render: (products: Brand[] | undefined, record: Brand) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag color={products && products.length == 0 ? "error" : "purple"}>
                        {products ? products.length : 0}
                    </Tag>
                    {products && products.length > 0 && (
                        <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleShowProducts(record)}
                        >
                            {t('detail')}
                        </Button>
                    )}
                </div>
            )
        },
        {
            title: t('Created At'),
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => dayjs(date).format("DD/MM/YYYY - HH:mm")
        },
        {
            title: <p className='text-center'>{t('Action')}</p>,
            key: 'action',
            render: (_: any, record: Brand) => (
                <Content className='flex justify-center gap-2'>
                    <Button
                        shape='circle'
                        icon={<EditOutlined />}
                        onClick={() => handleEditBrand(record)}
                    />
                    <Button
                        shape='circle'
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            setDeleteID(record.id)
                            setModalDelete(true)
                        }}
                        danger
                    />
                </Content>
            )
        }
    ]

    return (
        <Layout>
            <ConfirmModal
                onConfirm={() => handleDelete(deleteID ? deleteID : '')}
                onCancel={() => setModalDelete(false)}
                visible={modalDelete}
                type={'delete'}
            />

            <Content className='lg:px-[4vw] lg:py-[2vw]'>
                <Title level={3}>
                    {t("Brand Management")}
                </Title>

                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} md={12}>
                        <Card className='shadow-md'>
                            <Statistic
                                title={t('Total Brands')}
                                value={brandList?.pagination.total || 0}
                                prefix={<Blocks />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={12}>
                        <Card className='shadow-md'>
                            <Statistic
                                title={t('Active Brands')}
                                value={brandList?.activeBrandCount || 0}
                                prefix={<CopyCheck />}
                                valueStyle={{ color: '#9911ff' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Main Table Card */}
                <Row>
                    <Col xs={24}>
                        <Card className='shadow-xl'>
                            {/* Search and Add Button */}
                            <div className='flex pb-5 justify-between flex-wrap gap-4'>
                                <Search
                                    placeholder={t('Search brands...')}
                                    allowClear
                                    enterButton
                                    style={{ width: 300, maxWidth: '100%' }}
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    onSearch={handleSearch}
                                />
                                <Button
                                    icon={<Plus />}
                                    type='primary'
                                    onClick={handleAddBrand}
                                >
                                    {t("Add brand")}
                                </Button>
                            </div>

                            {/* Table with Pagination */}
                            <Table
                                columns={columns}
                                dataSource={brandData}
                                rowKey="id"
                                loading={loading}
                                scroll={{ x: 'max-content' }}
                                pagination={{
                                    current: currentPage,
                                    pageSize: pageSize,
                                    total: brandList?.pagination.total || 0,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    pageSizeOptions: ['5', '10', '20', '50', '100'],
                                    onChange: handleTableChange,
                                    onShowSizeChange: handleTableChange,
                                    showLessItems: true,
                                    responsive: true,
                                }}
                                size="large"
                            />
                        </Card>
                    </Col>
                </Row>
            </Content>

            {/* Brand Form Modal */}
            <BrandFormModal
                visible={modalADD}
                currentBrand={currentBrand}
                form={form}
                onOk={handleADD}
                onCancel={handleCloseFormModal}
                loading={modalLoading}
            />

            {/* Products List Modal */}
            <ProductListModal
                visible={isProductModalVisible}
                brandName={selectedCategoryName}
                products={selectedCategoryProducts}
                onClose={() => setIsProductModalVisible(false)}
            />
        </Layout>
    )
}

export default BrandPage;