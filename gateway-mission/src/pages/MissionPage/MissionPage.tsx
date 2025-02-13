import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../../store/store.ts";
import { getGatewayElement } from "../../store/slices/GatewayElementsSlice.ts";
import "./currentMissionPage.css";

const MissionPage: FC = () => {
  const { mission_id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentMission, loading, error } = useSelector(
    (state: RootState) => state.missions
  );

  const [elements] = useState(currentMission?.elements || []);
  
  

  useEffect(() => {
    if (mission_id) {
      if (!currentMission?.mission.id || currentMission?.mission.id !== Number(mission_id)) {
      }
      if (currentMission?.elements?.length) {
        currentMission.elements.forEach((elementMission) => {
          if (elementMission.id && !currentMission.elements.some((e) => e.id === elementMission.id)) {
            dispatch(getGatewayElement(Number(elementMission.id)));
          }
        });
      }
    }
  }, [dispatch, mission_id, currentMission?.mission.id, currentMission?.elements]);


  const renderElements = () => {
    return elements
      .filter((element) => elements.some((missionElement) => missionElement.id === element.id))
      .map((element) => (
        <div className="draft-element" key={element.id}>
          <div className="draft-element-box">
            <img src={element.img_url || "default-image.jpg"} className="draft-element-image" alt={element.title} />
            <span className="draft-element-title">{element.title}</span>
          </div>
          <div className="second-element-box">
            <span className="draft-element-description">{element.short_description || '--'}</span>
          </div>
        </div>
      ));
  };

  useEffect(() => {
    if (elements.length === 0) {
      navigate("/"); // Перенаправление на главную страницу, если элементов нет
    }
  }, [elements, navigate]);

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
    </div>
  );
};

export default MissionPage;