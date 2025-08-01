import { message } from 'antd';
import { 
    CheckCircleOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    PlusOutlined,
    InfoCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

export type MessageType = 'create' | 'edit' | 'delete' | 'success' | 'info' | 'warning' | 'error';

interface ShowMessageOptions {
    type: MessageType;
    itemName?: string;
    customMessage?: string;
    duration?: number;
    t?: (key: string) => string; // เพิ่ม t function เป็น parameter
}

// Configure message globally
message.config({
    top: 10,
    duration: 3,
    maxCount: 3,
});

const getMessageConfig = (type: MessageType, itemName?: string, customMessage?: string, t?: (key: string) => string) => {
    // ใช้ fallback หาก t function ไม่ถูกส่งมา
    const translate = t || ((key: string) => key);
    
    switch (type) {
        case 'create':
            return {
                type: 'success' as const,
                content: customMessage || `${itemName || 'Item'} ${translate('created successfully!')}`,
                icon: <PlusOutlined style={{ color: '#52c41a' }} 
                />
            };
        case 'edit':
            return {
                type: 'success' as const,
                content: customMessage || `${itemName || 'Item'} ${translate('updated successfully!')}`,
                icon: <EditOutlined style={{ color: '#52c41a' }} 
                />
            };
        case 'delete':
            return {
                type: 'success' as const,
                content: customMessage || `${itemName || 'Item'} ${translate('deleted successfully!')}`,
                icon: <DeleteOutlined style={{ color: '#52c41a' }} 
                />
            };
        case 'success':
            return {
                type: 'success' as const,
                content: customMessage || translate('Operation completed successfully!'),
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} 
                />
            };
        case 'info':
            return {
                type: 'info' as const,
                content: customMessage || translate('Information message'),
                icon: <InfoCircleOutlined style={{ color: '#1890ff' }} 
                />
            };
        case 'warning':
            return {
                type: 'warning' as const,
                content: customMessage || translate('Warning message'),
                icon: <ExclamationCircleOutlined style={{ color: '#faad14' }}
                 />
            };
        case 'error':
            return {
                type: 'error' as const,
                content: customMessage || translate('An error occurred'),
                icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} 
                />
            };
        default:
            return {
                type: 'info' as const,
                content: customMessage || 'Message',
                icon: <InfoCircleOutlined style={{ color: '#1890ff' }} 
                />
            };
    }
};

export const showMessage = ({ type, itemName, customMessage, duration = 3, t }: ShowMessageOptions) => {
    const config = getMessageConfig(type, itemName, customMessage, t);
    
    return message.open({
        type: config.type,
        content: (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* {config.icon} */}
                <span>{config.content}</span>
            </span>
        ),
        duration,
        style: {
            marginTop: '10vh',
        }
    });
};

// สร้าง factory function ที่รับ t function
export const createMessageUtils = (t: (key: string) => string) => ({
    successMessage: {
        create: (itemName: string, duration?: number) => 
            showMessage({ type: 'create', itemName, duration, t }),
        
        edit: (itemName: string, duration?: number) => 
            showMessage({ type: 'edit', itemName, duration, t }),
        
        delete: (itemName: string, duration?: number) => 
            showMessage({ type: 'delete', itemName, duration, t }),
        
        custom: (message: string, duration?: number) => 
            showMessage({ type: 'success', customMessage: message, duration, t })
    },

    errorMessage: {
        create: (itemName: string, duration?: number) => 
            showMessage({ 
                type: 'error', 
                customMessage: `Failed to create ${itemName}. Please try again.`,
                duration,
                t
            }),
        
        edit: (itemName: string, duration?: number) => 
            showMessage({ 
                type: 'error', 
                customMessage: `Failed to update ${itemName}. Please try again.`,
                duration,
                t 
            }),
        
        delete: (itemName: string, duration?: number) => 
            showMessage({ 
                type: 'error', 
                customMessage: `Failed to delete ${itemName}. Please try again.`,
                duration,
                t 
            }),
        
        custom: (message: string, duration?: number) => 
            showMessage({ type: 'error', customMessage: message, duration, t })
    },

    warningMessage: {
        custom: (message: string, duration?: number) => 
            showMessage({ type: 'warning', customMessage: message, duration, t })
    },

    infoMessage: {
        custom: (message: string, duration?: number) => 
            showMessage({ type: 'info', customMessage: message, duration, t })
    }
});

// Quick utility functions (ไม่มี translation)
export const successMessage = {
    create: (itemName: string, duration?: number) => 
        showMessage({ type: 'create', itemName, duration }),
    
    edit: (itemName: string, duration?: number) => 
        showMessage({ type: 'edit', itemName, duration }),
    
    delete: (itemName: string, duration?: number) => 
        showMessage({ type: 'delete', itemName, duration }),
    
    custom: (message: string, duration?: number) => 
        showMessage({ type: 'success', customMessage: message, duration })
};

export const errorMessage = {
    create: (itemName: string, duration?: number) => 
        showMessage({ 
            type: 'error', 
            customMessage: `Failed to create ${itemName}. Please try again.`,
            duration 
        }),
    
    edit: (itemName: string, duration?: number) => 
        showMessage({ 
            type: 'error', 
            customMessage: `Failed to update ${itemName}. Please try again.`,
            duration 
        }),
    
    delete: (itemName: string, duration?: number) => 
        showMessage({ 
            type: 'error', 
            customMessage: `Failed to delete ${itemName}. Please try again.`,
            duration 
        }),
    
    custom: (message: string, duration?: number) => 
        showMessage({ type: 'error', customMessage: message, duration })
};

export const warningMessage = {
    custom: (message: string, duration?: number) => 
        showMessage({ type: 'warning', customMessage: message, duration })
};

export const infoMessage = {
    custom: (message: string, duration?: number) => 
        showMessage({ type: 'info', customMessage: message, duration })
};

export const showLoading = (content: string = 'Loading...') => {
    return message.loading({
        content,
        duration: 0,
    });
};

export const hideAllMessages = () => {
    message.destroy();
};