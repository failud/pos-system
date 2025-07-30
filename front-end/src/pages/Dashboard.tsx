import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Avatar,
  Space,
  Button,
  Menu,
  List,
  Typography,
} from 'antd';
import {
  ShoppingCartOutlined,
  DollarCircleOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import Layout from '../components/Layout/Layout';
import { useLanguage } from '../components/languages/LanguageContext';

const { Text } = Typography;

interface SalesData {
  totalSales: number;
  orders: number;
  customers: number;
  avgOrder: number;
}

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: 'completed' | 'processing' | 'pending';
  time: string;
}

interface Product {
  name: string;
  sales: number;
  revenue: number;
  trend: 'up' | 'down';
}

type PeriodType = 'today' | 'week' | 'month';

const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('today');
  const { t } = useLanguage();


  // Mock data
  const salesData: Record<PeriodType, SalesData> = {
    today: {
      totalSales: 25680,
      orders: 156,
      customers: 89,
      avgOrder: 164.6
    },
    week: {
      totalSales: 187500,
      orders: 1205,
      customers: 645,
      avgOrder: 155.6
    },
    month: {
      totalSales: 785600,
      orders: 4890,
      customers: 2156,
      avgOrder: 160.7
    }
  };

  const recentOrders: Order[] = [
    { id: '#12345', customer: 'John Smith', amount: 285.50, status: 'completed', time: '2 นาทีที่แล้ว' },
    { id: '#12346', customer: 'Sarah Johnson', amount: 156.75, status: 'processing', time: '5 นาทีที่แล้ว' },
    { id: '#12347', customer: 'Mike Wilson', amount: 98.25, status: 'pending', time: '8 นาทีที่แล้ว' },
    { id: '#12348', customer: 'Emily Davis', amount: 245.80, status: 'completed', time: '12 นาทีที่แล้ว' },
    { id: '#12349', customer: 'Robert Brown', amount: 189.40, status: 'processing', time: '15 นาทีที่แล้ว' }
  ];

  const topProducts: Product[] = [
    { name: 'กาแฟอเมริกาโน่', sales: 125, revenue: 4375, trend: 'up' },
    { name: 'ข้าวผัดกุ้ง', sales: 89, revenue: 3560, trend: 'up' },
    { name: 'ก๋วยเตี๋ยวต้มยำ', sales: 76, revenue: 3040, trend: 'down' },
    { name: 'ชาเขียวมัทฉะ', sales: 65, revenue: 2275, trend: 'up' },
    { name: 'ส้มตำไทย', sales: 54, revenue: 1890, trend: 'down' }
  ];

  const currentData = salesData[selectedPeriod];

  const getStatusColor = (status: Order['status']): string => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'processing';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: Order['status']): string => {
    switch (status) {
      case 'completed': return 'สำเร็จ';
      case 'processing': return 'กำลังทำ';
      case 'pending': return 'รอดำเนินการ';
      default: return status;
    }
  };

  return (
    <Layout>
      <div style={{ padding: '24px' }}>
        {/* Stats Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t("totals salls")}
                value={currentData.totalSales}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<DollarCircleOutlined />}
                suffix="฿"
              />
              <div style={{ marginTop: '8px' }}>
                <RiseOutlined style={{ color: '#3f8600' }} />
                <Text style={{ color: '#3f8600', marginLeft: '4px' }}>
                  +12.5% จากเมื่อวาน
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="คำสั่งซื้อ"
                value={currentData.orders}
                valueStyle={{ color: '#1890ff' }}
                prefix={<ShoppingCartOutlined />}
              />
              <div style={{ marginTop: '8px' }}>
                <RiseOutlined style={{ color: '#3f8600' }} />
                <Text style={{ color: '#3f8600', marginLeft: '4px' }}>
                  +8.2% จากเมื่อวาน
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="ลูกค้า"
                value={currentData.customers}
                valueStyle={{ color: '#722ed1' }}
                prefix={<UserOutlined />}
              />
              <div style={{ marginTop: '8px' }}>
                <RiseOutlined style={{ color: '#3f8600' }} />
                <Text style={{ color: '#3f8600', marginLeft: '4px' }}>
                  +5.7% จากเมื่อวาน
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="ค่าเฉลี่ยต่อออเดอร์"
                value={currentData.avgOrder}
                precision={2}
                valueStyle={{ color: '#f5222d' }}
                prefix={<TrophyOutlined />}
                suffix="฿"
              />
              <div style={{ marginTop: '8px' }}>
                <FallOutlined style={{ color: '#f5222d' }} />
                <Text style={{ color: '#f5222d', marginLeft: '4px' }}>
                  -2.1% จากเมื่อวาน
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Recent Orders */}
          <Col xs={24} lg={14}>
            <Card
              title="คำสั่งซื้อล่าสุด"
              extra={
                <Button type="link" icon={<EyeOutlined />}>
                  ดูทั้งหมด
                </Button>
              }
            >
              <List
                dataSource={recentOrders}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button type="link" size="small">
                        ดูรายละเอียด
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{item.customer[0]}</Avatar>}
                      title={
                        <Space>
                          <Text strong>{item.id}</Text>
                          <Tag color={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={0}>
                          <Text>{item.customer}</Text>
                          <Text type="secondary">
                            <ClockCircleOutlined style={{ marginRight: '4px' }} />
                            {item.time}
                          </Text>
                        </Space>
                      }
                    />
                    <div style={{ textAlign: 'right' }}>
                      <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                        ฿{item.amount.toLocaleString()}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Top Products */}
          <Col xs={24} lg={10}>
            <Card
              title="สินค้าขายดี"
              extra={
                <Button type="link" icon={<EyeOutlined />}>
                  ดูทั้งหมด
                </Button>
              }
            >
              <List
                dataSource={topProducts}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{
                          backgroundColor: index === 0 ? '#f6ffed' : '#f0f2f5',
                          color: index === 0 ? '#52c41a' : '#8c8c8c',
                          border: index === 0 ? '2px solid #52c41a' : 'none'
                        }}>
                          {index + 1}
                        </Avatar>
                      }
                      title={
                        <Space>
                          <Text strong>{item.name}</Text>
                          {item.trend === 'up' ?
                            <RiseOutlined style={{ color: '#3f8600' }} /> :
                            <FallOutlined style={{ color: '#f5222d' }} />
                          }
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">ขาย {item.sales} รายการ</Text>
                          <Text strong style={{ color: '#1890ff' }}>
                            ฿{item.revenue.toLocaleString()}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <Card title="การดำเนินการด่วน">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    block
                  >
                    สร้างคำสั่งซื้อใหม่
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Button
                    size="large"
                    icon={<UserOutlined />}
                    block
                  >
                    เพิ่มลูกค้าใหม่
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Button
                    size="large"
                    icon={<CheckCircleOutlined />}
                    block
                  >
                    ตรวจสอบสต็อค
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Button
                    size="large"
                    icon={<ExclamationCircleOutlined />}
                    block
                  >
                    รายงานยอดขาย
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}

export default Dashboard;