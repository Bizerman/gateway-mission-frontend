import React from "react";
import { GatewayElement } from "../modules/GatewayMissionApi.ts";
import {Link} from "react-router-dom";
import {ROUTES} from "../../Routes.tsx";
import "./GatewayElement.css"
import image from "../assets/default.jpg"

interface GatewayCardProps {
  element: GatewayElement;
}

const GatewayCard: React.FC<GatewayCardProps> = ({ element }) => {
  return (
      <div className="element">
          <div className="img-btn">
              <img src={element.img_url || image} className="element-image"/>
          </div>
          <span className="element-name">{element.title}</span>
          <span className="element-description">{element.short_description}</span>
          <Link className="element-learn-more-btn" to={ROUTES.GATEWAY_ELEMENT_DETAIL.replace(":id", element.id.toString())}>
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

