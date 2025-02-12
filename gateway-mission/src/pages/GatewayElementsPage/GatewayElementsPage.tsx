import { FC, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store.ts";
import { getGatewayElementsList, setSearchValue } from "../../store/slices/GatewayElementsSlice.ts";
import {addElementToMission, fetchMissionById} from "../../store/slices/MissionDraftSlice.ts";
import GatewayCard from "../../components/GatewayElement.tsx";
import "./GatewayElementsPage.css";
import ElementSearchBar from "../../components/ElementSearchBar.tsx";
import Rocket_img from "../../assets/rocket.png";
import {Link} from "react-router-dom";


const GatewayElementsPage: FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { elements = [], draft_element_count, draft_mission_id, searchValue = '', loading, error } = useSelector(
    (state: RootState) => state.gateway || {}
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const missionsImage = Rocket_img || "http://127.0.0.1:9000/img-for-rip/images/rocket.png";
  console.log(elements)
  useEffect(() => {
    if (draft_mission_id) {
      dispatch(getGatewayElementsList());
      dispatch(fetchMissionById(String(draft_mission_id)));
    }
  }, [dispatch, draft_mission_id,draft_element_count]);

  const handleSearch = () => {
    dispatch(getGatewayElementsList());
  };

  const handleAddToMission = async (elementId: string) => {
    if (draft_mission_id) {
      try {
        await dispatch(addElementToMission(elementId));  // Добавляем элемент в миссию
        dispatch(getGatewayElementsList());  // Перезапрашиваем элементы
      } catch (error) {
        console.error("Ошибка при добавлении элемента в миссию:", error);
      }
    }
  };
  return (
    <div className="gateway-products-page-content">
      <div className="content-head">
        <span className="gateway-products-title">Космические корабли и модули</span>
        <div className="orders-search">
          <ElementSearchBar
            value={searchValue}
            setValue={(value: string) => dispatch(setSearchValue(value))}
            onSubmit={handleSearch}
            placeholder="НАЙТИ..."
          />
          {isAuthenticated && draft_element_count > 0 ? (
            <Link to={`/mission/${draft_mission_id}`}>
              <div className="missions-active">
                <div className="missions-inside">
                  <img
                    src={missionsImage}
                    alt="Missions"
                    className="missions-image"
                  />
                  <span className="missions-quantity">({draft_element_count})</span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="missions-passive">
              <div className="missions-inside">
                <img
                  src={missionsImage}
                  alt="Missions"
                  className="missions-image"
                />
                <span className="missions-quantity">(0)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="products">
        {loading ? (
          <p className="txt">Загрузка...</p>
        ) : error ? (
          <p className="txt">{error}</p>
        ) : elements.length > 0 ? (
          elements.map((element) => (
            <GatewayCard
              key={element.id}
              element={element}
              onAddToMission={handleAddToMission}
            />
          ))
        ) : (
          <p className="txt">Нет доступных продуктов</p>
        )}
      </div>
    </div>
  );
};

export default GatewayElementsPage;
