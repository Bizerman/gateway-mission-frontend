import React from "react";
import { GatewayElement } from '../api/Api.ts';
import { Link } from "react-router-dom";
import "./GatewayElement.css";
import image from "../assets/default.jpg";
import {useSelector} from "react-redux";
import {RootState} from "../store/store.ts";

// Обновляем интерфейс, добавляем onAddToMission как пропс
interface GatewayCardProps {
  element: GatewayElement;
  onAddToMission: (elementId: string) => Promise<void>; // добавляем обработчик
}

const GatewayCard: React.FC<GatewayCardProps> = ({ element, onAddToMission }) => {
  // Обработчик для добавления в миссию
  const handleAddToMission = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Останавливаем переход по ссылке
    onAddToMission(String(element.id)); // Вызываем переданный обработчик
  };
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  return (
  <>
  {isAuthenticated ? (
      <div className="element">
          <div className="img-btn">
              <img
                  src={element.img_url || image}
                  className="element-image"
                  alt={element.title}
              />
              <Link
                  className="add-mission-btn"
                  to={""}
                  onClick={handleAddToMission}
              >
                  <div className="ellipse-1"></div>
                  <div className="ellipse-2"></div>
                  <img
                      src="http://127.0.0.1:9000/img-for-rip/images/Union.png"
                      className="plus-img"
                      alt="Add"
                  />
              </Link>
          </div>
          <span className="element-name">{element.title}</span>
          <span className="element-description">{element.short_description}</span>
          <Link className="element-learn-more-btn" to={`/element/${element.id}`}>
              <span className="learn-more-btn-text">Подробнее</span>
              <div className="learn-more-btn-element">
                  <div className="learn-more-btn-element-arrow"></div>
                  <div className="learn-more-btn-element-arrow-2"></div>
              </div>
          </Link>
      </div>) : (
          <div className="element">
              <div className="img-btn">
                  <img
                      src={element.img_url || image}
                      className="element-image"
                      alt={element.title}
                  />
              </div>
              <span className="element-name">{element.title}</span>
              <span className="element-description">{element.short_description}</span>
              <Link className="element-learn-more-btn" to={`/element/${element.id}`}>
                  <span className="learn-more-btn-text">Подробнее</span>
                  <div className="learn-more-btn-element">
                      <div className="learn-more-btn-element-arrow"></div>
                      <div className="learn-more-btn-element-arrow-2"></div>
                  </div>
              </Link>
          </div>
      )}
      </>
  );

};

export default GatewayCard;
