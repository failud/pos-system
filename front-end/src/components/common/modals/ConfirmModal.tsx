import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { 
    ExclamationCircleOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    PlusOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';

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
    const getModalConfig = () => {
        switch (type) {
            case 'create':
                return {
                    icon: <PlusOutlined style={{ color: '#52c41a' }} />,
                    title: title || 'Confirm Creation',
                    content: content || `Are you sure you want to create this ${itemName}?`,
                    confirmText: confirmText || 'Create',
                    confirmType: 'primary' as const,
                    isDanger: false
                };
            case 'edit':
                return {
                    icon: <EditOutlined style={{ color: '#1890ff' }} />,
                    title: title || 'Confirm Changes',
                    content: content || `Are you sure you want to save changes to this ${itemName}?`,
                    confirmText: confirmText || 'Save Changes',
                    confirmType: 'primary' as const,
                    isDanger: false
                };
            case 'delete':
                return {
                    icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />,
                    title: title || 'Confirm Deletion',
                    content: content || `Are you sure you want to delete this ${itemName}? This action cannot be undone.`,
                    confirmText: confirmText || 'Delete',
                    confirmType: 'primary' as const,
                    isDanger: true
                };
            case 'warning':
                return {
                    icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
                    title: title || 'Warning',
                    content: content || `Please confirm this action for ${itemName}.`,
                    confirmText: confirmText || 'Proceed',
                    confirmType: 'primary' as const,
                    isDanger: danger
                };
            case 'info':
                return {
                    icon: <QuestionCircleOutlined style={{ color: '#1890ff' }} />,
                    title: title || 'Confirmation',
                    content: content || `Please confirm this action.`,
                    confirmText: confirmText || 'Confirm',
                    confirmType: 'primary' as const,
                    isDanger: false
                };
            default:
                return {
                    icon: <QuestionCircleOutlined style={{ color: '#1890ff' }} />,
                    title: title || 'Confirmation',
                    content: content || 'Are you sure?',
                    confirmText: confirmText || 'Confirm',
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
                        {cancelText}
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