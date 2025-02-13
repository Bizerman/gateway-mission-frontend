import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../../store/store";
import {
  fetchMissionById,
  missionElementDelete,
  updateMissionForm
} from "../../store/slices/MissionDraftSlice";
import { getGatewayElement } from "../../store/slices/GatewayElementsSlice";
import "./DraftMissionPage.css";

const MissionPage: FC = () => {
  const { mission_id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Получаем миссию из Redux состояния
  const { currentMission, loading, error } = useSelector(
    (state: RootState) => state.missions
  );

  // Состояние для элементов миссии
  const [elements, setElements] = useState(currentMission?.elements || []);

  // Загружаем миссию по mission_id из URL
  useEffect(() => {
    if (mission_id) {
      dispatch(fetchMissionById(mission_id)); // Загружаем миссию
    }
  }, [dispatch, mission_id]);

  useEffect(() => {
    if (currentMission) {
      // Обновляем элементы, если они появились в текущей миссии
      setElements(currentMission.elements || []);

      // Загружаем элементы, если их нет в сторе
      currentMission.elements?.forEach((elementMission) => {
        if (elementMission.id) {
          dispatch(getGatewayElement(Number(elementMission.id)));
        }
      });
    }
  }, [dispatch, currentMission]);

  // Обработчик для удаления миссии
  const handleDeleteMission = async () => {
    if (!currentMission?.mission.id) return;

    try {
      // Удаляем элементы миссии
      for (const element of currentMission.elements || []) {
        if (element.id) {
          await dispatch(missionElementDelete({ missionId: String(currentMission.mission.id), elementId: String(element.id) }));
        }
      }
      // Перенаправляем на главную страницу
      navigate("/");
    } catch (error) {
      console.error("Ошибка при удалении элементов или миссии:", error);
    }
  };

  // Обработчик для формирования миссии
  const handleFormMission = async () => {
    if (!currentMission?.mission.id) return;
    try {
      await dispatch(updateMissionForm());
      navigate("/elements");
    } catch (error) {
      console.error("Ошибка при формировании миссии:", error);
    }
  };

  // Обработчик удаления элемента
  const handleRemoveClick = (missionId: string, elementId: string) => {
    dispatch(missionElementDelete({ missionId, elementId }));
    setElements((prevElements) => prevElements.filter((element) => String(element.id) !== elementId));

    if (elements.length === 1) {
      navigate("/"); // Перенаправляем на главную страницу, если после удаления элементов их не осталось
    }
  };

  // Рендер элементов миссии
  const renderElements = () => {
    return elements?.map((element) => (
      <div className="draft-element" key={element.id}>
        <div className="draft-element-box">
          <img src={element.img_url || "default-image.jpg"} className="draft-element-image" alt={element.title} />
          <span className="draft-element-title">{element.title}</span>
        </div>
        <div className="second-element-box">
          <span className="draft-element-description">{element.short_description || '--'}</span>
          {String(currentMission?.mission.status) === 'Введена' && (
            <button
              className="delete-draft-element-btn"
              onClick={() => handleRemoveClick(String(currentMission?.mission.id), String(element.id))}
            >
            </button>
          )}
        </div>
      </div>
    ));
  };

  // Если элементы пустые и миссия загружена, перенаправляем
  useEffect(() => {
    if (!loading && currentMission && currentMission?.elements?.length === 0) {
      navigate("/"); // Перенаправление на главную страницу, если элементов нет
    }
  }, [loading, currentMission, navigate]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!currentMission) return <p>Миссия не найдена</p>;

  return (
    <div className="mission-page-content">
      <span className="mission-title">Миссия</span>
      <div className="mission-info">
        <div className="mission-frame-title">
          <span className="draft-element-column-title">Объект</span>
          <span className="draft-element-column-description">Описание</span>
          <div className="card-frame-line-1"></div>
        </div>
        <div className="mission-frame-info">{renderElements()}</div>
        <div className="card-frame-line-2"></div>
      </div>
      {String(currentMission?.mission.status) === 'Введена' && (
        <div className="mission-btns">
          <button className="mission-form-btn" onClick={handleFormMission}>
            <span className="mission-form-btn-text">Сформировать миссию</span>
          </button>
          <button className="mission-del-btn" onClick={handleDeleteMission}>
            <span className="mission-del-btn-text">Удалить миссию</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MissionPage;
