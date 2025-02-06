import {FC} from "react";
import { Col} from "react-bootstrap";
import {Link} from "react-router-dom";
import {ROUTES} from "../../Routes.tsx";
import "./HomePage.css"

const HomePage: FC = () => {

    return (
        <div className="body text-center">
            <Col className="texts">
                <span className="main-text">GATEWAY MISSION</span>
                <span className="secondary-text">Цель проекта - организация и поддержка миссий к лунной орбитальной станции Gateway, обеспечивая доступ к её инфраструктуре для научных, исследовательских и коммерческих целей.</span>
                <div className="d-flex justify-content-center ">
                    <Link to={ROUTES.GATEWAY_ELEMENTS} className="box-link">
                        <span>Модули и корабли</span>
                    </Link>
                    {/*<Link to={ROUTES.GATEWAY_ELEMENTS} className="box-link">*/}
                    {/*    <span>Миссии</span>*/}
                    {/*</Link>*/}
                </div>
            </Col>
        </div>
    )
}

export default HomePage