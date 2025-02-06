import "./ElementPage.css";
import { FC, useEffect, useState } from "react";
import { GatewayElement, getElementById } from "../modules/GatewayMissionApi.ts";
import { BreadCrumbs } from "../components/BreadCrumbs.tsx";
import { useParams } from "react-router-dom";
import {ROUTE_LABELS} from "../../Routes.tsx";

const ElementPage: FC = () => {
    const [element, setElement] = useState<GatewayElement | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();

    useEffect(() => {
        if (!id) {
            setError("ID элемента отсутствует");
            setLoading(false);
            return;
        }

        setLoading(true);
        getElementById(id)
            .then((data) => {
                setElement(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Ошибка загрузки данных");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <h2 className="d-flex justify-content-center align-items-center vw-100">Загрузка...</h2>;
    if (error) return <h2 className="d-flex justify-content-center align-items-center vw-100">{error}</h2>;
    if (!element) return <h2 className="d-flex justify-content-center align-items-center vw-100">Данные отсутствуют</h2>;

    return (
        <>
        <BreadCrumbs crumbs={[{ label: element.title || ROUTE_LABELS.GATEWAY_ELEMENT_DETAIL, path: `/element/${id}` }]} />
            <div className="product-page-content">
                <img src={element.img_url} className="product-image" alt={element.title}/>
                <div className="product">
                    <span className="product-page-title">{element.title || "Название отсутствует"}</span>
                    <div className="product-info-line"></div>
                    <span className="product-info">{element.full_description || "Описание отсутствует"}</span>
                </div>
            </div>
        </>
    );
};

export default ElementPage;
