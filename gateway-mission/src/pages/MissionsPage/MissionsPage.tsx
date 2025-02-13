import { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store"; // Путь может быть разным в зависимости от вашего проекта
import { fetchMissions } from "../../store/slices/MissionDraftSlice"; // Импортируем экшен
import { useNavigate } from "react-router-dom"; // Для навигации
import './MissionsPage.css';

const MissionsPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // Используем для перехода на страницу миссии
  const { missions, loading, error } = useSelector((state: RootState) => state.missions);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null); // Для отслеживания выбранной миссии

  useEffect(() => {
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
    const matchesStatus = statusFilter ? String(mission.status) === statusFilter : true;
    const matchesStartDate = startDate ? (mission.create_datetime && mission.create_datetime >= startDate) : true;
    const matchesEndDate = endDate ? (mission.create_datetime && mission.create_datetime <= endDate) : true;
    return matchesStatus && matchesStartDate && matchesEndDate;
  });

  const renderCell = (value: any) => {
    return value || value === 0 ? value : '--';
  };

  const handleRowClick = (missionId: string) => {
    setSelectedMissionId(missionId); // Сохраняем выбранную миссию
  };

  const handleGoToMission = () => {
    if (selectedMissionId) {
      navigate(`/mission/${selectedMissionId}`); // Перенаправляем на страницу миссии
    }
  };

  return (
    <div className='missions-page-box'>
      <span className='gateway-products-title'>Список миссий</span>
      <div className='missions-content-box'>
        <div className='missions-content-header'>
          <div className='missions-status-filter'>
            <label className="filter-text-title" htmlFor="status-filter">Статус:</label>
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
            <label className="filter-text-title" htmlFor="start-date">Дата начала:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div className='missions-complete-data-filter'>
            <label className="filter-text-title" htmlFor="end-date">Дата окончания:</label>
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
          <table className="missions-table-bordered">
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
              {filteredMissions.map((mission) => (
                <tr key={mission.id} onClick={() => handleRowClick(String(mission.id))}>
                  <td>{renderCell(mission.id)}</td>
                  <td>{renderCell(mission.status)}</td>
                  <td>{renderCell(mission.create_datetime)}</td>
                  <td>{renderCell(mission.form_datetime)}</td>
                  <td>{renderCell(mission.complete_datetime)}</td>
                  <td>{renderCell(mission.plan_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Показываем кнопку, если строка выбрана */}
      {selectedMissionId && (
        <div className="mission-button-container">
          <button onClick={handleGoToMission} className="go-to-mission-btn">
            Перейти к миссии {selectedMissionId}
          </button>
        </div>
      )}
    </div>
  );
};

export default MissionsPage;
