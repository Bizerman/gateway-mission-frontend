import { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store.ts";
import { getGatewayElementsList, setSearchValue } from "../../store/slices/GatewayElementsSlice.ts";
import { addElementToMission, fetchMissionById } from "../../store/slices/MissionDraftSlice.ts";
import GatewayCard from "../../components/GatewayElement.tsx";
import "./GatewayElementsPage.css";
import ElementSearchBar from "../../components/ElementSearchBar.tsx";
import Rocket_img from "../../assets/rocket.png";
import { Link } from "react-router-dom";

const GatewayElementsPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { elements = [], draft_element_count, draft_mission_id, searchValue = '', error } = useSelector(
    (state: RootState) => state.gateway || {}
  );
  const { isAuthenticated, role } = useSelector((state: RootState) => state.user);  // Добавляем роль пользователя
  const missionsImage = Rocket_img || "http://127.0.0.1:9000/img-for-rip/images/rocket.png";

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "warning">("success");

  useEffect(() => {
    if (draft_mission_id) {
      dispatch(getGatewayElementsList());
      dispatch(fetchMissionById(String(draft_mission_id)));
    }
  }, [dispatch, draft_mission_id, draft_element_count]);

  const handleSearch = () => {
    dispatch(getGatewayElementsList());
  };

  const handleAddToMission = async (elementId: string) => {
    if (draft_mission_id) {
      try {
        await dispatch(addElementToMission(elementId)).unwrap();
        dispatch(getGatewayElementsList());
        setToastMessage("Элемент успешно добавлен в миссию!");
        setToastType("success");

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (error) {
        console.error("Ошибка при добавлении элемента в миссию:", error);

        setToastMessage("Элемент уже добавлен в черновик");
        setToastType("warning");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  return (
    <div className="gateway-products-page-content">
      <div className="content-head">
        <span className="gateway-products-title">Космические корабли и модули</span>
        <div className="orders-search">
          <div className='d-flex flex-column'>
            <ElementSearchBar
              value={searchValue}
              setValue={(value: string) => dispatch(setSearchValue(value))}
              onSubmit={handleSearch}
              placeholder="НАЙТИ..."
            />
            {(role === "admin" || role === "moderator") && (
              <Link to="/elements/edit">
                <button className="edit-elements-btn">Редактировать элементы</button>
              </Link>
            )}
          </div>
          {isAuthenticated && draft_element_count > 0 ? (
            <Link to={`/mission/${draft_mission_id}`}>
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
                <span className="missions-quantity">(0)</span>
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="products">
        {error ? (
          <p className="txt">{error}</p>
        ) : elements.length > 0 ? (
          elements.map((element) => (
            <GatewayCard key={element.id} element={element} onAddToMission={handleAddToMission} />
          ))
        ) : (
          <p className="txt">Нет доступных продуктов</p>
        )}
      </div>
      {/* Всплывающее уведомление */}
      {showToast && (
        <div className={`toast-container-custom ${toastType === "success" ? "bg-success" : "bg-warning"}`}>
          <div className="d-flex">
            <div className="toast-body">{toastMessage}</div>
            <button
              type="button"
              className="btn-close ms-2 me-2 m-auto"
              onClick={() => setShowToast(false)}
            >
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GatewayElementsPage;
