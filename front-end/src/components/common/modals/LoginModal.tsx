import { Button, Input, Modal } from "antd"
import type React from "react"
import { useState } from "react";
import { requestLogin } from "../../../services/AuthSV";
import LoadingOverlay from "../loaders/LoadingOverlay";
import { useNavigate } from "react-router-dom";


interface LoginModalProps {
    open: boolean
    onCancel: () => void;
    t: (key: string) => string
}

export const LoginModal: React.FC<LoginModalProps> = ({ open, onCancel, t }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const naviagte = useNavigate();
    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    })

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await requestLogin(loginForm.username, loginForm.password);
            if (response.success === true) {
                if (response.user) {
                    localStorage.setItem("uuid", response.user.id)
                    localStorage.setItem("first_name", response.user.first_name)
                    localStorage.setItem("last_name", response.user.last_name)
                    localStorage.setItem("email", response.user.email)
                    localStorage.setItem("role", response.user.role)
                    naviagte('/dashboard');
                }
            }
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
            onCancel();
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <>
            {loading && <LoadingOverlay />}
            <Modal
                open={open}
                className="font-family-display"
                onCancel={onCancel}
                title={<p className="flex justify-center text-xl">{t('login')}</p>}
                footer={false}
            >
                <div className="flex text-[12px] flex-col gap-2 py-7 p-2 w-full border border-gray-200 rounded-xl">
                    <span className="px-[1vw] w-full">
                        <p className="font-family-display">{t("username")}</p>
                        <Input
                            name="username"
                            value={loginForm.username}
                            onChange={handleInputChange}
                            className=""
                        />
                    </span>
                    <span className="px-[1vw] w-full">
                        <p className="font-family-display">{t("password")}</p>
                        <Input.Password
                            name="password"
                            value={loginForm.password}
                            onChange={handleInputChange}
                        />
                    </span>
                    <span className="px-[1vw]">
                        <p className="text-[12px] w-fit duration-300 hover:text-blue-300 cursor-pointer text-blue-500 underline">forget password ?</p>
                    </span>
                </div>
                <div className="flex gap-5 pt-5 font-family-sans justify-center">
                    <Button onClick={onCancel}>{t("cancel")}</Button>
                    <Button onClick={handleLogin} type="primary">{t("login")}</Button>
                </div>
            </Modal>

        </>
    )
}

export default LoginModal