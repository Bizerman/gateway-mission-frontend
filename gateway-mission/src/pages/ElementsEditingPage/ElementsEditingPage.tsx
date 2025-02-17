import { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import {
  addNewGatewayElement,
  deleteGatewayElement,
  updateGatewayElement,
  uploadImage
} from "../../store/slices/GatewayElementsSlice.ts";
import './ElementsEditingPage.css';
import { getGatewayElementsList } from "../../store/slices/GatewayElementsSlice.ts";

const ElementsEditingPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { elements = [], error, loading } = useSelector(
    (state: RootState) => state.gateway || {}
  );
  const [newElement, setNewElement] = useState<any>({}); // Для хранения новых данных
  const [editingElement, setEditingElement] = useState<any | null>(null); // Для редактируемого элемента
  const [image, setImage] = useState<File | null>(null); // Для изображения
  const [showNewElementRow, setShowNewElementRow] = useState(false); // Для отображения строки добавления нового элемента

  useEffect(() => {
    dispatch(getGatewayElementsList()); // Загружаем список элементов
  }, [dispatch]);

  const renderCell = (value: any) => {
    return value || value === 0 ? value : '--';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]); // Обновляем состояние с изображением
    }
  };

  const handleSaveNewRow = () => {
    const data = {
      title: newElement.title,
      short_description: newElement.short_description,
      full_description: newElement.full_description,
      status: Boolean(newElement.status), // Преобразуем строку в boolean
    };

    dispatch(addNewGatewayElement(data));
    setNewElement({}); // Очищаем после добавления
    setShowNewElementRow(false); // Скрываем форму добавления элемента
  };

  const handleSaveEdit = () => {
    const data = {
      title: newElement.title,
      short_description: newElement.short_description,
      full_description: newElement.full_description,
      status: Boolean(newElement.status),
    };

    if (editingElement) {
      // Сначала обновляем элемент
      dispatch(updateGatewayElement({ id: editingElement.id, data })).then(() => {
        // Проверяем, что изображение было выбрано
        if (image) {
          // Отправляем только сам файл
          dispatch(uploadImage({ id: editingElement.id, image: image })).then(() => {
            dispatch(getGatewayElementsList()); // Перезагружаем список элементов
            setEditingElement(null);
            setNewElement({});
            setImage(null); // Очищаем состояние изображения
          }).catch(error => {
            console.error("Ошибка при загрузке изображения:", error);
          });
        } else {
          // Если изображения нет, просто перезагружаем список
          dispatch(getGatewayElementsList());
          setEditingElement(null);
          setNewElement({});
        }
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingElement(null); // Отменяем редактирование
    setNewElement({}); // Сбрасываем введенные данные
    setImage(null); // Сбрасываем изображение
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewElement((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewElement((prevState: any) => ({
      ...prevState,
      [name]: value === 'true', // Преобразуем строку в boolean
    }));
  };

  const handleDeleteElement = (id: string) => {
    dispatch(deleteGatewayElement(id)); // Вызываем удаление элемента через Redux
  };

  const handleCellClick = (element: any, field: string) => {
    console.log(field)
    setEditingElement(element); // Включаем режим редактирования для этого элемента
    setNewElement({
      title: element.title,
      short_description: element.short_description,
      full_description: element.full_description,
      status: element.status ? "true" : "false",
    });
  };

  return (
    <div className="gateway-elements-page-box">
      <span className="gateway-products-title">Список элементов</span>
      <div className="gateway-elements-content-box">
        <div className="gateway-elements-content-header"></div>
      </div>
      <div className="gateway-elements-table">
        {error ? (
          <p>{error}</p>
        ) : (
          <table className="gateway-elements-table-bordered">
            <thead>
              <tr>
                <th>№</th>
                <th>Название</th>
                <th>Короткое описание</th>
                <th>Полное описание</th>
                <th>Статус</th>
                <th>Изображение</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {elements.length > 0 ? (
                elements.map((element) => (
                  <tr key={element.id}>
                    {editingElement && editingElement.id === element.id ? (
                      // Режим редактирования
                      <>
                        <td>{element.id}</td>
                        <td>
                          <input
                            type="text"
                            name="title"
                            value={newElement.title || ""}
                            onChange={handleInputChange}
                            placeholder="Введите название"
                            style={{ all: "unset" }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="short_description"
                            value={newElement.short_description || ""}
                            onChange={handleInputChange}
                            placeholder="Введите короткое описание"
                            style={{ all: "unset" }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="full_description"
                            value={newElement.full_description || ""}
                            onChange={handleInputChange}
                            placeholder="Введите полное описание"
                            style={{ all: "unset" }}
                          />
                        </td>
                        <td>
                          <select
                            name="status"
                            value={newElement.status ? "true" : "false"}
                            onChange={handleSelectChange}
                          >
                            <option value="true">Активен</option>
                            <option value="false">Неактивен</option>
                          </select>
                        </td>
                        <td>
                          <input type="file" onChange={handleImageUpload} />
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="confirm-changes-btn" onClick={handleSaveEdit} disabled={loading}>
                              {loading ? "Сохранение..." : "Сохранить изменения"}
                            </button>
                            <button className="reject-changes-btn" onClick={handleCancelEdit} disabled={loading}>
                              Отменить изменения
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // Обычный режим
                      <>
                        <td>{renderCell(element.id)}</td>
                        <td onClick={() => handleCellClick(element, "title")}>
                          {renderCell(element.title)}
                        </td>
                        <td onClick={() => handleCellClick(element, "short_description")}>
                          {renderCell(element.short_description)}
                        </td>
                        <td onClick={() => handleCellClick(element, "full_description")}>
                          {renderCell(element.full_description)}
                        </td>
                        <td onClick={() => handleCellClick(element, "status")}>
                          {renderCell(element.status ? "Активен" : "Неактивен")}
                        </td>
                        <td>
                          {element.img_url ? (
                            <img
                              src={element.img_url}
                              alt="Image"
                              style={{ width: "50%", height: "50%", objectFit: "cover" }}
                            />
                          ) : (
                            "--"
                          )}
                        </td>
                        <td className="delete-button-container">
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteElement(String(element.id))}
                            disabled={loading}
                          >
                            {loading ? "Удаление..." : "Удалить"}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="no-elements-message">
                    Нет доступных элементов
                  </td>
                </tr>
              )}

              {/* Форма для добавления нового элемента */}
              {showNewElementRow && !editingElement && (
                <tr>
                  <td>-</td>
                  <td>
                    <input
                      type="text"
                      name="title"
                      value={newElement.title || ""}
                      onChange={handleInputChange}
                      placeholder="Введите название"
                      style={{ all: "unset" }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="short_description"
                      value={newElement.short_description || ""}
                      onChange={handleInputChange}
                      placeholder="Введите короткое описание"
                      style={{ all: "unset" }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="full_description"
                      value={newElement.full_description || ""}
                      onChange={handleInputChange}
                      placeholder="Введите полное описание"
                      style={{ all: "unset" }}
                    />
                  </td>
                  <td>
                    <select
                      name="status"
                      value={newElement.status ? "true" : "false"}
                      onChange={handleSelectChange}
                    >
                      <option value="true">Активен</option>
                      <option value="false">Неактивен</option>
                    </select>
                  </td>
                  <td colSpan={2}>
                    <button onClick={handleSaveNewRow} disabled={loading}>
                      {loading ? "Добавление..." : "Добавить элемент"}
                    </button>
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={7}>
                  <button
                    className="full-width-button"
                    onClick={() => setShowNewElementRow(true)}
                    disabled={editingElement || loading}
                    style={{ width: "100%" }}
                  >
                    Добавить новый элемент
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ElementsEditingPage;
