import React from "react";
import { GatewayElement } from '../api/Api.ts';
import { Link } from "react-router-dom";
import "./GatewayElement.css";
import image from "../assets/default.jpg";
import {ROUTES} from "../../Routes.tsx";

interface GatewayCardProps {
  element: GatewayElement;
}

const GatewayCard: React.FC<GatewayCardProps> = ({ element }) => {
  return (
    <div className="element">
        <div className="img-btn">
            <img src={element.img_url || image} className="element-image" alt={element.title}/>
            <Link className="add-mission-btn" to={ROUTES.ADD_TO_MISSION.replace(":element_id", String(element.id))}>
                <div className="ellipse-1"></div>
                <div className="ellipse-2"></div>
                <img src="http://127.0.0.1:9000/img-for-rip/images/Union.png" className="plus-img"/>
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
    </div>
  );
};

export default GatewayCard;
