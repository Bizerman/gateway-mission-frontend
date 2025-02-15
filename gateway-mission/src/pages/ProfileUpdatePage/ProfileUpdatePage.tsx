import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { updateUserAsync, logoutUserAsync } from '../../store/slices/userSlice.ts'; // Импортируем экшен для выхода
import Navigation from "../../components/Navigation.tsx";
import './ProfileUpdatePage.css';
import { UserRegistration } from "../../api/Api.ts";
import {useNavigate} from "react-router-dom";

const EditProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id, username, email, first_name, last_name, isLoading, error, success } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState({
    username: username || '',
    first_name: first_name || '',
    last_name: last_name || '',
    email: email || '',
    password: '',
    confirmPassword: '', // Новое поле для подтверждения пароля
  });

  const [formErrors, setFormErrors] = useState({
    passwordMismatch: false,
    emailInvalid: false,
    emailExists: false,
  });

  useEffect(() => {
    setFormData({
      username: username || '',
      first_name: first_name || '',
      last_name: last_name || '',
      email: email || '',
      password: '',
      confirmPassword: '',
    });
  }, [username, first_name, last_name, email]);

  // Функция обновления данных формы
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Функция для валидации паролей и email
  const validateForm = () => {
    let valid = true;

    // Проверка совпадения паролей
    if (formData.password !== formData.confirmPassword) {
      setFormErrors((prev) => ({ ...prev, passwordMismatch: true }));
      valid = false;
    } else {
      setFormErrors((prev) => ({ ...prev, passwordMismatch: false }));
    }

    // Проверка email на валидность
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormErrors((prev) => ({ ...prev, emailInvalid: true }));
      valid = false;
    } else {
      setFormErrors((prev) => ({ ...prev, emailInvalid: false }));
    }

    return valid;
  };

  // Отправка формы
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Валидируем форму
    if (!validateForm()) {
      console.log("Ошибка валидации. Проверьте данные.");
      return;
    }

    const updatedData: Partial<UserRegistration> = {};

    if (formData.username && formData.username !== username) updatedData.username = formData.username;
    if (formData.first_name && formData.first_name !== first_name) updatedData.first_name = formData.first_name;
    if (formData.last_name && formData.last_name !== last_name) updatedData.last_name = formData.last_name;
    if (formData.email && formData.email !== email) updatedData.email = formData.email;
    if (formData.password) updatedData.password = formData.password;

    if (Object.keys(updatedData).length === 0) {
      console.log("Данные не изменились. Обновление не требуется.");
      return;
    }

    try {
      await dispatch(updateUserAsync({ id, ...updatedData } as UserRegistration));
      console.log("Данные отправлены:", { id, ...updatedData });

      if (formData.password) {
        await dispatch(logoutUserAsync());
        console.log("Пароль изменен, пользователь вышел из системы.");
        navigate('/');
      }

    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);

      const typedError = error as Error;

      if (typedError.message === 'Email already exists') {
        setFormErrors((prev) => ({ ...prev, emailExists: true }));
      }
    }
  };

  return (
    <div className="edit-profile-page-content">
      <Navigation />
      <div className="edit-profile-form-container">
        <h2 className="edit-profile-title">Редактировать профиль</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Профиль успешно обновлен!</Alert>}

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
            {formErrors.emailInvalid && <Alert variant="danger">Некорректный email.</Alert>}
            {formErrors.emailExists && <Alert variant="danger">Этот email уже используется.</Alert>}
          </div>
          <div className="form-group">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите новый пароль"
            />
          </div>
          <div className="form-group">
            <Form.Label>Повторите пароль</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите новый пароль"
            />
            {formErrors.passwordMismatch && <Alert className="mt-4" variant="danger">Пароли не совпадают.</Alert>}
          </div>
          <Button type="submit" className="mt-2 submit-btn" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Обновить'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EditProfilePage;
