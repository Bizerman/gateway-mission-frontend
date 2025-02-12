import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {getGatewayElement} from '../../store/slices/GatewayElementsSlice.ts';
import {AppDispatch, RootState} from '../../store/store.ts';
import { BreadCrumbs } from '../../components/BreadCrumbs.tsx';
import { ROUTE_LABELS } from '../../../Routes.tsx';
import './ElementPage.css';

const ElementPage: FC = () => {
  const { element_id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { element, loading, error } = useSelector((state: RootState) => state.gateway);

  useEffect(() => {
  if (element_id && !isNaN(Number(element_id))) {
    dispatch(getGatewayElement(Number(element_id)));
  }
}, [dispatch, element_id]);

  if (loading) return <h2 className="d-flex justify-content-center align-items-center vw-100">Загрузка...</h2>;
  if (error) return <h2 className="d-flex justify-content-center align-items-center vw-100">{error}</h2>;
  if (!element) return <h2 className="d-flex justify-content-center align-items-center vw-100">Данные отсутствуют</h2>;

  return (
    <>
      <BreadCrumbs crumbs={[{ label: element.title || ROUTE_LABELS.GATEWAY_ELEMENT_DETAIL, path: `/element/${element_id}` }]} />
      <div className="product-page-content">
        <img src={element.img_url || "default_image_url.jpg"} className="product-image" alt={element.title} />
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
