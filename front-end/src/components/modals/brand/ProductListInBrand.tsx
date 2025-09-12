import React from 'react'
import { Button, List, Modal, Space, Tag, Typography } from 'antd'
import type { Product } from '../../../types/ProductType'
import { useLanguage } from '../../languages/LanguageContext'

interface ProductListModalProps {
    visible: boolean
    brandName: string
    products: Product[]
    onClose: () => void
}

function ProductListModal({
    visible,
    brandName,
    products,
    onClose
}: ProductListModalProps) {
    const { Text } = Typography
    const { t } = useLanguage()

    return (
        <Modal
            title={`${t('Products in')}: "${brandName}"`}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    {t('Close')}
                </Button>
            ]}
            width={800}
        >
            {products.length > 0 ? (
                <List
                    dataSource={products}
                    renderItem={(product) => (
                        <List.Item>
                            <List.Item.Meta
                                title={<Text strong>{product.name}</Text>}
                                description={
                                    <div>
                                        <Text type="secondary">{product.description}</Text>
                                        <br />
                                        <Space wrap>
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
                    <Text type="secondary">{t('No products found in this brand')}</Text>
                </div>
            )}
        </Modal>
    )
}

export default ProductListModal