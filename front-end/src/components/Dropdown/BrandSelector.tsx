import { Button, Modal, Form, Input, Switch, Select, message } from "antd";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import type { Brand, BrandInput } from "../../types/BrandType";
import { useLanguage } from "../languages/LanguageContext";
import BrandFormModal from "../modals/brand/AddEditBrand";
import { createBrand, getBrandBYID } from "../../services/BrandSV";

const { Option } = Select;

interface BrandSelectorProps {
    value?: string | null;
    onChange?: (value: string | null) => void;
    placeholder?: string;
    brandList: Brand[];
    onBrandAdded?: () => void;
    disabled?: boolean;
    style?: React.CSSProperties;
}

export const BrandSelector: React.FC<BrandSelectorProps> = ({
    value,
    onChange,
    placeholder = "Select brand",
    brandList,
    onBrandAdded,
    disabled = false,
    style
}) => {
    const [addBrandModalOpen, setAddBrandModalOpen] = useState(false);
    const [addBrandForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const { t } = useLanguage();

    // Fetch brand details when value changes
    useEffect(() => {
        const fetchBrandDetails = async () => {
            if (value && value !== null) {
                try {
                    const response = await getBrandBYID(value);
                    if (response?.data) {
                        setSelectedBrand(response.data);
                    }
                } catch (error) {
                    console.error("Error fetching brand details:", error);
                }
            } else {
                setSelectedBrand(null);
            }
        };

        fetchBrandDetails();
    }, [value]);

    const handleAddBrand = async (values: BrandInput) => {
        setLoading(true);
        try {
            console.log("Adding new brand:", values);
            const response = await createBrand(values);
            console.log("response.data.message", response.data.name);
            message.success('Successfully created new brand!');
            addBrandForm.resetFields();
            setAddBrandModalOpen(false);
            onBrandAdded?.();

        } catch (error: any) {
            console.error("Error adding brand:", error);
            message.error('Sorry cannot create, Try agian later');
        } finally {
            setLoading(false);
        }
    };

    const handleModalFormSubmit = async () => {
        try {
            const values = await addBrandForm.validateFields();
            const brandInput: BrandInput = {
                name: values.name,
                description: values.description,
                is_active: values.isActive || values.is_active
            };
            await handleAddBrand(brandInput);
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

    const handleCancelAddBrand = () => {
        addBrandForm.resetFields();
        setAddBrandModalOpen(false);
    };

    return (
        <>
            <Select
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                showSearch
                defaultValue={null}
                disabled={disabled}
                style={style}
                dropdownRender={(menu) => (
                    <>
                        <div style={{ padding: '4px 8px' }}>
                            <Button
                                type="primary"
                                size="middle"
                                icon={<Plus size={16} />}
                                onClick={() => setAddBrandModalOpen(true)}
                                style={{ width: '100%', marginBottom: '8px' }}
                            >
                                {t('Add new brand')}
                            </Button>
                        </div>
                        {menu}
                    </>
                )}
            >
                <Option value={null}>
                    {t('Not specific')}
                </Option>
                {brandList?.map((brand) => (
                    <Option key={brand.id} value={brand.id}>
                        {brand.name}
                    </Option>
                ))}
            </Select>

            <BrandFormModal
                currentBrand={selectedBrand}
                form={addBrandForm}
                onCancel={handleCancelAddBrand}
                onOk={handleModalFormSubmit}
                visible={addBrandModalOpen}
                loading={loading}
            />
        </>
    );
};