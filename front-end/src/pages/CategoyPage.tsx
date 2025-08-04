import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useLanguage } from '../components/languages/LanguageContext'
import { createCategory, deleteCategory, editCategory, getAllCategory, getAllCategoryList } from '../services/CategorySV'
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
    EyeOutlined,
    AppstoreOutlined,
    SelectOutlined,
    FilterOutlined
} from '@ant-design/icons'
import { Content } from 'antd/es/layout/layout'
import dayjs from 'dayjs'
import { errorMessage, successMessage, warningMessage } from '../utils/AntdMessage'
import ConfirmModal from '../components/common/modals/ConfirmModal'
import LoadingOverlay from '../components/common/loaders/LoadingOverlay'
import type { Category } from '../types/CategoryType'
import type { Product } from '../types/ProductType'

const { Text, Title } = Typography
const { Search } = Input
const { Option } = Select




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
    const [modalDelete, setModalDelete] = useState<boolean>(false);
    const [deleteID, setDeleteID] = useState<string | null>(null)
    const [form] = Form.useForm()
    const [sortOrder, setSortOrder] = useState<string>('')

    const [sortBy, setSortBy] = useState<string>('createdAt');
    const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');

    const get_category = async () => {
        try {
            setLoading(true);

            const rawParams = {
                search: searchText,
                sortBy: sortBy,
                sortOrder: order,
            };

            const params = Object.fromEntries(
                Object.entries(rawParams).filter(([_, v]) => v !== '' && v !== undefined)
            );

            const response = await getAllCategoryList(params);
            setCategories(response.data.data);
            setFilteredCategories(response.data.data);
        } catch (error: any) {
            console.log("Error get Category", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        get_category();
    }, [sortBy, order, searchText]);


    // Calculate statistics
    const totalCategories = categories.length
    const activeCategories = categories.filter(cat => cat.isActive).length

    const handleAddCategory = () => {
        setCurrentCategory(null)
        form.resetFields()
        form.setFieldsValue({
            isActive: true
        })
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


    const handleShowProducts = (category: Category) => {
        setSelectedCategoryProducts(category.products || [])
        setSelectedCategoryName(category.name)
        setIsProductModalVisible(true)
    }

    const handleModalOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields()

            const body = {
                name: values.name,
                description: values.description || '',
                isActive: values.isActive !== undefined ? values.isActive : true,
                parentId: values.parentId || undefined
            }
            let type = ''
            if (currentCategory) {
                await editCategory(currentCategory.id, body);
                successMessage.edit('Category')
            } else {
                await createCategory(body)
                successMessage.create('Category')
            }

            await get_category()
        } catch (error: any) {
            console.error('Error saving category:', error)
            errorMessage.custom('Error: ', error.data.message)
        } finally {
            setIsModalVisible(false);
            setLoading(false);
        }
    }

    const handleDeleteCate = async (id: string) => {
        if (!id || id === '') {
            errorMessage.delete('ID not found!');
            return;
        }
        setLoading(true);
        try {
            const response = await deleteCategory(id);
            if (response.data.action === "soft_deleted") {
                warningMessage.custom(`${t('Cannot delete, This Category used Change status to Inactive')}`)
            } else if (response.data.message == "Category has been permanently deleted") {
                successMessage.delete('Category')
            }
            getAllCategoryList();
        } catch (error: any) {
            errorMessage.delete('Error delete:', error.data.message)
        } finally {
            setModalDelete(false)
            setDeleteID(null);
            get_category();
            setLoading(false);
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
            title: <p className='text-center'>{t('Status')}</p>,
            dataIndex: 'isActive',
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
            render: (products: Product[] | undefined, record: Category) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag color={products && products.length == 0 ? "error" : "purple"}>{products ? products.length : 0}</Tag>
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
            render: (date: string) => dayjs(date).format("DD/MM/YYYY - HH:MM")
        },
        {
            title: <p className='text-center'>{t('Action')}</p>,
            key: 'action',
            render: (_: any, record: Category) => (
                <Content className='flex justify-center gap-5'>
                    <Button
                        shape='circle'
                        icon={<EditOutlined />}
                        onClick={() => handleEditCategory(record)}
                    >
                        {/* {t('Edit')} */}
                    </Button>
                    <Button
                        shape='circle'
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            setDeleteID(record.id)
                            setModalDelete(true)
                        }}
                        danger
                    >
                        {/* {t('Delete')} */}
                    </Button>
                </Content>

            )
        }
    ]

    return (
        <Layout>
            <ConfirmModal
                onConfirm={() => handleDeleteCate(deleteID ? deleteID : '')}
                onCancel={() => setModalDelete(false)}
                visible={modalDelete}
                type={'delete'}
            />

            {loading && <LoadingOverlay />}



            <div className="lg:px-[4vw] lg:py-[2vw]">
                <div style={{ marginBottom: '24px' }}>
                    <Title level={3} style={{ margin: 0 }}>
                        {t('Categories Management')}
                    </Title>
                </div>

                {/* Statistics Cards */}
                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} md={12}>
                        <Card className='shadow-md'>
                            <Statistic
                                title={t('Total Categories')}
                                value={totalCategories}
                                prefix={<AppstoreOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={12}>
                        <Card className='shadow-md'>
                            <Statistic
                                title={t('Active Categories')}
                                value={activeCategories}
                                prefix={<SelectOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Main Content */}
                <Card className='shadow-lg'
                    title={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className='flex gap-5'>
                                <Search
                                    placeholder={t('Search categories')}
                                    allowClear
                                    enterButton
                                    style={{ width: 300 }}
                                    value={searchText}
                                    onChange={e => {
                                        setSearchText(e.target.value)
                                    }}
                                    prefix={<SearchOutlined />}
                                />
                                <Select
                                    prefix={<FilterOutlined />}
                                    value={`${sortBy}-${order}`}
                                    onChange={(value) => {
                                        const [sort, ord] = value.split('-');
                                        setSortBy(sort);
                                        setOrder(ord as 'ASC' | 'DESC');
                                    }}
                                    options={[
                                        {
                                            value: 'createdAt-DESC',
                                            label: <p className="text-end">{t('Latest')}</p>,
                                        },
                                        {
                                            value: 'createdAt-ASC',
                                            label: <p className="text-end">{t('Oldest')}</p>,
                                        },
                                        {
                                            value: 'productCount-DESC',
                                            label: <p className="text-end">{t('Most Product')}</p>,
                                        },
                                        {
                                            value: 'productCount-ASC',
                                            label: <p className="text-end">{t('Least Product')}</p>,
                                        },
                                        {
                                            value: 'name-ASC',
                                            label: <p className="text-end">{t('A-Z')}</p>,
                                        },
                                        {
                                            value: 'name-DESC',
                                            label: <p className="text-end">{t('Z-A')}</p>,
                                        },
                                    ]}
                                />
                            </span>
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
                        initialValues={{
                            isActive: true 
                        }}
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

                        <Form.Item
                            name="isActive"
                            label={<Text strong>{t('Status')}</Text>}
                            valuePropName="checked"
                        >
                            <Switch
                                checkedChildren={t('Active')}
                                unCheckedChildren={t('Inactive')}
                                defaultChecked={true}
                            />
                        </Form.Item>
                    </Form>
                </Modal>


                <Modal
                    title={`${t('Products in')} "${selectedCategoryName}"`}
                    open={isProductModalVisible}
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