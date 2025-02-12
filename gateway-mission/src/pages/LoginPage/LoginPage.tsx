import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { loginUserAsync } from '../../store/slices/userSlice';
import { useNavigate } from "react-router-dom";
import { ROUTES } from '../../../Routes';
import Navigation from "../../components/Navigation.tsx";
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
        <Container style={{ maxWidth: '100%', marginTop: '0' }}>
            <Navigation />
            <Container style={{ maxWidth: '400px', marginTop: '150px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Рады снова Вас видеть!</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="username" style={{ marginBottom: '15px' }}>
                        <Form.Label>Логин пользователя</Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Введите логин пользователя"
                        />
                    </Form.Group>
                    <Form.Group controlId="password" style={{ marginBottom: '20px' }}>
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Введите пароль"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" style={{ width: '100%' }}>
                        Войти
                    </Button>
                </Form>
            </Container>
        </Container>
    );
};

export default LoginPage;
