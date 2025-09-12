import { Button, Modal, Form, Input, Switch, Select, message } from "antd";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Category, CategoryInput } from "../../types/CategoryType";
import { useLanguage } from "../languages/LanguageContext";
import { createCategory } from "../../services/CategorySV";
import CategoryFormModal from "../modals/Category/AddCategory";

const { Option } = Select;

interface CategorySelectorProps {
    value?: string | null;
    onChange?: (value: string | null) => void;
    placeholder?: string;
    CategoryList: Category[];
    onCategoryAdded?: () => void;
    disabled?: boolean;
    style?: React.CSSProperties;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
    value,
    onChange,
    placeholder = "Select category",
    CategoryList,
    onCategoryAdded,
    disabled = false,
    style
}) => {
    const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
    const [addCategoryForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    const handleAddCategory = async (values: CategoryInput) => {
        setLoading(true);
        try {
            console.log("Adding new category:", values);
            const response = await createCategory(values);
            console.log("response.data.message", response.data.name);
            message.success('Successfully created new category!');
            addCategoryForm.resetFields();
            setAddCategoryModalOpen(false);
            onCategoryAdded?.();

        } catch (error: any) {
            console.error("Error adding category:", error);
            message.error('Sorry cannot create, Try agian later');
        } finally {
            setLoading(false);
        }
    };

    const handleModalFormSubmit = async () => {
        try {
            const values = await addCategoryForm.validateFields();
            const categoryInput: CategoryInput = {
                name: values.name,
                description: values.description,
                isActive: values.isActive || values.is_active
            };
            await handleAddCategory(categoryInput);
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

    const handleCancelAddCategory = () => {
        addCategoryForm.resetFields();
        setAddCategoryModalOpen(false);
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
                                onClick={() => setAddCategoryModalOpen(true)}
                                style={{ width: '100%', marginBottom: '8px' }}
                            >
                                {t('Add new category')}
                            </Button>
                        </div>
                        {menu}
                    </>
                )}
            >
                <Option value={null}>
                    {t('Not specific')}
                </Option>
                {CategoryList?.map((category) => (
                    <Option key={category.id} value={category.id}>
                        {category.name}
                    </Option>
                ))}
            </Select>

            <CategoryFormModal
                currentCategory={null}
                form={addCategoryForm}
                onCancel={handleCancelAddCategory}
                onOk={handleModalFormSubmit}
                visible={addCategoryModalOpen}
                loading={loading}
            />
        </>
    );
};