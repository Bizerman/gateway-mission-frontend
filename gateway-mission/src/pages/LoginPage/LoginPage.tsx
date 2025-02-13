import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { loginUserAsync } from '../../store/slices/userSlice';
import { useNavigate } from "react-router-dom";
import { ROUTES } from '../../../Routes';
import Navigation from "../../components/Navigation.tsx";
import './LoginPage.css'
import {updateCsrfToken} from "../../api/Api.ts";

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '', guest: true });
    const error = useSelector((state: RootState) => state.user.error);

    // Обработчик события изменения полей ввода (login и password)
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Обработчик события нажатия на кнопку "Войти"
    const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.password) {
        formData.guest = false;
        const resultAction = await dispatch(loginUserAsync({ email: formData.email, password: formData.password }));

        if (loginUserAsync.rejected.match(resultAction)) {
            // Ошибка при авторизации, не делаем переход
            console.log('Ошибка авторизации:', resultAction.payload);
            // Можно тут вывести ошибку на экран или выполнить другие действия
        } else {
            await updateCsrfToken();
            // Авторизация успешна, выполняем переход
            navigate(`${ROUTES.GATEWAY_ELEMENTS}`); // Переход на страницу услуг
        }
    }
};
    return (
        <div className="login-page-content">
            <Navigation/>
            <div className="login-form-container">
                <h2 className="login-title">Рады снова Вас видеть!</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Введите свой email"
                        />
                    </div>
                    <div className="form-group">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Введите пароль"
                        />
                    </div>
                    <Button type="submit" className="submit-btn">
                        Войти
                    </Button>
                </Form>
            </div>
        </div>

    );
};

export default LoginPage;
