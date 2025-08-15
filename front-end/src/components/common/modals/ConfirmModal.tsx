import React from 'react';
import { Modal, Button, Typography } from 'antd';
import {
    ExclamationCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { useLanguage } from '../../languages/LanguageContext';

const { Text } = Typography;

export type ConfirmType = 'create' | 'edit' | 'delete' | 'warning' | 'info';

interface ConfirmModalProps {
    visible: boolean;
    type: ConfirmType;
    title?: string;
    content?: string;
    itemName?: string;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    danger?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    type,
    title,
    content,
    itemName = 'item',
    onConfirm,
    onCancel,
    confirmText,
    cancelText = 'Cancel',
    loading = false,
    danger = false
}) => {

    const getLanguage = (): 'en' | 'la' => {
        const lang = localStorage.getItem('language');
        return lang === 'la' ? 'la' : 'en';
    };

    const translate = (key: string, itemName: string) => {
        const lang = getLanguage();

        const translations: Record<string, { en: string; la: string }> = {
            confirmCreation: {
                en: `Are you sure you want to create this ${itemName}?`,
                la: `ທ່ານແນ່ໃຈບໍທີ່ຈະສ້າງ ${itemName} ນີ້?`,
            },
            confirmChanges: {
                en: `Are you sure you want to save changes to this ${itemName}?`,
                la: `ທ່ານແນ່ໃຈບໍທີ່ຈະບັນທຶກການປ່ຽນແປງ ${itemName} ນີ້?`,
            },
            confirmDeletion: {
                en: `Are you sure you want to delete this ${itemName}? This action cannot be undone.`,
                la: `ທ່ານແນ່ໃຈບໍທີ່ຈະລຶບ ${itemName} ນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນຄືນໄດ້.`,
            },
            warning: {
                en: `Please confirm this action for ${itemName}.`,
                la: `ກະລຸນາຢືນຢັນການກະທຳນີ້ສໍາລັບ ${itemName}.`,
            },
            info: {
                en: `Please confirm this action.`,
                la: `ກະລຸນາຢືນຢັນການກະທຳນີ້.`,
            },
            areYouSure: {
                en: `Are you sure?`,
                la: `ທ່ານແນ່ໃຈບໍ?`,
            }
        };

        return translations[key]?.[lang] ?? key;
    };


    const getModalConfig = () => {
        switch (type) {
            case 'create':
                return {
                    icon: <PlusOutlined style={{ color: '#52c41a' }} />,
                    title: title || (getLanguage() === 'la' ? 'ຢືນຢັນການສ້າງ' : 'Confirm Creation'),
                    content: content || translate('confirmCreation', itemName),
                    confirmText: confirmText || (getLanguage() === 'la' ? 'ສ້າງ' : 'Create'),
                    confirmType: 'primary' as const,
                    isDanger: false
                };
            case 'edit':
                return {
                    icon: <EditOutlined style={{ color: '#1890ff' }} />,
                    title: title || (getLanguage() === 'la' ? 'ຢືນຢັນການແກ້ໄຂ' : 'Confirm Changes'),
                    content: content || translate('confirmChanges', itemName),
                    confirmText: confirmText || (getLanguage() === 'la' ? 'ບັນທຶກ' : 'Save Changes'),
                    confirmType: 'primary' as const,
                    isDanger: false
                };
            case 'delete':
                return {
                    icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />,
                    title: title || (getLanguage() === 'la' ? 'ຢືນຢັນການລຶບ' : 'Confirm Deletion'),
                    content: content || translate('confirmDeletion', itemName),
                    confirmText: confirmText || (getLanguage() === 'la' ? 'ລຶບ' : 'Delete'),
                    confirmType: 'primary' as const,
                    isDanger: true
                };
            case 'warning':
                return {
                    icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
                    title: title || (getLanguage() === 'la' ? 'ຄໍາເຕືອນ' : 'Warning'),
                    content: content || translate('warning', itemName),
                    confirmText: confirmText || (getLanguage() === 'la' ? 'ດໍາເນີນການ' : 'Proceed'),
                    confirmType: 'primary' as const,
                    isDanger: danger
                };
            case 'info':
                return {
                    icon: <QuestionCircleOutlined style={{ color: '#1890ff' }} />,
                    title: title || (getLanguage() === 'la' ? 'ຢືນຢັນ' : 'Confirmation'),
                    content: content || translate('info', itemName),
                    confirmText: confirmText || (getLanguage() === 'la' ? 'ຢືນຢັນ' : 'Confirm'),
                    confirmType: 'primary' as const,
                    isDanger: false
                };
            default:
                return {
                    icon: <QuestionCircleOutlined style={{ color: '#1890ff' }} />,
                    title: title || (getLanguage() === 'la' ? 'ຢືນຢັນ' : 'Confirmation'),
                    content: content || translate('areYouSure', itemName),
                    confirmText: confirmText || (getLanguage() === 'la' ? 'ຢືນຢັນ' : 'Confirm'),
                    confirmType: 'primary' as const,
                    isDanger: false
                };
        }
    };


    const config = getModalConfig();

    const handleConfirm = async () => {
        try {
            await onConfirm();
        } catch (error) {
            console.error('Confirm action failed:', error);
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
            width={400}
            closable={false}
            maskClosable={false}
        >
            <div style={{ padding: '20px 0' }}>
                {/* Icon and Title */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '16px'
                }}>
                    <div style={{
                        fontSize: '22px',
                        marginTop: '2px',
                        flexShrink: 0
                    }}>
                        {config.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#262626',
                            marginBottom: '8px',
                            lineHeight: '24px'
                        }}>
                            {config.title}
                        </div>
                        <div style={{
                            fontSize: '14px',
                            color: '#8c8c8c',
                            lineHeight: '20px'
                        }}>
                            {config.content}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '8px',
                    marginTop: '24px'
                }}>
                    <Button
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {getLanguage() === 'la' ? 'ຍົກເລີກ' : 'Cancel'}
                    </Button>
                    <Button
                        type={config.confirmType}
                        danger={config.isDanger}
                        loading={loading}
                        onClick={handleConfirm}
                    >
                        {config.confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

// Utility functions for quick usage
export const showConfirmModal = {
    create: (itemName: string, onConfirm: () => void, onCancel: () => void) => (
        <ConfirmModal
            visible={true}
            type="create"
            itemName={itemName}
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    ),
    edit: (itemName: string, onConfirm: () => void, onCancel: () => void) => (
        <ConfirmModal
            visible={true}
            type="edit"
            itemName={itemName}
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    ),
    delete: (itemName: string, onConfirm: () => void, onCancel: () => void) => (
        <ConfirmModal
            visible={true}
            type="delete"
            itemName={itemName}
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    )
};

export default ConfirmModal;