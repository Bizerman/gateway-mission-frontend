import { FC, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import './ElementsEditingPage.css';
import {getGatewayElementsList} from "../../store/slices/GatewayElementsSlice.ts";

const ElementsEditingPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { elements = [] , error} = useSelector(
    (state: RootState) => state.gateway || {}
  );

  useEffect(() => {
    dispatch(getGatewayElementsList()); // Загружаем список элементов
  }, [dispatch]);


  const renderCell = (value: any) => {
    return value || value === 0 ? value : '--';
  };



  return (
    <div className='gateway-elements-page-box'>
      <span className='gateway-products-title'>Список элементов</span>
      <div className='gateway-elements-content-box'>
        <div className='gateway-elements-content-header'>
        </div>
      </div>

      <div className="gateway-elements-table">
        { error ? (
          <p>{error}</p>
        ) : (
            <table className="gateway-elements-table-bordered">
              <thead>
              <tr>
                <th>№</th>
                <th>Название</th>
                <th>Описание</th>
                <th>Статус</th>
              </tr>
              </thead>
              <tbody>
              {elements.length > 0 ? (
                  elements.map((element) => (
                      <tr>
                        <td>{renderCell(element.id)}</td>
                        <td>{renderCell(element.title)}</td>
                        <td>{renderCell(element.short_description)}</td>
                        <td>{renderCell(element.status ? "Активен" : "Неактивен")}</td>
                      </tr>
                  ))
              ) : (
                  <tr>
                    <td colSpan={4} className="no-elements-message">Нет доступных элементов</td>
                  </tr>
              )}
              </tbody>
            </table>
        )}
      </div>
    </div>
  );
};

export default ElementsEditingPage;
