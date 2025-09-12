import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Space,
    Input,
    Card,
    Tag,
    Modal,
    Select,
    Row,
    Col,
    Statistic,
    message,
    Badge,
    Avatar,
    Dropdown,
    Tooltip,
    Progress
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    BarChartOutlined,
    ShoppingCartOutlined,
    WarningOutlined,
    MoreOutlined,
    ScanOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { BadgeProps, MenuProps } from 'antd';
import Layout from '../components/Layout/Layout';
import { useLanguage } from '../components/languages/LanguageContext';
import type { Product, ProductResponse } from '../types/ProductType';
import { getAllCategory } from '../services/CategorySV';
import { getAllProducts } from '../services/ProductSV';
import type { Category } from '../types/CategoryType';
import { Content } from 'antd/es/layout/layout';
import { AddEditProduct } from '../components/modals/products/AddEditProduct';

const { Search } = Input;
const { Option } = Select;

interface StockStatus {
    status: 'success' | 'exception' | 'active';
    text: string;
}

const ProductPage: React.FC = () => {
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [productResponse, setProductResponse] = useState<ProductResponse | null>(null);
    const [isEditing, setEditing] = useState<boolean>(false);
    const [modalProduct, setModalProduct] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Statistics states
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [activeProducts, setActiveProducts] = useState<number>(0);
    const [lowStockProducts, setLowStockProducts] = useState<number>(0);
    const [totalValue, setTotalValue] = useState<number>(0);

    const fetch_category = async () => {
        try {
            const response = await getAllCategory();
            console.log("category response -------- ", response);
            if (response) {
                setCategoryList(response.data.data);
            }
        } catch (error: any) {
            console.log("Error get categories -------- ", error);
        }
    };

    const fetch_product = async (pageNum?: number, limitNum?: number) => {
        setLoading(true);
        try {
            const response = await getAllProducts(pageNum || page, limitNum || limit);
            setProductResponse(response.data);
            
            // Calculate statistics
            const productData = response.data.data;
            setTotalProducts(response.data.pagination.total);
            
            const activeCount = productData.filter((product: { isActive: any; }) => product.isActive).length;
            setActiveProducts(activeCount);
            
            const lowStockCount = productData.filter((product: { stockQuantity: number; minStockLevel: number; }) => 
                product.stockQuantity <= product.minStockLevel
            ).length;
            setLowStockProducts(lowStockCount);
            
            const totalStockValue = productData.reduce((sum: number, product: { sellingPrice: string; stockQuantity: number; }) => 
                sum + (parseFloat(product.sellingPrice) * product.stockQuantity), 0
            );
            setTotalValue(totalStockValue);
            
            console.log("Product response", response.data);
        } catch (error: any) {
            console.log("Error get Product list", error);
            message.error('ไม่สามารถโหลดข้อมูลสินค้าได้');
        } finally {
            setLoading(false);
        }
    };

    const productList = productResponse?.data || [];

    useEffect(() => {
        fetch_category();
    }, []);

    useEffect(() => {
        fetch_product();
    }, [limit, page]);

    const getStockStatus = (current: number, min: number, max: number): StockStatus => {
        if (current <= min) return { status: 'exception', text: `${t("low stock")}` };
        if (current >= max) return { status: 'active', text: `${t("full stock")}` };
        return { status: 'success', text: `${t("normal")}` };
    };

    const getStockProgress = (current: number, min: number, max: number): number => {
        const percentage = ((current - min) / (max - min)) * 100;
        return Math.min(Math.max(percentage, 0), 100);
    };

    const mapStatus = (status: string): BadgeProps['status'] => {
        switch (status) {
            case 'exception': return 'error';
            case 'active': return 'success';
            default: return status as BadgeProps['status'];
        }
    };

    const handleEdit = (record: Product): void => {
        setEditingProduct(record);
        setEditing(true);
        setModalProduct(true);
    };

    const handleDelete = (record: Product): void => {
        Modal.confirm({
            title: 'ยืนยันการลบ',
            content: `คุณต้องการลบสินค้า "${record.name}" ใช่หรือไม่?`,
            okText: 'ลบ',
            cancelText: 'ยกเลิก',
            okType: 'danger',
            onOk: () => {
                // Here you would call your delete API
                // For now, just show success message
                message.success('ลบสินค้าสำเร็จ');
                fetch_product(); // Refresh the list
            },
        });
    };

    const handlePaginationChange = (pageNum: number, pageSize?: number) => {
        setPage(pageNum);
        if (pageSize && pageSize !== limit) {
            setLimit(pageSize);
        }
        fetch_product(pageNum, pageSize || limit);
    };

    const filteredProducts = productList.filter(product => {
        const matchesSearch = !searchText || 
            product.name.toLowerCase().includes(searchText.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchText.toLowerCase()) ||
            (product.barcode && product.barcode.includes(searchText));
        
        const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    const columns: ColumnsType<Product> = [
        {
            title: `${t("image")}`,
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: 80,
            render: (url: string, record: Product) => (
                <Content className='flex justify-center'>
                    <Avatar
                        size={50}
                        src={url}
                        style={{ backgroundColor: '#f0f0f0' }}
                    >
                        {record.name.charAt(0)}
                    </Avatar>
                </Content>
            ),
        },
        {
            title: `${t("product name")}`,
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text: string, record: Product) => (
                <div>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                        SKU: {record.sku}
                    </div>
                </div>
            ),
        },
        {
            title: `${t("category")}`,
            dataIndex: 'category',
            key: 'category',
            width: 120,
            render: (category: any) => (
                <Tag color="blue">{category?.name || 'N/A'}</Tag>
            ),
        },
        {
            title: `${t("barcode")}`,
            dataIndex: 'barcode',
            key: 'barcode',
            width: 120,
            render: (text: string) => (
                <div style={{ fontFamily: 'monospace', fontSize: 12 }}>
                    {text || '-'}
                </div>
            ),
        },
        {
            title: `${t("price")}`,
            key: 'price',
            width: 120,
            render: (_, record: Product) => (
                <div>
                    <div style={{ fontWeight: 500, color: '#52c41a' }}>
                        ฿{parseFloat(record.sellingPrice).toFixed(2)}
                    </div>
                    {record.discountPrice && (
                        <div style={{ fontSize: 12, color: '#ff4d4f', textDecoration: 'line-through' }}>
                            ฿{parseFloat(record.discountPrice).toFixed(2)}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: `${t("stock")}`,
            key: 'stock',
            width: 150,
            render: (_, record: Product) => {
                const stockStatus = getStockStatus(
                    record.stockQuantity,
                    record.minStockLevel,
                    record.maxStockLevel
                );
                const progress = getStockProgress(
                    record.stockQuantity,
                    record.minStockLevel,
                    record.maxStockLevel
                );

                return (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 500 }}>{record.stockQuantity}</span>
                            <span style={{ fontSize: 12, color: '#666' }}>{record.unit}</span>
                            <Badge
                                status={mapStatus(stockStatus.status)}
                                text={stockStatus.text}
                                style={{ fontSize: 10 }}
                            />
                        </div>
                        <Progress
                            percent={progress}
                            size="small"
                            showInfo={false}
                            status={stockStatus.status}
                            style={{ marginTop: 4 }}
                        />
                    </div>
                );
            },
        },
        {
            title: `${t("status")}`,
            dataIndex: 'isActive',
            key: 'isActive',
            width: 100,
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? `${t("active")}` : `${t("disable")}`}
                </Tag>
            ),
        },
        {
            title: `${t("manage")}`,
            key: 'actions',
            width: 120,
            render: (_, record: Product) => {
                const dropdownItems: MenuProps['items'] = [
                    {
                        key: 'barcode',
                        label: `${t("print barcode")}`,
                        icon: <ScanOutlined />,
                    },
                    {
                        key: 'stock',
                        label: `${t("update stock")}`,
                        icon: <BarChartOutlined />,
                    },
                ];

                return (
                    <Space size="small">
                        <Tooltip title={`${t("edit")}`}>
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(record)}
                                style={{ color: '#1890ff' }}
                            />
                        </Tooltip>
                        <Tooltip title={`${t("delete")}`}>
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record)}
                                style={{ color: '#ff4d4f' }}
                            />
                        </Tooltip>
                        <Dropdown
                            menu={{ items: dropdownItems }}
                            trigger={['click']}
                        >
                            <Button type="text" icon={<MoreOutlined />} />
                        </Dropdown>
                    </Space>
                );
            },
        },
    ];

    return (
        <>
            <Layout>
                {/* Header */}
                <div className='lg:px-[4vw] lg:py-[2vw]'>
                    <div style={{ marginBottom: '24px' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 8px 0' }}>
                            {t("product management")}
                        </h1>
                    </div>

                    {/* Statistics Cards */}
                    <Row gutter={16} style={{ marginBottom: '24px' }}>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title={t("all products")}
                                    value={totalProducts}
                                    prefix={<ShoppingCartOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title={t("activated products")}
                                    value={activeProducts}
                                    prefix={<ShoppingCartOutlined />}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title={t("low stock")}
                                    value={lowStockProducts}
                                    prefix={<WarningOutlined />}
                                    valueStyle={{ color: '#ff4d4f' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title={t("value in stock")}
                                    value={totalValue}
                                    prefix="฿"
                                    precision={2}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Card>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px',
                            flexWrap: 'wrap',
                            gap: '8px'
                        }}>
                            <Space wrap>
                                <Search
                                    placeholder={t("search product, SKU or barcode")}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: 250 }}
                                    prefix={<SearchOutlined />}
                                />
                                <Select
                                    placeholder={t("select category")}
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                    style={{ width: 150 }}
                                    allowClear
                                >
                                    {categoryList?.filter(category => !category.parentId).map((category) => (
                                        <Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Space>

                            <Space wrap>
                                <Button icon={<ReloadOutlined />} onClick={() => fetch_product()}>
                                    {t("refresh")}
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        setEditing(false);
                                        setEditingProduct(null);
                                        setModalProduct(true);
                                    }}
                                >
                                    {t("add new product")}
                                </Button>
                            </Space>
                        </div>

                        {/* Products Table */}
                        <Table
                            columns={columns}
                            dataSource={filteredProducts}
                            rowKey="id"
                            loading={loading}
                            pagination={{
                                total: productResponse?.pagination.total || 0,
                                current: productResponse?.pagination.page || 1,
                                pageSize: productResponse?.pagination.limit || 10,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `${t("total")} ${total} ${t("items")}`,
                                onChange: handlePaginationChange,
                                onShowSizeChange: handlePaginationChange,
                            }}
                            scroll={{ x: 1000 }}
                            size="small"
                        />
                    </Card>

                    <AddEditProduct 
                        editingProduct={editingProduct} 
                        open={modalProduct} 
                        close={() => {
                            setModalProduct(false);
                            setEditingProduct(null);
                            setEditing(false);
                        }}
                        onSuccess={() => {
                            fetch_product();
                        }}
                    />
                </div>
            </Layout>
        </>
    );
};

export default ProductPage;