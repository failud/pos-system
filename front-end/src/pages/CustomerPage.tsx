import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { Content } from 'antd/es/layout/layout';
import { useLanguage } from '../components/languages/LanguageContext';
import { Button, Card, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Statistic, Switch, Table, Tag, Typography } from 'antd';
import { CopyCheck, Plus, User } from 'lucide-react';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { successMessage, warningMessage } from '../utils/AntdMessage';
import ConfirmModal from '../components/common/modals/ConfirmModal';
import { createCustomer, deleteCustomer, editCustomer, getALLCustomer } from '../services/CustomerSV';
import type { Customer, CustomerGender } from '../types/CustomerType';

const { Text, Title } = Typography;
const { Search } = Input;
const { Option } = Select;

function CustomerPage() {
    const { t } = useLanguage();
    const [customerList, setCustomerList] = useState<any>(null);
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchText, setSearchText] = useState<string>('');
    const [genderFilter, setGenderFilter] = useState<string>('');
    const [dateRange, setDateRange] = useState<string[]>(['', '']);
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [modalDelete, setModalDelete] = useState<boolean>(false);

    const getCustomerList = async () => {
        try {
            setLoading(true);

            // Prepare params object
            const params: any = {
                page: currentPage,
                limit: pageSize
            };

            // Only add search param if searchText is not empty
            if (searchText.trim() !== '') {
                params.search = searchText;
            }

            // Add gender filter if selected
            if (genderFilter) {
                params.gender = genderFilter;
            }

            // Add date range if selected
            if (dateRange[0] && dateRange[1]) {
                params.dateFrom = dateRange[0];
                params.dateTo = dateRange[1];
            }

            const response = await getALLCustomer(params);
            setCustomerList(response.data);
        } catch (error: any) {
            console.error('Error fetching customers:', error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCustomerList();
    }, [currentPage, pageSize, searchText, genderFilter, dateRange]);

    const customerData = customerList?.data ? customerList.data : [];

    const handleTableChange = (page: number, size: number) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setCurrentPage(1);
    };

    const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
        setDateRange(dateStrings);
        setCurrentPage(1);
    };

    const handleGenderFilterChange = (value: string) => {
        setGenderFilter(value);
        setCurrentPage(1);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            
            // Format date_of_birth if it exists
            if (values.date_of_birth) {
                values.date_of_birth = dayjs(values.date_of_birth).format('YYYY-MM-DD');
            }
            
            // Convert numeric fields to numbers
            if (values.loyalty_points) {
                values.loyalty_points = Number(values.loyalty_points);
            }
            if (values.total_spent) {
                values.total_spent = Number(values.total_spent);
            }
            
            if (currentCustomer) {
                // Update existing customer
                await editCustomer(currentCustomer.id, values);
                successMessage.edit('Customer updated successfully');
            } else {
                // Create new customer
                await createCustomer(values);
                successMessage.create('Customer created successfully');
            }
            
            setModalVisible(false);
            form.resetFields();
            getCustomerList();
        } catch (error) {
            console.error('Error submitting customer:', error);
            warningMessage.custom('Failed to submit customer');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            // Here you would call your API to delete customer
            const response = deleteCustomer(id);
            console.log('Deleting customer with ID:',
             id);
            successMessage.delete('Customer deleted');
            getCustomerList();
        } catch (error) {
            console.log('Error deleting customer:', error);
        } finally {
            setModalDelete(false);
        }
    };

    const columns = [
        {
            title: t('No.'),
            key: 'index',
            width: 60,
            render: (_: any, __: Customer, index: number) => (
                <Text className='flex justify-center'>{(currentPage - 1) * pageSize + index + 1}</Text>
            )
        },
        {
            title: t('Customer Code'),
            dataIndex: 'customer_code',
            key: 'customer_code',
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: t('Name'),
            key: 'name',
            render: (_: any, record: Customer) => (
                <Text>{record.first_name || record.last_name ? `${record.first_name || ''} ${record.last_name || ''}` : '-'}</Text>
            )
        },
        {
            title: t('Phone'),
            dataIndex: 'phone',
            key: 'phone',
            render: (text: string) => <Text>{text || '-'}</Text>
        },
        {
            title: t('Email'),
            dataIndex: 'email',
            key: 'email',
            render: (text: string) => <Text>{text || '-'}</Text>
        },
        {
            title: t('Gender'),
            dataIndex: 'gender',
            key: 'gender',
            render: (gender: CustomerGender) => (
                <Tag color={gender === 'male' ? 'blue' : gender === 'female' ? 'pink' : 'orange'}>
                    {gender ? t(gender) : '-'}
                </Tag>
            )
        },
        {
            title: t('Loyalty Points'),
            dataIndex: 'loyalty_points',
            key: 'loyalty_points',
            render: (points: number) => <Text>{points}</Text>
        },
        {
            title: t('Total Spent'),
            dataIndex: 'total_spent',
            key: 'total_spent',
            render: (amount: string) => <Text>{amount}</Text>
        },
        {
            title: t('Status'),
            dataIndex: 'is_active',
            key: 'status',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? t('Active') : t('Inactive')}
                </Tag>
            )
        },
        {
            title: t('Action'),
            key: 'action',
            render: (_: any, record: Customer) => (
                <Space size="middle">
                    <Button
                        shape="circle"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setCurrentCustomer(record);
                            
                            // Prepare form values with proper date handling
                            const formValues = {
                                ...record,
                                // Convert date_of_birth string to dayjs object if it exists
                                date_of_birth: record.date_of_birth ? dayjs(record.date_of_birth) : null,
                                // Map is_active to isActive for form
                                isActive: record.is_active
                            };
                            
                            form.setFieldsValue(formValues);
                            setModalVisible(true);
                        }}
                    />
                    <Button
                        shape="circle"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => {
                            setDeleteId(record.id);
                            setModalDelete(true);
                        }}
                    />
                </Space>
            )
        }
    ];

    return (
        <Layout>
            <ConfirmModal
                onConfirm={() => handleDelete(deleteId || '')}
                onCancel={() => setModalDelete(false)}
                visible={modalDelete}
                type="delete"
            />

            <Content className="lg:px-[4vw] lg:py-[2vw]">
                <Title level={3}>{t("Customer Management")}</Title>

                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} md={12}>
                        <Card className="shadow-md">
                            <Statistic
                                title={t('Total Customers')}
                                value={customerList?.pagination.total || 0}
                                prefix={<User />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={12}>
                        <Card className="shadow-md">
                            <Statistic
                                title={t('Active Customers')}
                                value={customerList?.data?.filter((c: Customer) => c.is_active).length || 0}
                                prefix={<CopyCheck />}
                                valueStyle={{ color: '#9911ff' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col xs={24}>
                        <Card className="shadow-xl">
                            <div className="flex pb-5 justify-between flex-wrap gap-4">
                                <Space>
                                    <Search
                                        placeholder={t('Search customers...')}
                                        allowClear
                                        enterButton
                                        style={{ width: 300 }}
                                        onSearch={handleSearch}
                                    />
                                    <Select
                                        placeholder={t('Filter by gender')}
                                        style={{ width: 120 }}
                                        allowClear
                                        onChange={handleGenderFilterChange}
                                    >
                                        <Option value="male">{t('male')}</Option>
                                        <Option value="female">{t('female')}</Option>
                                        <Option value="other">{t('other')}</Option>
                                    </Select>
                                    <DatePicker.RangePicker
                                        onChange={handleDateRangeChange}
                                        placeholder={[t('Start date'), t('End date')]}
                                    />
                                </Space>
                                <Button
                                    icon={<Plus />}
                                    type="primary"
                                    onClick={() => {
                                        setCurrentCustomer(null);
                                        form.resetFields();
                                        setModalVisible(true);
                                    }}
                                >
                                    {t("Add Customer")}
                                </Button>
                            </div>

                            <Table
                                columns={columns}
                                dataSource={customerData}
                                rowKey="id"
                                loading={loading}
                                scroll={{ x: 'max-content' }}
                                pagination={{
                                    current: currentPage,
                                    pageSize: pageSize,
                                    total: customerList?.pagination.total || 0,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    pageSizeOptions: ['5', '10', '20', '50', '100'],
                                    onChange: handleTableChange,
                                    onShowSizeChange: handleTableChange,
                                }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Content>

            <Modal
                title={
                    <Title level={4} style={{ margin: 0 }}>
                        {currentCustomer ? t('Edit Customer') : t('Add Customer')}
                    </Title>
                }
                open={modalVisible}
                onOk={handleSubmit}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                okText={currentCustomer ? t('Update') : t('Create')}
                cancelText={t('Cancel')}
                width={700}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        isActive: true,
                        loyalty_points: 0,
                        total_spent: 0
                    }}
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="isActive"
                                label={t('Status')}
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren={t('Active')}
                                    unCheckedChildren={t('Inactive')}
                                    defaultChecked
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="first_name"
                                label={t('First Name')}
                            >
                                <Input placeholder={t('First Name')} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="last_name"
                                label={t('Last Name')}
                            >
                                <Input placeholder={t('Last Name')} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="email"
                                label={t('Email')}
                                rules={[
                                    { required: true, message: t('Please input email!') },
                                    { type: 'email', message: t('Please input valid email!') }
                                ]}
                            >
                                <Input placeholder={t('Email')} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="phone"
                                label={t('Phone')}
                                rules={[{ required: true, message: t('Please input phone number!') }]}
                            >
                                <Input placeholder={t('Phone')} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="address"
                        label={t('Address')}
                    >
                        <Input.TextArea rows={3} placeholder={t('Address')} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} sm={8}>
                            <Form.Item
                                name="gender"
                                label={t('Gender')}
                            >
                                <Select placeholder={t('Select gender')}>
                                    <Option value="male">{t('male')}</Option>
                                    <Option value="female">{t('female')}</Option>
                                    <Option value="other">{t('other')}</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item
                                name="date_of_birth"
                                label={t('Date of Birth')}
                            >
                                <DatePicker
                                    placeholder={t('Select date')}
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item
                                name="loyalty_points"
                                label={t('Loyalty Points')}
                            >
                                <Input type="number" min={0} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="total_spent"
                        label={t('Total Spent')}
                    >
                        <Input type="number" min={0} step="0.01" />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}

export default CustomerPage;