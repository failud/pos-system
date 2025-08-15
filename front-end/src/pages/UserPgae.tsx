import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { Content } from 'antd/es/layout/layout'
import { useLanguage } from '../components/languages/LanguageContext'
import { Button, Card, Col, Form, Input, Modal, Row, Space, Statistic, Switch, Tag, Typography, Avatar, Pagination, Select, Divider, message } from 'antd'
import { Users, UserCheck, UserX, Plus, Edit, Trash2, Phone, Mail, User, Lock, UserCog, UserPen } from 'lucide-react'
import dayjs from 'dayjs'
import { changeUserPassword, createUser, deleteUser, editUser, getALLUsers, getBYID } from '../services/UserSV'
import type { UserInput, User as UserType } from '../types/UserType'
import { successMessage } from '../utils/AntdMessage'
import ConfirmModal from '../components/common/modals/ConfirmModal'
import {
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons'
import LoadingOverlay from '../components/common/loaders/LoadingOverlay'

interface UserResponse {
  data: UserType[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  roleStats: {
    manager: number
    admin: number
    cashier: number
  }
}

function UserPage() {
  const { Text, Title } = Typography
  const { Search } = Input
  const { t } = useLanguage();

  const [userResponse, setUserResponse] = useState<UserResponse | null>(null);
  const [pageSize, setPageSize] = useState<number>(8);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false);

  const [currentUserRole, setCurrentUserRole] = useState<string>('');

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [modalADD, setModalADD] = useState<boolean>(false);
  const [modalPassword, setModalPassword] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<UserType | null>(null);
  const [deleteID, setDeleteID] = useState<string | null>(null);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);

  const getRoleLevel = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 3;
      case 'manager': return 2;
      case 'cashier': return 1;
      default: return 0;
    }
  };

  const canModifyUser = (targetUserRole: string) => {
    const currentLevel = getRoleLevel(currentUserRole);
    const targetLevel = getRoleLevel(targetUserRole);

    console.log(`Current: ${currentUserRole} (${currentLevel}), Target: ${targetUserRole} (${targetLevel})`);

    if (currentUserRole === 'admin') {
      return targetUserRole !== 'admin';
    }

    if (currentUserRole === 'manager') {
      return targetUserRole === 'cashier';
    }

    return false;
  };

  const canChangePassword = (targetUserRole: string) => {
    // Admin can change password for manager and cashier
    if (currentUserRole === 'admin') {
      return targetUserRole === 'manager' || targetUserRole === 'cashier';
    }

    // Manager can change password for cashier only
    if (currentUserRole === 'manager') {
      return targetUserRole === 'cashier';
    }

    // Cashier cannot change anyone's password
    return false;
  };

  const getCurrentUserData = async () => {
    try {
      const userId = localStorage.getItem('uuid'); // แก้จาก 'userId' เป็น 'uuid'
      if (userId) {
        const response = await getBYID(userId);
        if (response.data?.success) {
          setCurrentUserRole(response.data.data.role);
          console.log("Current user role:", response.data.data.role);
        }
      }
    } catch (error) {
      console.log("Error getting current user data:", error);
    }
  };

  useEffect(() => {
    getCurrentUserData();
  }, []);

  const getUserList = async () => {
    try {
      setLoading(true);
      const response = await getALLUsers(currentPage, pageSize, searchText);
      setUserResponse(response.data);
      console.log("User response: ", response);
    } catch (error: any) {
      console.log("Error get users", error?.data?.message)
    } finally {
      setLoading(false);
    }
  }

  const handleChangePassword = async () => {
    if (!selectedUserForPassword) return;

    try {
      setPasswordLoading(true);
      const values = await passwordForm.validateFields();

      const response = await changeUserPassword(selectedUserForPassword.id, values.newPassword);

      if (response.data.success) {
        message.success(t('Password changed successfully!'));
        setModalPassword(false);
        setSelectedUserForPassword(null);
        passwordForm.resetFields();
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      message.error(t('Failed to change password. Please try again.'));
    } finally {
      setPasswordLoading(false);
    }
  }

  const handlePasswordClick = (user: UserType) => {
    if (!canChangePassword(user.role)) {
      message.error(t('Access denied! You cannot change password for users with equal or higher role than yours.'));
      return;
    }

    setSelectedUserForPassword(user);
    passwordForm.resetFields();
    setModalPassword(true);
  };

  useEffect(() => {
    getUserList();
  }, [pageSize, currentPage, searchText]);

  const userData = userResponse?.data ? userResponse.data : [];

  const handleADD = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();

      if (currentUserRole === 'cashier') {
        message.error(t('Access denied! Cashiers cannot add users.'));
        return;
      }

      if (currentUser === null) {
        if (currentUserRole === 'manager' && values.role !== 'cashier') {
          message.error(t('Access denied! Managers can only create cashier accounts.'));
          return;
        }
        if (currentUserRole === 'admin' && values.role === 'admin') {
          message.error(t('Access denied! You cannot create another admin account.'));
          return;
        }
      }

      if (currentUser === null && values.password !== values.confirmPassword) {
        message.error(t('Passwords do not match!'));
        return;
      }

      const body: UserInput = {
        username: values.username,
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone || null,
        role: values.role,
        is_active: values.isActive !== undefined ? values.isActive : true,
      }

      if (currentUser === null) {
        body.password = values.password;
      }

      console.log("Payload :", body)
      if (currentUser) {
        if (!canModifyUser(currentUser.role)) {
          message.error(t('Access denied! You cannot edit users with equal or higher role than yours.'));
          return;
        }

        await editUser(currentUser.id, body);
        successMessage.edit('User')
      } else {
        await createUser(body)
        successMessage.create('User')
      }

      form.resetFields();
      setModalADD(false);
      setCurrentUser(null);
      getUserList();

    } catch (error: any) {
      console.log("Error Add/Edit user", error?.data?.message)
    } finally {
      setLoading(false);
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
      const response = await deleteUser(id);
      console.log("Deleting user... ", id)
      successMessage.delete('User')
      getUserList();
      setModalDelete(false);
      setDeleteID(null);
    } catch (error: any) {
      console.log("Error delete user", error?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  const handleEditClick = (user: UserType) => {
    if (!canModifyUser(user.role)) {
      message.error(t('Access denied! You cannot edit users with equal or higher role than yours.'));
      return;
    }

    setCurrentUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      role: user.role,
      isActive: user.is_active
    });
    setModalADD(true);
  };

  const handleDeleteClick = (user: UserType) => {
    if (!canModifyUser(user.role)) {
      message.error(t('Access denied! You cannot delete users with equal or higher role than yours.'));
      return;
    }

    setDeleteID(user.id);
    setModalDelete(true);
  };

  const handleAddUserClick = () => {
    if (currentUserRole === 'cashier') {
      message.error(t('Access denied! Cashiers cannot add users.'));
      return;
    }

    setCurrentUser(null);
    form.resetFields();
    setModalADD(true);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'red'
      case 'manager':
        return 'blue'
      case 'cashier':
        return 'green'
      default:
        return 'default'
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  return (
    <Layout>
      <ConfirmModal
        onConfirm={() => handleDelete(deleteID ? deleteID : '')}
        onCancel={() => setModalDelete(false)}
        visible={modalDelete}
        type={'delete'}
      />

      {loading && <LoadingOverlay />}

      <Content className='lg:px-[4vw] lg:py-[2vw]'>
        <Title level={3}>
          {t("Users Management")}
        </Title>

        {/* Statistics Cards */}
        {/* แถวที่ 1: 3 cards */}
        <Row gutter={8} style={{ marginBottom: '8px' }}>
          <Col xs={24} sm={12} md={12}>
            <Card className='shadow-md'>
              <Statistic
                title={t('Total Users')}
                value={userResponse?.meta.total || 0}
                prefix={<Users />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Card className='shadow-md'>
              <Statistic
                title={t('Active Users')}
                value={userData.filter(user => user.is_active).length}
                prefix={<UserCheck />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>

        </Row>

        {/* แถวที่ 2: 2 cards */}
        <Row gutter={8} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={8} md={8}>
            <Card className='shadow-md'>
              <Statistic
                title={t('Admins')}
                value={userResponse?.roleStats.admin || 0}
                prefix={<UserCog />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8}>
            <Card className='shadow-md'>
              <Statistic
                title={t('Managers')}
                value={userResponse?.roleStats.manager || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8}>
            <Card className='shadow-md'>
              <Statistic
                title={t('Cashier')}
                value={userResponse?.roleStats.cashier || 0}
                prefix={<UserPen />}
                valueStyle={{ color: '#700113' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Search and Add Button */}
        <Row style={{ marginBottom: '16px' }}>
          <Col xs={24}>
            <Card className='shadow-md'>
              <div className='flex pb-5 justify-between flex-wrap gap-4'>
                <Search
                  placeholder={t('Search users...')}
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
                  onClick={handleAddUserClick}
                  disabled={currentUserRole === 'cashier'}
                >
                  {t("Add User")}
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* User Cards */}
        <Row gutter={[16, 16]} className='mb-6'>
          {userData.map((user) => (
            <Col xs={24} sm={12} md={8} lg={6} key={user.id}>
              <Card
                className='shadow-lg hover:shadow-xl transition-shadow duration-300'
                loading={loading}
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEditClick(user)}
                    disabled={!canModifyUser(user.role)}
                    title={t('Edit')}
                  >
                    {t('Edit')}
                  </Button>,
                  <Button
                    type="text"
                    icon={<LockOutlined />}
                    onClick={() => handlePasswordClick(user)}
                    disabled={!canChangePassword(user.role)}
                    title={t('Change Password')}
                  >
                    {t('Password')}
                  </Button>,
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDeleteClick(user)}
                    disabled={!canModifyUser(user.role)}
                    title={t('Delete')}
                  >
                    {t('Delete')}
                  </Button>
                ]}
              >
                <div className='text-center mb-4'>
                  <Avatar
                    size={64}
                    className='mb-3'
                    style={{
                      backgroundColor: getRoleColor(user.role),
                      fontSize: '24px'
                    }}
                  >
                    {getInitials(user.first_name, user.last_name)}
                  </Avatar>

                  <Title level={5} className='mb-1'>
                    {user.first_name} {user.last_name}
                  </Title>

                  <Text type="secondary" className='block mb-2'>
                    @{user.username}
                  </Text>

                  <Tag color={getRoleColor(user.role)} className='mb-3'>
                    {user.role.toUpperCase()}
                  </Tag>
                </div>

                <Space direction="vertical" size="small" className='w-full'>
                  <div className='flex items-center gap-2'>
                    <Mail size={14} />
                    <Text className='text-sm' ellipsis={{ tooltip: user.email }}>
                      {user.email}
                    </Text>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Phone size={14} />
                    <Text className='text-sm'>{user.phone ? user.phone : t('No data')}</Text>
                  </div>

                  <div className='flex justify-between items-center mt-3'>
                    <Tag color={user.is_active ? 'green' : 'red'}>
                      {user.is_active ? t('Active') : t('Inactive')}
                    </Tag>
                    <Text className='text-xs' type="secondary">
                      {dayjs(user.created_at).format("DD/MM/YYYY")}
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        {userResponse && userResponse.meta.total > 0 && (
          <Row justify="center" style={{ marginTop: '24px' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={userResponse.meta.total}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={['8', '12', '16', '24', '32']}
              onChange={handleTableChange}
              onShowSizeChange={handleTableChange}
              showLessItems
              responsive
            />
          </Row>
        )}

        {/* Empty State */}
        {userData.length === 0 && !loading && (
          <Row justify="center" style={{ marginTop: '48px' }}>
            <Col>
              <div className='text-center flex flex-col justify-center'>
                <UserX size={64} className='text-gray-400 mb-4' />
                <Title level={4} type="secondary">
                  {t('No users found')}
                </Title>
                <Text type="secondary">
                  {t('Try adjusting your search or add a new user')}
                </Text>
              </div>
            </Col>
          </Row>
        )}
      </Content>

      {/* Add/Edit User Modal */}
      <Modal
        title={
          <Title className='text-center' level={4} style={{ margin: 0 }}>
            {currentUser ? t('Edit User') : t('Add User')}
          </Title>
        }
        open={modalADD}
        onOk={handleADD}
        onCancel={() => {
          setModalADD(false);
          setCurrentUser(null);
          form.resetFields();
        }}
        okText={currentUser ? t('Update') : t('Create')}
        cancelText={t('Cancel')}
        width={600}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          colon={false}
          style={{ marginTop: 12 }}
          initialValues={{
            isActive: true,
            role: 'cashier'
          }}
        >
          <Row gutter={16}>
            <Divider orientation="left">{t("PII data")}</Divider>
            <Col xs={24} sm={12}>
              <Form.Item
                name="username"
                label={<Text strong>{t('Username')}</Text>}
                rules={[{ required: true, message: t('Please input username!') }]}
              >
                <Input placeholder={t('Enter username')} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label={<Text strong>{t('Email')}</Text>}
                rules={[
                  { required: true, message: t('Please input email!') },
                  { type: 'email', message: t('Please enter valid email!') }
                ]}
              >
                <Input placeholder={t('Enter email')} size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="first_name"
                label={<Text strong>{t('First Name')}</Text>}
                rules={[{ required: true, message: t('Please input first name!') }]}
              >
                <Input placeholder={t('Enter first name')} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="last_name"
                label={<Text strong>{t('Last Name')}</Text>}
                rules={[{ required: true, message: t('Please input last name!') }]}
              >
                <Input placeholder={t('Enter last name')} size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24}>
              <Form.Item
                name="phone"
                label={<Text strong>{t('Phone')}</Text>}
              >
                <Input placeholder={t('Enter phone number')} size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Row gutter={16}>
            {/* Password fields - only show for new user */}
            {currentUser === null && (
              <>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="password"
                    label={<Text strong>{t('Password')}</Text>}
                    rules={[
                      { required: true, message: t('Please input password!') },
                      { min: 6, message: t('Password must be at least 6 characters!') }
                    ]}
                  >
                    <Input.Password
                      placeholder={t('Enter password')}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="confirmPassword"
                    label={<Text strong>{t('Confirm Password')}</Text>}
                    dependencies={['password']}
                    rules={[
                      { required: true, message: t('Please confirm password!') },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error(t('Passwords do not match!')));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder={t('Confirm password')}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </>
            )}

            <Col xs={24} sm={12}>
              <Form.Item
                name="role"
                label={<Text strong>{t('Role')}</Text>}
                rules={[{ required: true, message: t('Please select role!') }]}
              >
                <Select placeholder={t('Please select role!')} style={{ height: '40px' }}>
                  {/* Show available roles based on current user role */}
                  <Select.Option value="cashier">{t('Cashier')}</Select.Option>
                  {currentUserRole === 'admin' && (
                    <Select.Option value="manager">{t('Manager')}</Select.Option>
                  )}
                  {/* Admin cannot create another admin */}
                </Select>
              </Form.Item>
            </Col>

            <Col className='flex justify-center w-[50%]'>
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
            </Col>
          </Row>
          <Divider />
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title={
          <div className='text-center'>
            <LockOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0, display: 'inline' }}>
              {t('Change Password')}
            </Title>
          </div>
        }
        open={modalPassword}
        onOk={handleChangePassword}
        onCancel={() => {
          setModalPassword(false);
          setSelectedUserForPassword(null);
          passwordForm.resetFields();
        }}
        okText={t('Change Password')}
        cancelText={t('Cancel')}
        width={500}
        centered
        confirmLoading={passwordLoading}
      >
        {selectedUserForPassword && (
          <div className='mb-4 p-4 bg-gray-50 rounded-lg'>
            <div className='flex items-center gap-3'>
              <Avatar
                size={48}
                style={{
                  backgroundColor: getRoleColor(selectedUserForPassword.role),
                }}
              >
                {getInitials(selectedUserForPassword.first_name, selectedUserForPassword.last_name)}
              </Avatar>
              <div>
                <Text strong className='text-lg'>
                  {selectedUserForPassword.first_name} {selectedUserForPassword.last_name}
                </Text>
                <br />
                <Text type="secondary">@{selectedUserForPassword.username}</Text>
                <br />
                <Tag color={getRoleColor(selectedUserForPassword.role)}>
                  {selectedUserForPassword.role.toUpperCase()}
                </Tag>
              </div>
            </div>
          </div>
        )}

        <Form
          form={passwordForm}
          layout="vertical"
          colon={false}
          style={{ marginTop: 12 }}
        >
          <Form.Item
            name="newPassword"
            label={<Text strong>{t('New Password')}</Text>}
            rules={[
              { required: true, message: t('Please input new password!') },
              { min: 6, message: t('Password must be at least 6 characters!') }
            ]}
          >
            <Input.Password
              placeholder={t('Enter new password')}
              size="large"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="confirmNewPassword"
            label={<Text strong>{t('Confirm New Password')}</Text>}
            dependencies={['newPassword']}
            rules={[
              { required: true, message: t('Please confirm new password!') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('Passwords do not match!')));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder={t('Confirm new password')}
              size="large"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <div className='mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400'>
            <Text type="secondary" className='text-sm'>
              <Lock size={16} className='inline mr-2' />
              {t('The new password will be effective immediately after confirmation.')}
            </Text>
          </div>
        </Form>
      </Modal>
    </Layout>
  )
}

export default UserPage;