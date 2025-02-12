import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import { RootState, AppDispatch } from "../../store/store";
import {fetchMissionById, missionElementDelete} from "../../store/slices/MissionDraftSlice";
import { getGatewayElement } from "../../store/slices/GatewayElementsSlice";
import "./DraftMissionPage.css";

const DraftMissionPage: FC = () => {
  const { mission_id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

    const { currentMission, loading, error } = useSelector(
    (state: RootState) => state.missions
  );


  const handleDeleteMission = async () => {
    if (!currentMission?.mission.id) return;

    try {
      // Удаляем элементы миссии
      for (const element of currentMission.elements || []) {
        if (element.id) {
          // Отправляем запрос на удаление каждого элемента
          await dispatch(missionElementDelete({ missionId: String(currentMission.mission.id), elementId: String(element.id) }));
        }
      }
      // Перенаправляем пользователя на другую страницу
      navigate("/elements"); // Редирект на страницу со списком миссий после удаления
    } catch (error) {
      console.error("Ошибка при удалении элементов или миссии:", error);
    }
  };

    useEffect(() => {
    if (mission_id) {
      if (!currentMission?.mission.id || currentMission?.mission.id !== Number(mission_id)) {
        dispatch(fetchMissionById(mission_id));
      }

      if (currentMission?.elements?.length) {
        currentMission.elements.forEach((elementMission) => {
          if (elementMission.id && !currentMission.elements.some((e) => e.id === elementMission.id)) {
            dispatch(getGatewayElement(Number(elementMission.id)));
          }
        });
      }
    }
  }, [dispatch, mission_id, currentMission?.mission.id, currentMission?.elements]); // Зависимости от mission_id, данных миссии и элементов




  const renderElements = () => {
  return currentMission?.elements
    .filter((element) => currentMission?.elements?.some((missionElement) => missionElement.id === element.id))
    .map((element) => (
      <div className="draft-element" key={element.id}>
        <div className="draft-element-box">
          <img src={element.img_url || "default-image.jpg"} className="draft-element-image" alt={element.title} />
          <span className="draft-element-title">{element.title}</span>
        </div>
        <span className="draft-element-description">{element.short_description}</span>
      </div>
    ));
};


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
      <div className="mission-btns">
        <button className="mission-del-btn" onClick={handleDeleteMission}>
          <span className="mission-del-btn-text">Удалить миссию</span>
        </button>
      </div>
    </div>
  );
};

export default DraftMissionPage;
