import React from 'react';
import { Dropdown, Menu, Avatar, Typography, Badge } from 'antd';
import {
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    ProfileOutlined
} from '@ant-design/icons';
import { CircleUser } from 'lucide-react';

const { Text } = Typography;

interface DropdownProfileProps {
    open: boolean;
    onVisibleChange?: (visible: boolean) => void;
    userData?: {
        first: string;
        last: string;
        avatar?: string;
        email?: string;
        role?: string
    };
}

export const DropdownProfile: React.FC<DropdownProfileProps> = ({
    open,
    onVisibleChange,
    userData = {
        first: 'John',
        last: 'Doe',
        email: 'john.doe@example.com'
    }
}) => {
    const menu = (
        <Menu className='min-w-[220px]'>
            <Menu.Item key="header" style={{ cursor: 'default', pointerEvents: 'none' }}>
                <div style={{ padding: '2px 0px' }}>
                    <span className='flex flex-col border border-gray-300 p-2 rounded-xl'>
                        <span className='flex gap-2 pt-2 items-center'>
                            {/* <CircleUser className='h-[32px] w-[32px]' /> */}
                            <Badge count={userData.role}>
                                <Avatar shape="square" size="large">
                                    {userData.email ? userData.email.charAt(0).toUpperCase() : ''}
                                </Avatar>
                            </Badge>
                            <Text strong>{userData.first} {userData.last}</Text>
                        </span>
                        <Text className='flex gap-2 pt-2 items-center' type="secondary" style={{ fontSize: 12 }}>
                            {userData.email}
                        </Text>
                    </span>
                </div>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="profile" icon={<ProfileOutlined />}>
                Profile
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
                Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown
            overlay={menu}
            trigger={['click']}
            placement="bottomRight"
            open={open}
            onOpenChange={onVisibleChange}
            arrow
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Avatar
                    icon={!userData.avatar && <UserOutlined />}
                    style={{ backgroundColor: '#1890ff' }}
                >
                    {userData.email ? userData.email.charAt(0).toUpperCase() : ''}
                </Avatar>
                <Text strong style={{ color: 'inherit' }}>
                    {userData.first}
                </Text>
            </div>
        </Dropdown>
    );
};