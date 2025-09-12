import React from 'react'
import { Form, Input, Modal, Switch, Typography } from 'antd'
import { useLanguage } from '../../languages/LanguageContext'
import type { Brand } from '../../../types/BrandType'


interface BrandFormModalProps {
    visible: boolean
    currentBrand: Brand | null
    form: any
    onOk: () => Promise<void>
    onCancel: () => void
    loading?: boolean
}

function BrandFormModal({
    visible,
    currentBrand,
    form,
    onOk,
    onCancel,
    loading = false
}: BrandFormModalProps) {
    const { Text, Title } = Typography
    const { t } = useLanguage()

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }}>
                    {currentBrand ? t('Edit brand') : t('Add brand')}
                </Title>
            }
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
            okText={currentBrand ? t('Update') : t('Create')}
            cancelText={t('Cancel')}
            width={500}
            centered
            confirmLoading={loading}
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
                    label={<Text strong>{t('Brand Name')}</Text>}
                    rules={[{ required: true, message: t('Please input brand name!') }]}
                >
                    <Input placeholder={t('e.g. Nike, Apple, Samsung')} size="large" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label={<Text strong>{t('Description')}</Text>}
                >
                    <Input.TextArea
                        rows={3}
                        placeholder={t('Write something about this brand...')}
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
    )
}

export default BrandFormModal