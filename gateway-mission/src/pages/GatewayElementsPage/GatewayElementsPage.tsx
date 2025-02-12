import { FC, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store.ts";
import { getGatewayElementsList, setSearchValue } from "../../store/slices/GatewayElementsSlice.ts";
import GatewayCard from "../../components/GatewayElement.tsx";
import "./GatewayElementsPage.css";
import ElementSearchBar from "../../components/ElementSearchBar.tsx";
import Rocket_img from "../../assets/rocket.png";
import { Link } from "react-router-dom"; // Для навигации по ссылке

const GatewayElementsPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { elements = [], searchValue = '', loading, error, draft_mission_id, draft_element_count } = useSelector((state: RootState) => state.gateway || {});

  const missionsImage = Rocket_img || "http://127.0.0.1:9000/img-for-rip/images/rocket.png";

  useEffect(() => {
    dispatch(getGatewayElementsList());
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(getGatewayElementsList());
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
          {/* Логика для отображения активной или пассивной миссии */}
          {draft_mission_id ? (
            <Link to={`/gateway/mission/${draft_mission_id}`}>
              <div className="missions-active">
                <div className="missions-inside">
                  <img src={missionsImage} alt="Missions" className="missions-image" />
                  <span className="missions-quantity">({draft_element_count})</span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="missions-passive">
              <div className="missions-inside">
                <img src={missionsImage} alt="Missions" className="missions-image" />
                <span className="missions-quantity">({draft_element_count})</span>
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
          elements.map((element) => <GatewayCard key={element.id} element={element} />)
        ) : (
          <p className="txt">Нет доступных продуктов</p>
        )}
      </div>
    </div>
  );
};

export default GatewayElementsPage;
