import {FC, useEffect, useState} from "react";
import {GatewayElement,getGatewayElements} from "../modules/GatewayMissionApi.ts";
import GatewayCard from "../components/GatewayElement.tsx";
import "./GatewayElementsPage.css"
import ElementSearchBar from "../components/ElementSearchBar.tsx";

const GatewayElementsPage: FC = () => {
    const [elements, setElements] = useState<GatewayElement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('')
    const handleSearch = async () => {
        setLoading(true);
        const { elements } = await getGatewayElements(); // Получаем "elements" вместо "results"
        setElements(
            elements.filter(item =>
                item.title.toLowerCase().includes(searchValue.toLowerCase())
            )
        );
        setLoading(false);
    };
    useEffect(() => {
        getGatewayElements()
            .then((data) => {
                setElements(data.elements);
                setLoading(false);
            })
            .catch(() => {
                setError("Ошибка загрузки данных");
                setLoading(false);
            });
    }, []);
    return (
        <div className="gateway-products-page-content">
            <div className="content-head">
                <span className="gateway-products-title">Космические корабли и модули</span>
                <div className="orders-search">
                    <ElementSearchBar
                        value={searchValue}
                        setValue={setSearchValue}
                        onSubmit={handleSearch} // передаем функцию поиска
                        placeholder="НАЙТИ..."
                    />
                    {/*{% if data.mission %}*/}
                    {/*    <a href='' >*/}
                    {/*        <div className="missions-active">*/}
                    {/*            <div className="missions-inside">*/}
                    {/*                <img src="http://127.0.0.1:9000/img-for-rip/images/rocket.png" className="missions-image"></img>*/}
                    {/*                <span className="missions-quantity"></span>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </a>*/}
                    {/*{% else  %}*/}
                    <div className="missions-passive">
                        <div className="missions-inside">
                            <img src="http://127.0.0.1:9000/img-for-rip/images/rocket.png" className="missions-image"></img>
                            <span className="missions-quantity">(0)</span>
                        </div>
                    </div>
                    {/*{% endif %}*/}
                </div>
            </div>
            <div className="products">
                {loading ? (
                  <p className="txt">Загрузка...</p>
                ) : error ? (
                  <p className="txt">{error}</p>
                ) : elements && elements.length > 0 ? (
                  elements.map((element) => <GatewayCard key={element.id} element={element} />)
                ) : (
                  <p className="txt">Нет доступных продуктов</p>
                )}
            </div>
        </div>
    )
}
export default GatewayElementsPage