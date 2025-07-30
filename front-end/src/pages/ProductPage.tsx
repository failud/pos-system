import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Space,
    Input,
    Card,
    Tag,
    Modal,
    Form,
    InputNumber,
    Select,
    Switch,
    Row,
    Col,
    Statistic,
    Divider,
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
    ExportOutlined,
    ImportOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import Layout from '../components/Layout/Layout';
import { useLanguage } from '../components/languages/LanguageContext';
import type { Category, Product, ProductFormValues } from '../types/ProductType';
import { getAllCategory } from '../services/CategorySV';
import { getAllProducts } from '../services/ProductSV';

const { Search } = Input;
const { Option } = Select;

interface StockStatus {
    status: 'error' | 'warning' | 'success';
    text: string;
}

const ProductPage: React.FC = () => {

    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form] = Form.useForm<ProductFormValues>();
    const [categoryList, setCategoryList] = useState<Category[]>([])


    const sampleProducts: Product[] = [
        {
            id: "c4ee7b52-962f-4d73-8a95-33f6a02d2d83",
            name: "โออิชิ กรีนที ขวด 500 มล.",
            description: "ชาเขียวโออิชิ ขนาด 500 มิลลิลิตร",
            sku: "OISHI-GT-500ML",
            barcode: "8850001112223",
            costPrice: "15.00",
            sellingPrice: "25.00",
            discountPrice: "20.00",
            stockQuantity: 20,
            minStockLevel: 5,
            maxStockLevel: 200,
            unit: "ขวด",
            taxRate: "7.00",
            isActive: true,
            imageUrl: "https://example.com/images/oishi-greentea-500ml.jpg",
            createdAt: "2025-07-10T08:05:24.738Z",
            updatedAt: "2025-07-10T08:40:33.694Z",
            category: {
                id: "b291e282-6783-48fa-a661-a99971fe0c56",
                name: "เครื่องดื่มเย็น",
                description: "หมวดหมู่เครื่องดื่มเย็น",
                isActive: true
            },
            brand: {
                id: "c46068ab-06a4-415f-895a-cf283dcb39b4",
                name: "No name",
                description: "br mi y drk ...",
                is_active: true
            }
        }
    ];

    const fetch_category = async () => {
        try {
            const response = await getAllCategory();
            console.log("categoy response -------- ", response)
            if (response) {
                setCategoryList(response.data);
            }
        } catch (error: any) {
            console.log("Error get categories -------- ", error)
        }
    }

    const fetch_product = async () => {
        try {
            const response = await getAllProducts();
            console.log("Product response", response)
        } catch (error: any) {
            console.log("Error get Product list", error)
        }
    }

    useEffect(() => {
        setProducts(sampleProducts);
        fetch_category();
        fetch_product();
    }, []);

    const getStockStatus = (current: number, min: number, max: number): StockStatus => {
        if (current <= min) return { status: 'error', text: 'สต็อกต่ำ' };
        if (current >= max) return { status: 'warning', text: 'สต็อกเต็ม' };
        return { status: 'success', text: 'ปกติ' };
    };

    const getStockProgress = (current: number, min: number, max: number): number => {
        const percentage = ((current - min) / (max - min)) * 100;
        return Math.min(Math.max(percentage, 0), 100);
    };

    const columns: ColumnsType<Product> = [
        {
            title: `${t("image")}`,
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: 80,
            render: (url: string, record: Product) => (
                <Avatar
                    size={50}
                    src={url}
                    style={{ backgroundColor: '#f0f0f0' }}
                >
                    {record.name.charAt(0)}
                </Avatar>
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
            dataIndex: ['category', 'name'],
            key: 'category',
            width: 120,
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: `${t("barcode")}`,
            dataIndex: 'barcode',
            key: 'barcode',
            width: 120,
            render: (text: string) => (
                <div style={{ fontFamily: 'monospace', fontSize: 12 }}>
                    {text}
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
                                status={stockStatus.status}
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
                    {isActive ? 'ใช้งาน' : 'ปิดใช้งาน'}
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

    const handleEdit = (record: Product): void => {
        setEditingProduct(record);
        form.setFieldsValue({
            ...record,
            costPrice: parseFloat(record.costPrice),
            sellingPrice: parseFloat(record.sellingPrice),
            discountPrice: record.discountPrice ? parseFloat(record.discountPrice) : undefined,
            taxRate: parseFloat(record.taxRate),
            categoryId: record.category.id,
            brandId: record.brand.id,
        });
        setIsModalVisible(true);
    };

    const handleDelete = (record: Product): void => {
        Modal.confirm({
            title: 'ยืนยันการลบ',
            content: `คุณต้องการลบสินค้า "${record.name}" ใช่หรือไม่?`,
            okText: 'ลบ',
            cancelText: 'ยกเลิก',
            okType: 'danger',
            onOk: () => {
                setProducts(products.filter(p => p.id !== record.id));
                message.success('ลบสินค้าสำเร็จ');
            },
        });
    };

    const handleSubmit = async (values: ProductFormValues): Promise<void> => {
        setLoading(true);
        try {
            if (editingProduct) {
                // Update existing product
                const updatedProducts = products.map(p =>
                    p.id === editingProduct.id ? {
                        ...p,
                        ...values,
                        costPrice: values.costPrice.toString(),
                        sellingPrice: values.sellingPrice.toString(),
                        discountPrice: values.discountPrice?.toString() || '',
                        taxRate: values.taxRate.toString(),
                        updatedAt: new Date().toISOString(),
                    } : p
                );
                setProducts(updatedProducts);
                message.success('อัปเดตสินค้าสำเร็จ');
            } else {
                // Create new product
                const newProduct: Product = {
                    ...values,
                    id: Date.now().toString(),
                    costPrice: values.costPrice.toString(),
                    sellingPrice: values.sellingPrice.toString(),
                    discountPrice: values.discountPrice?.toString() || '',
                    taxRate: values.taxRate.toString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    category: {
                        id: values.categoryId,
                        name: 'เครื่องดื่มเย็น',
                        description: 'หมวดหมู่เครื่องดื่มเย็น',
                        isActive: true
                    },
                    brand: {
                        id: values.brandId,
                        name: 'No name',
                        description: 'br mi y drk ...',
                        is_active: true
                    },
                    imageUrl: 'https://example.com/images/default-product.jpg',
                };
                setProducts([...products, newProduct]);
                message.success('เพิ่มสินค้าสำเร็จ');
            }
            setIsModalVisible(false);
            setEditingProduct(null);
            form.resetFields();
        } catch (error) {
            message.error('เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchText.toLowerCase()) ||
            product.barcode.includes(searchText);
        const matchesCategory = !selectedCategory || product.category.id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Calculate statistics
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.isActive).length;
    const lowStockProducts = products.filter(p => p.stockQuantity <= p.minStockLevel).length;
    const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.sellingPrice) * p.stockQuantity), 0);

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

                    {/* Main Content */}
                    <Card>
                        {/* Toolbar */}
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
                                    {categoryList?.filter(category => !category.parent_id).map((category) => (
                                        <Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Space>

                            <Space wrap>
                                {/* <Button icon={<ImportOutlined />}>
                                    t({"import"})
                                </Button>
                                <Button icon={<ExportOutlined />}>
                                    {t("export")}
                                </Button> */}
                                <Button icon={<ReloadOutlined />} onClick={() => setProducts(sampleProducts)}>
                                    {t("refresh")}
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        setEditingProduct(null);
                                        form.resetFields();
                                        setIsModalVisible(true);
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
                                total: filteredProducts.length,
                                pageSize: 10,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} จาก ${total} รายการ`,
                            }}
                            scroll={{ x: 1000 }}
                            size="small"
                        />
                    </Card>

                </div>
            </Layout>

            {/* Product Modal */}
            <Modal
                centered
                title={editingProduct ? `${t("edit product")}` : `${t("add new product")}`}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingProduct(null);
                    form.resetFields();
                }}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="ชื่อสินค้า"
                                name="name"
                                rules={[{ required: true, message: 'กรุณากรอกชื่อสินค้า' }]}
                            >
                                <Input placeholder="ชื่อสินค้า" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="SKU"
                                name="sku"
                                rules={[{ required: true, message: 'กรุณากรอก SKU' }]}
                            >
                                <Input placeholder="SKU" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="รายละเอียด"
                        name="description"
                    >
                        <Input.TextArea rows={2} placeholder="รายละเอียดสินค้า" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="บาร์โค้ด"
                                name="barcode"
                                rules={[{ required: true, message: 'กรุณากรอกบาร์โค้ด' }]}
                            >
                                <Input placeholder="บาร์โค้ด" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="หน่วย"
                                name="unit"
                                rules={[{ required: true, message: 'กรุณากรอกหน่วย' }]}
                            >
                                <Input placeholder="หน่วย" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="ราคาต้นทุน"
                                name="costPrice"
                                rules={[{ required: true, message: 'กรุณากรอกราคาต้นทุน' }]}
                            >
                                <InputNumber
                                    placeholder="0.00"
                                    style={{ width: '100%' }}
                                    precision={2}
                                    min={0}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="ราคาขาย"
                                name="sellingPrice"
                                rules={[{ required: true, message: 'กรุณากรอกราคาขาย' }]}
                            >
                                <InputNumber
                                    placeholder="0.00"
                                    style={{ width: '100%' }}
                                    precision={2}
                                    min={0}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="ราคาส่วนลด"
                                name="discountPrice"
                            >
                                <InputNumber
                                    placeholder="0.00"
                                    style={{ width: '100%' }}
                                    precision={2}
                                    min={0}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="จำนวนสต็อก"
                                name="stockQuantity"
                                rules={[{ required: true, message: 'กรุณากรอกจำนวนสต็อก' }]}
                            >
                                <InputNumber
                                    placeholder="0"
                                    style={{ width: '100%' }}
                                    min={0}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="สต็อกต่ำสุด"
                                name="minStockLevel"
                                rules={[{ required: true, message: 'กรุณากรอกสต็อกต่ำสุด' }]}
                            >
                                <InputNumber
                                    placeholder="0"
                                    style={{ width: '100%' }}
                                    min={0}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="สต็อกสูงสุด"
                                name="maxStockLevel"
                                rules={[{ required: true, message: 'กรุณากรอกสต็อกสูงสุด' }]}
                            >
                                <InputNumber
                                    placeholder="0"
                                    style={{ width: '100%' }}
                                    min={0}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="หมวดหมู่"
                                name="categoryId"
                                rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่' }]}
                            >
                                <Select placeholder="เลือกหมวดหมู่">
                                    <Option value="b291e282-6783-48fa-a661-a99971fe0c56">เครื่องดื่มเย็น</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="แบรนด์"
                                name="brandId"
                                rules={[{ required: true, message: 'กรุณาเลือกแบรนด์' }]}
                            >
                                <Select placeholder="เลือกแบรนด์">
                                    <Option value="c46068ab-06a4-415f-895a-cf283dcb39b4">No name</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="อัตราภาษี (%)"
                                name="taxRate"
                                rules={[{ required: true, message: 'กรุณากรอกอัตราภาษี' }]}
                            >
                                <InputNumber
                                    placeholder="7.00"
                                    style={{ width: '100%' }}
                                    precision={2}
                                    min={0}
                                    max={100}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="สถานะการใช้งาน"
                                name="isActive"
                                valuePropName="checked"
                                initialValue={true}
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button onClick={() => setIsModalVisible(false)}>
                            ยกเลิก
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {editingProduct ? 'อัปเดต' : 'เพิ่มสินค้า'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>

    );
};

export default ProductPage;