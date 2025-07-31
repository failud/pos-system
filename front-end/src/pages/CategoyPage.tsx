import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useLanguage } from '../components/languages/LanguageContext'
import { createCategory, editCategory, getAllCategory } from '../services/CategorySV'
import {
    Button,
    Card,
    Col,
    Row,
    Space,
    Statistic,
    Table,
    Tag,
    Typography,
    Input,
    Dropdown,
    Menu,
    Modal,
    Form,
    Select,
    List,
    Switch
} from 'antd'
import {
    ShoppingCartOutlined,
    WarningOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    EyeOutlined
} from '@ant-design/icons'

const { Text, Title } = Typography
const { Search } = Input
const { Option } = Select

interface Category {
    id: string
    name: string
    description: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    parentId?: string
    parent?: Category
    children?: Category[]
    products?: Product[]
}

interface Product {
    id: string
    name: string
    description: string
    sku: string
    barcode: string
    costPrice: string
    sellingPrice: string
    discountPrice: string | null
    stockQuantity: number
    minStockLevel: number
    maxStockLevel: number
    unit: string
    taxRate: string
    isActive: boolean
    imageUrl?: string
    createdAt: string
    updatedAt: string
    categoryId: string
    brandId: string
}

const CategoryPage: React.FC = () => {
    const { t } = useLanguage()
    const [categories, setCategories] = useState<Category[]>([])
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isProductModalVisible, setIsProductModalVisible] = useState(false)
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
    const [selectedCategoryProducts, setSelectedCategoryProducts] = useState<Product[]>([])
    const [selectedCategoryName, setSelectedCategoryName] = useState('')
    const [form] = Form.useForm()

    const get_category = async () => {
        try {
            setLoading(true)
            const response = await getAllCategory()
            setCategories(response.data.data)
            setFilteredCategories(response.data.data)
            console.log(response.data)
        } catch (error: any) {
            console.log('Error get Category', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        get_category()
    }, [])

    useEffect(() => {
        if (searchText) {
            const filtered = categories.filter(cat =>
                cat.name.toLowerCase().includes(searchText.toLowerCase()) ||
                cat.description.toLowerCase().includes(searchText.toLowerCase())
            )
            setFilteredCategories(filtered)
        } else {
            setFilteredCategories(categories)
        }
    }, [searchText, categories])

    // Calculate statistics
    const totalCategories = categories.length
    const activeCategories = categories.filter(cat => cat.isActive).length
    const totalProducts = categories.reduce(
        (sum, cat) => sum + (cat.products ? cat.products.length : 0),
        0
    )

    const handleAddCategory = () => {
        setCurrentCategory(null)
        form.resetFields()
        setIsModalVisible(true)
    }

    const handleEditCategory = (category: Category) => {
        setCurrentCategory(category)
        form.setFieldsValue({
            name: category.name,
            description: category.description,
            isActive: category.isActive,
            parentId: category.parentId
        })
        setIsModalVisible(true)
    }

    const handleDeleteCategory = (id: string) => {
        Modal.confirm({
            title: t('Confirm deletion'),
            content: t('Are you sure you want to delete this category?'),
            onOk: () => {
                // Call API to delete category
                console.log('Delete category:', id)
                get_category() // Refresh data
            }
        })
    }

    const handleShowProducts = (category: Category) => {
        setSelectedCategoryProducts(category.products || [])
        setSelectedCategoryName(category.name)
        setIsProductModalVisible(true)
    }

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields()

            const body = {
                name: values.name,
                description: values.description || '',
                isActive: values.isActive,
                parentId: values.parentId || undefined
            }

            if (currentCategory) {
                await editCategory(currentCategory.id, body);
            } else {
                await createCategory(body)
            }

            setIsModalVisible(false)
            get_category() 
        } catch (error) {
            console.error('Error saving category:', error)
        }
    }


    const columns = [
        {
            title: t('No.'),
            key: 'index',
            render: (_: any, __: Category, index: number) => index + 1
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
            title: t('Status'),
            dataIndex: 'isActive',
            key: 'status',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? t('Active') : t('Inactive')}
                </Tag>
            )
        },
        {
            title: t('Products'),
            dataIndex: 'products',
            key: 'products',
            render: (products: Product[] | undefined, record: Category) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag>{products ? products.length : 0}</Tag>
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
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString()
        },
        {
            title: t('Action'),
            key: 'action',
            render: (_: any, record: Category) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item
                                icon={<EditOutlined />}
                                onClick={() => handleEditCategory(record)}
                            >
                                {t('Edit')}
                            </Menu.Item>
                            <Menu.Item
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteCategory(record.id)}
                                danger
                            >
                                {t('Delete')}
                            </Menu.Item>
                        </Menu>
                    }
                    trigger={['click']}
                >
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            )
        }
    ]

    return (
        <Layout>
            <div className="lg:px-[4vw] lg:py-[2vw]">
                <div style={{ marginBottom: '24px' }}>
                    <Title level={3} style={{ margin: 0 }}>
                        {t('Categories Management')}
                    </Title>
                </div>

                {/* Statistics Cards */}
                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic
                                title={t('Total Categories')}
                                value={totalCategories}
                                prefix={<ShoppingCartOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic
                                title={t('Active Categories')}
                                value={activeCategories}
                                prefix={<ShoppingCartOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic
                                title={t('Total Products')}
                                value={totalProducts}
                                prefix={<ShoppingCartOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Main Content */}
                <Card
                    title={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Search
                                placeholder={t('Search categories')}
                                allowClear
                                enterButton
                                style={{ width: 300 }}
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                prefix={<SearchOutlined />}
                            />
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddCategory}
                            >
                                {t('Add Category')}
                            </Button>
                        </div>
                    }
                    loading={loading}
                >
                    <Table
                        columns={columns}
                        dataSource={categories}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 'max-content' }}
                        expandable={{
                            expandedRowRender: () => null,
                            expandIcon: () => null,
                        }}
                    />

                </Card>

                {/* Category Modal */}
                <Modal
                    title={
                        <Title level={4} style={{ margin: 0 }}>
                            {currentCategory ? t('Edit Category') : t('Add Category')}
                        </Title>
                    }
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={() => setIsModalVisible(false)}
                    okText={currentCategory ? t('Update') : t('Create')}
                    cancelText={t('Cancel')}
                    width={500}
                    centered
                    bodyStyle={{
                        padding: '24px 24px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#fff'
                    }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        colon={false}
                        style={{ marginTop: 12 }}
                    >
                        <Form.Item
                            name="name"
                            label={<Text strong>{t('Category Name')}</Text>}
                            rules={[{ required: true, message: t('Please input category name!') }]}
                        >
                            <Input placeholder={t('e.g. Beverages')} size="large" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label={<Text strong>{t('Description')}</Text>}
                        >
                            <Input.TextArea
                                rows={3}
                                placeholder={t('Write something about this category...')}
                                style={{ resize: 'none' }}
                            />
                        </Form.Item>

                        {/* <Form.Item
                            name="parentId"
                            label={<Text strong>{t('Parent Category')}</Text>}
                        >
                            <Select
                                placeholder={t('Select parent category')}
                                allowClear
                                size="large"
                            >
                                {categories
                                    .filter(cat => !cat.parentId)
                                    .map(cat => (
                                        <Option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item> */}

                        <Form.Item
                            name="isActive"
                            label={<Text strong>{t('Status')}</Text>}
                            // valuePropName="checd"
                        >
                            <Switch
                                checkedChildren={t('Active')}
                                unCheckedChildren={t('Inactive')}
                            />
                        </Form.Item>
                    </Form>
                </Modal>


                {/* Products List Modal */}
                <Modal
                    title={`${t('Products in')} "${selectedCategoryName}"`}
                    visible={isProductModalVisible}
                    onCancel={() => setIsProductModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setIsProductModalVisible(false)}>
                            {t('Close')}
                        </Button>
                    ]}
                    width={800}
                >
                    {selectedCategoryProducts.length > 0 ? (
                        <List
                            dataSource={selectedCategoryProducts}
                            renderItem={(product) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={<Text strong>{product.name}</Text>}
                                        description={
                                            <div>
                                                <Text type="secondary">{product.description}</Text>
                                                <br />
                                                <Space>
                                                    <Tag color="blue">SKU: {product.sku}</Tag>
                                                    <Tag color="green">฿{product.sellingPrice}</Tag>
                                                    <Tag color="orange">{t('Stock')}: {product.stockQuantity}</Tag>
                                                    <Tag color={product.isActive ? 'green' : 'red'}>
                                                        {product.isActive ? t('Active') : t('Inactive')}
                                                    </Tag>
                                                </Space>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Text type="secondary">{t('No products found in this category')}</Text>
                        </div>
                    )}
                </Modal>
            </div>
        </Layout>
    )
}

export default CategoryPage