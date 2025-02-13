import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { updateUserAsync } from '../../store/slices/userSlice.ts';
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from '../../../Routes';
import Navigation from "../../components/Navigation.tsx";
import './ProfileUpdatePage.css';

const EditProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams(); // Получаем id пользователя из параметров URL
  const { isLoading, error, success } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  // Загружаем данные пользователя в состояние (это можно сделать с помощью useEffect или использовать текущие данные из Redux)
  useEffect(() => {
    if (id) {
      // Запрос для получения текущих данных пользователя
      // Пример запроса, который должен возвращать данные пользователя
      // Пример: dispatch(fetchUserData(id));
    }
  }, [id]);

  // Обработчик изменения данных
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Обработчик отправки данных
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (id) {
      await dispatch(updateUserAsync({ id: +id, ...formData }));
      if (success) {
        navigate(`${ROUTES.PROFILE}`); // Переход на страницу профиля после успешного обновления
      }
    }
  };

  return (
    <div className="edit-profile-page-content">
      <Navigation />
      <div className="edit-profile-form-container">
        <h2 className="edit-profile-title">Редактировать профиль</h2>
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
          <Button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Обновить'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EditProfilePage;
