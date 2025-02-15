import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation.tsx";
import './RegisterPage.css';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/store.ts";
import {registerUserAsync} from "../../store/slices/RegistrationSlice.ts";
import {UserRegistration} from "../../api/Api.ts";

const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState<string | null>(null);

    // Обработчик изменения данных
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Обработчик отправки данных
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(registerUserAsync(formData as UserRegistration));
            navigate('/login');
        } catch (err) {
            setError('Ошибка при регистрации. Попробуйте снова.');
        }
    };

    return (
        <div className="registration-page-content">
            <Navigation />
            <div className="registration-form-container">
                <h2 className="registration-title">Регистрация</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <Form.Label>Имя пользователя</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Введите имя пользователя"
                        />
                    </div>
                    <div className="form-group">
                        <Form.Label>Имя</Form.Label>
                        <Form.Control
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="Введите имя"
                        />
                    </div>
                    <div className="form-group">
                        <Form.Label>Фамилия</Form.Label>
                        <Form.Control
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Введите фамилию"
                        />
                    </div>
                    <div className="form-group">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Введите email"
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
                        Зарегистрироваться
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default RegistrationPage;
