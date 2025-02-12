import { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store"; // Путь может быть разным в зависимости от вашего проекта
import { fetchMissions } from "../../store/slices/MissionDraftSlice"; // Импортируем экшен
import './MissionsPage.css';

const MissionsPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { missions, loading, error } = useSelector((state: RootState) => state.missions);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Маппинг статусов
  const statusChoices: { [key: number]: string } = {
    1: 'Введена',
    2: 'В работе',
    3: 'Завершена',
    4: 'Отклонена',
    5: 'Удалена',
  };

  useEffect(() => {
    // Загрузка миссий при монтировании компонента
    dispatch(fetchMissions());
  }, [dispatch]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  // Фильтрация миссий
  const filteredMissions = missions.filter((mission) => {
    const missionStatus = statusChoices[mission.status as keyof typeof statusChoices] || '';
    const matchesStatus = statusFilter ? missionStatus === statusFilter : true;
    const matchesStartDate = startDate ? (mission.create_datetime && mission.create_datetime >= startDate) : true;
    const matchesEndDate = endDate ? (mission.create_datetime && mission.create_datetime <= endDate) : true;
    return matchesStatus && matchesStartDate && matchesEndDate;
  });

  // Переход на главную страницу
  const handleGoHome = () => {
    window.location.href = '/'; // Переход на главную страницу
  };

  return (
    <div className='missions-page-box'>
      {/* Условие для отображения сообщения, если миссии не найдены */}
      {filteredMissions.length === 0 ? (
        <div className="no-missions-message">
          <h1 className='mb-md-5'>Нет сформированных миссий.</h1>
          <button onClick={handleGoHome}>Вернуться на главную</button>
        </div>
      ) : (
        <>
          <span className='gateway-products-title'>Список миссий</span>
          <div className='missions-content-box'>
            <div className='missions-content-header'>
              <div className='missions-status-filter'>
                <label htmlFor="status-filter">Статус:</label>
                <select id="status-filter" value={statusFilter} onChange={handleStatusChange}>
                  <option value="">Все</option>
                  <option value="Введена">Введена</option>
                  <option value="В работе">В работе</option>
                  <option value="Завершена">Завершена</option>
                  <option value="Отклонена">Отклонена</option>
                  <option value="Удалена">Удалена</option>
                </select>
              </div>
              <div className='missions-form-data-filter'>
                <label htmlFor="start-date">Дата начала:</label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
              </div>
              <div className='missions-complete-data-filter'>
                <label htmlFor="end-date">Дата окончания:</label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={handleEndDateChange}
                />
              </div>
            </div>
          </div>

          <div className="missions-table">
            {loading ? (
              <p>Загрузка миссий...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>№</th>
                    <th>Статус</th>
                    <th>Дата создания</th>
                    <th>Дата оформления</th>
                    <th>Дата завершения</th>
                    <th>Дата планирования</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMissions.map((mission, index) => (
                    <tr key={mission.id}>
                      <td>{index + 1}</td>
                      <td>{statusChoices[mission.status as keyof typeof statusChoices]}</td>
                      <td>{mission.create_datetime}</td>
                      <td>{mission.form_datetime}</td>
                      <td>{mission.complete_datetime}</td>
                      <td>{mission.plan_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MissionsPage;
