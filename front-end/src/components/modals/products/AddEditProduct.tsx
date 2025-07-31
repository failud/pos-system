import { Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import { useLanguage } from "../../languages/LanguageContext";


interface AddEditProductProop {
    editingProduct: boolean;
    open: boolean;
    close: () => void;
}

export const AddEditProduct: React.FC<AddEditProductProop> = ({ editingProduct, open, close }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const { t } = useLanguage();
    // const 

    return (
        <>
            <Modal
                centered
                title={editingProduct ? `${t("edit product")}` : `${t("add new product")}`}
                open={open}
                onCancel={() => close()}
                footer={null}
                width={800}
            >
                <Form
                // form={form}
                // layout="vertical"
                // onFinish={handleSubmit}
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
                                    {/* <Option value="b291e282-6783-48fa-a661-a99971fe0c56">เครื่องดื่มเย็น</Option> */}
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
                                    {/* <Option value="c46068ab-06a4-415f-895a-cf283dcb39b4">No name</Option> */}
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
                        <Button onClick={close}>
                            ยกเลิก
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {editingProduct ? 'อัปเดต' : 'เพิ่มสินค้า'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    )
}

