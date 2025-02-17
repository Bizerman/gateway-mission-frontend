import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../../store/store";
import {
  fetchMissionById,
  missionElementDelete,
  updateMissionElement,
  updateMissionForm
} from "../../store/slices/MissionDraftSlice";
import { getGatewayElement } from "../../store/slices/GatewayElementsSlice";
import { BreadCrumbs } from "../../components/BreadCrumbs";  // Импортируем компонент хлебных крошек
import "./DraftMissionPage.css";

const MissionPage: FC = () => {
  const { mission_id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentMission, error } = useSelector(
    (state: RootState) => state.missions
  );

  const [elements, setElements] = useState(currentMission?.elements || []);
  const [editedElements, setEditedElements] = useState(
    elements?.map((element) => ({
      ...element,
      addition: element.addition || "", // Обеспечиваем, что поле всегда строка
      isEditing: false // Добавляем флаг редактирования
    }))
  );

  useEffect(() => {
    if (mission_id) {
      dispatch(fetchMissionById(mission_id)).unwrap().catch((err) => {
      // Перехватываем ошибку и перенаправляем в зависимости от статуса
      if (err === 403) {
        navigate("/forbidden");
      } else if (err === 404) {
        navigate("/*");
      } else {
        // Если ошибка не 403 или 404, показываем ошибку
        console.error("Ошибка:", err);
      }
    });
    }
  }, [dispatch, mission_id]);

  useEffect(() => {
    if (currentMission && currentMission.elements) {
      setElements(currentMission.elements);

      // Добавляем addition для каждого элемента
      setEditedElements(
        currentMission.elements.map((element) => ({
          ...element,
          addition: element.addition || "", // Обеспечиваем, что поле всегда строка
          isEditing: false
        }))
      );

      // Получаем дополнение (addition) для каждого элемента через м-м
      currentMission.elements.forEach((elementMission) => {
        if (elementMission.id) {
          dispatch(getGatewayElement(Number(elementMission.id)));
        }
      });
    }
  }, [dispatch, currentMission]);

  const handleAdditionChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    setEditedElements((prevElements) =>
      prevElements.map((element) =>
        element.id === id ? { ...element, addition: e.target.value } : element
      )
    );
  };

  const handleSaveChanges = async (id: number) => {
    const updatedElement = editedElements.find(element => element.id === id);
    if (updatedElement) {
      await dispatch(
        updateMissionElement({
          missionId: String(currentMission?.mission.id),
          elementId: String(updatedElement.id),
          data: { addition: updatedElement.addition }
        })
      );

      setEditedElements((prevElements) =>
        prevElements.map((element) =>
          element.id === id ? { ...element, isEditing: false } : element
        )
      );
    }
  };

  const handleEditClick = (id: number) => {
    setEditedElements((prevElements) =>
      prevElements.map((element) =>
        element.id === id ? { ...element, isEditing: true } : element
      )
    );
  };

  const handleDeleteMission = async () => {
    if (!currentMission?.mission.id) return;

    try {
      for (const element of currentMission.elements || []) {
        if (String(element.id)) {
          await dispatch(
            missionElementDelete({
              missionId: String(currentMission.mission.id),
              elementId: String(element.id)
            })
          );
        }
      }
      navigate("/");
    } catch (error) {
      console.error("Ошибка при удалении элементов или миссии:", error);
    }
  };

  const handleFormMission = async () => {
    if (!currentMission?.mission.id) return;
    try {
      await dispatch(updateMissionForm());
      navigate("/elements");
    } catch (error) {
      console.error("Ошибка при формировании миссии:", error);
    }
  };

  const handleRemoveClick = (missionId: string, elementId: string) => {
    dispatch(missionElementDelete({ missionId, elementId }))
      .then(() => {
        const updatedElements = elements.filter(
          (element) => String(element.id) !== elementId
        );
        setElements(updatedElements);

        const updatedEditedElements = editedElements.filter(
          (element) => String(element.id) !== elementId
        );
        setEditedElements(updatedEditedElements);

        if (updatedElements.length === 0) {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Ошибка при удалении элемента: ", error);
      });
  };

  const renderElements = () => {
    return editedElements?.map((element) => (
      <div className="draft-element" key={String(element.id)}>
        <div className="draft-element-box">
          <img
            src={element.img_url || "default-image.jpg"}
            className="draft-element-image"
            alt={element.title}
          />
          <span className="draft-element-title">{element.title}</span>
        </div>
        <div className="second-element-box">
          <span className="draft-element-description">
            {element.short_description || "--"}
          </span>
          <div className="third-element-box">
            {String(currentMission?.mission.status) !== "Введена" ? (
              <span className="draft-element-addition">
                {element.addition || "Комментарий отсутствует"}
              </span>
            ) : (
              !element.isEditing ? (
                <span
                  className="draft-element-addition"
                  onClick={() => handleEditClick(element.id)}
                >
                  {element.addition || "Добавьте комментарий"}
                </span>
              ) : (
                <div className="edit-addition-container">
                  <input
                    type="text"
                    value={element.addition || ""}
                    onChange={(e) => handleAdditionChange(e, element.id)}
                    className="draft-element-input"
                  />
                  <button
                    className="mt-3"
                    onClick={() => handleSaveChanges(element.id)}
                  >
                    Сохранить
                  </button>
                </div>
              )
            )}
            {String(currentMission?.mission.status) === "Введена" && (
              <button
                className="delete-draft-element-btn"
                onClick={() =>
                  handleRemoveClick(
                    String(currentMission?.mission.id),
                    String(element.id)
                  )
                }
              >
              </button>
            )}
          </div>
        </div>
      </div>
    ));
  };

  if (error) return <h2 className="d-flex justify-content-center align-items-center vw-100">Ошибка: {error}</h2>;
  if (!currentMission) return <h2 className="d-flex justify-content-center align-items-center vw-100">Миссия не найдена</h2>;

  return (
      <div className="mission-page-content">
        {/* Отображаем хлебные крошки, если миссия не черновик */}
        {String(currentMission?.mission.status) !== "Введена" && (
            <BreadCrumbs
              crumbs={[{
                label: "Миссия " + String(currentMission.mission.id) || "Миссия",
                path: `/mission/${mission_id}`
              }]}
              isMissionPage={true}
            />
        )}
        <div className="mission-content">
          <span className="mission-title">Миссия</span>
          <div className="mission-info">
            <div className="mission-frame-title">
              <span className="draft-element-column-title">Объект</span>
              <span className="draft-element-column-description">Описание</span>
              <span className="draft-element-column-description">Комментарий</span>
              <div className="card-frame-line-1"></div>
            </div>
            <div className="mission-frame-info">{renderElements()}</div>
            <div className="card-frame-line-2"></div>
          </div>
          {String(currentMission?.mission.status) === "Введена" && (
              <div className="mission-btns">
                <button className="mission-form-btn" onClick={handleFormMission}>
                  <span className="mission-form-btn-text">Сформировать миссию</span>
                </button>
                <button className="mission-del-btn" onClick={handleDeleteMission}>
                  <span className="mission-del-btn-text">Удалить миссию</span>
                </button>
              </div>
          )}
        </div>
      </div>
  );
};

export default MissionPage;
