import { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchMissions, missionCompleteUpdate, missionDelete } from "../../store/slices/MissionDraftSlice";
import { useNavigate } from "react-router-dom";
import './MissionsPage.css';

const MissionsPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { missions, error } = useSelector((state: RootState) => state.missions);
  const { role } = useSelector((state: RootState) => state.user); // Роль пользователя

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [creatorFilter, setCreatorFilter] = useState<string>(''); // Фильтр по создателю
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null); // Состояние для выбранной миссии
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  // Функция для получения миссий
  const getMissions = () => {
    dispatch(fetchMissions()).unwrap().catch((err) => {
      if (err === 403) {
        navigate("/forbidden");
      } else if (err === 404) {
        navigate("/*");
      } else {
        console.error("Ошибка:", err);
      }
    });
  };

  // Включаем short polling
  useEffect(() => {
    getMissions(); // Начальная загрузка миссий

    // Запуск периодического обновления данных
    const intervalId = setInterval(() => {
      getMissions(); // Повторный запрос каждые 2 секунды
    }, 2000);

    // Очистка таймера при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [dispatch, navigate]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleCreatorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreatorFilter(event.target.value);
  };

  const filteredMissions = missions.filter((mission) => {
    const matchesStatus = statusFilter ? String(mission.status) === statusFilter : true;
    const matchesStartDate = startDate ? (mission.create_datetime && mission.create_datetime >= startDate) : true;
    const matchesEndDate = endDate ? (mission.create_datetime && mission.create_datetime <= endDate) : true;
    const matchesCreator = creatorFilter ? mission.creator?.username.toLowerCase().includes(creatorFilter.toLowerCase()) : true;
    return matchesStatus && matchesStartDate && matchesEndDate && matchesCreator;
  });

  const renderCell = (value: any) => {
    return value || value === 0 ? value : '--';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Форматируем дату с временем (часы и минуты)
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderDateCell = (date: string | null | undefined) => {
    if (!date) return '--';
    return formatDate(date);
  };

  const handleRowClick = (missionId: string) => {
    setSelectedMissionId(missionId); // Запоминаем выбранную миссию
  };

  const handleNavigateToMission = () => {
    if (selectedMissionId) {
      navigate(`/mission/${selectedMissionId}`);
    }
  };

  const handleCompleteMission = (missionId: string) => {
    dispatch(missionCompleteUpdate({ id: missionId, data: { status: 3 } })).unwrap().catch((err) => {
      console.error("Ошибка при завершении миссии:", err);
    });
  };

  const handleRejectMission = (missionId: string) => {
    dispatch(missionCompleteUpdate({ id: missionId, data: { status: 4 } })).unwrap().catch((err) => {
      console.error("Ошибка при отклонении миссии:", err);
    });
  };

  const handleDeleteMission = (missionId: string) => {
    dispatch(missionDelete(missionId)).unwrap().catch((err) => {
      console.error("Ошибка при удалении миссии:", err);
    });
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
            </select>
          </div>
          {role === "admin" || role === "operator" ? (
            <div className='missions-creator-filter d-flex justify-content-center align-items-center flex-column'>
              <label className="filter-text-title" htmlFor="creator-filter">Создатель:</label>
              <input type="text" id="creator-filter" value={creatorFilter} onChange={handleCreatorChange} placeholder="Фильтр по создателю" />
            </div>
          ) : null}
          <div className='missions-form-data-filter'>
            <label className="filter-text-title" htmlFor="start-date">Дата начала:</label>
            <input type="date" id="start-date" value={startDate} onChange={handleStartDateChange} />
          </div>
          <div className='missions-complete-data-filter'>
            <label className="filter-text-title" htmlFor="end-date">Дата окончания:</label>
            <input type="date" id="end-date" value={endDate} onChange={handleEndDateChange} />
          </div>
        </div>
      </div>

      <div className="missions-table">
        {error ? (
          <p>{error}</p>
        ) : (
            <table className="missions-table-bordered">
              <thead>
              <tr>
                <th>№</th>
                <th>Статус</th>
                {(role === "admin" || role === "operator") && <th>Создатель</th>}
                <th>Дата создания</th>
                <th>Дата оформления</th>
                <th>Дата завершения</th>
                <th>Дата планирования</th>
                <th>QR</th>
                {/* Добавлен новый столбец */}
                {(role === "admin" || role === "operator") && <th>Действия</th>}
              </tr>
              </thead>
              <tbody>
              {filteredMissions.length > 0 ? (
                  filteredMissions.map((mission) => (
                      <tr key={mission.id} onClick={() => handleRowClick(String(mission.id))}>
                        <td>{renderCell(mission.id)}</td>
                        <td>{renderCell(mission.status)}</td>
                        {(role === "admin" || role === "operator") && <td>{renderCell(mission.creator?.username)}</td>}
                        <td>{renderDateCell(mission.create_datetime)}</td>
                        <td>{renderDateCell(mission.form_datetime)}</td>
                        <td>{renderDateCell(mission.complete_datetime)}</td>
                        <td>{renderDateCell(mission.plan_date)}</td>

                        {/* QR-код */}
                        <td>
                          {mission.qr ? (
                              <img
                                  src={`data:image/png;base64,${mission.qr}`}
                                  alt="QR Code"
                                  className="qr-code-img"
                                  onClick={() => setSelectedQR(mission.qr)}
                              />
                          ) : (
                              "—"
                          )}
                        </td>

                        {(role === "admin" || role === "operator") && (
                            <td className="d-flex flex-column">
                              {String(mission.status) == "В работе" ? (
                                  <>
                                    <button className="confirm-button mb-1"
                                            onClick={() => handleCompleteMission(String(mission.id))}>
                                      Завершить
                                    </button>
                                    <button className="reject-button mb-1"
                                            onClick={() => handleRejectMission(String(mission.id))}>
                                      Отклонить
                                    </button>
                                    <button className="delete-mission-button"
                                            onClick={() => handleDeleteMission(String(mission.id))}>
                                      Удалить
                                    </button>
                                  </>
                              ) : (
                                  <button className="delete-mission-button"
                                          onClick={() => handleDeleteMission(String(mission.id))}>
                                    Удалить
                                  </button>
                              )}
                            </td>
                        )}
                      </tr>
                  ))
              ) : (
                  <tr>
                    <td colSpan={9} className="no-missions-message">Нет доступных миссий</td>
                  </tr>
              )}
              </tbody>
            </table>
        )}
      </div>
      {selectedQR && (
        <div className="qr-modal" onClick={() => setSelectedQR(null)}>
          <div className="qr-modal-content">
            <img src={`data:image/png;base64,${selectedQR}`} alt="QR Code" />
          </div>
        </div>
      )}
      {selectedMissionId && (
          <div className="navigate-button-container mb-5">
            <button onClick={handleNavigateToMission} className="navigate-button">
              Перейти к миссии {selectedMissionId}
            </button>
          </div>
      )}
    </div>

  );
};

export default MissionsPage;
