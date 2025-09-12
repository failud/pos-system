import React from 'react'
import { Form, Input, Modal, Switch, Typography } from 'antd'
import { useLanguage } from '../../languages/LanguageContext'
import type { Category } from '../../../types/CategoryType'


interface CategoryFormModalProps {
    visible: boolean
    currentCategory: Category | null
    form: any
    onOk: () => Promise<void>
    onCancel: () => void
    loading?: boolean
}

function CategoryFormModal({
    visible,
    currentCategory,
    form,
    onOk,
    onCancel,
    loading = false
}: CategoryFormModalProps) {
    const { Text, Title } = Typography
    const { t } = useLanguage()

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }}>
                    {currentCategory ? t('Edit category') : t('Add category')}
                </Title>
            }
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
            okText={currentCategory ? t('Update') : t('Create')}
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
                    label={<Text strong>{t('Category Name')}</Text>}
                    rules={[{ required: true, message: t('Please input category name!') }]}
                >
                    <Input placeholder={t('e.g. Electronics, Clothing, Books')} size="large" />
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
    )
}

export default CategoryFormModal