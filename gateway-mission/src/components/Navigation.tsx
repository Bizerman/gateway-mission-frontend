import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { ROUTES } from "../../Routes.tsx";
import "./Navigation.css";
import {logoutUserAsync} from "../store/slices/userSlice.ts";
import {getGatewayElementsList, setSearchValue} from "../store/slices/GatewayElementsSlice.ts";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated,  username,role } = useSelector((state: RootState) => state.user);
  const isHomePage = location.pathname === '/';
  const handleLogout = async () => {
    await dispatch(logoutUserAsync());
    dispatch(setSearchValue(''));
    navigate('/elements'); // Переход на страницу списка услуг
    await dispatch(getGatewayElementsList()); // Очищаем поле поиска
  };

    return (
        <nav className={`head ${isHomePage ? 'without-bg' : 'with-bg'}`}>
            <Link to={ROUTES.HOME} className="home-btn-container">
                <span className="home-btn-text">Gateway Mission
                    <div className="home-btn-line"></div>
                </span>
            </Link>
            <div className="nav-links">
                {isAuthenticated ? (
                    <>
                        <div className="usage-btns">
                            <Link to={ROUTES.GATEWAY_ELEMENTS} className="user-text">Gateway Elements</Link>
                            <Link to={ROUTES.MISSIONS} className="user-text">Missions</Link>
                        </div>
                        <div className="users-btns">
                            <Link to={ROUTES.PROFILE} className="user-text">{role} - {username}</Link>
                            <button className="user-text logout-btn" onClick={handleLogout}>Logout</button>
                        </div>
                    </>
                ) : (
                    <div className="usage-btns me-5">
                        <Link to={ROUTES.LOGIN} className="guest-text">Login</Link>
                        <span className='guest-text'>|</span>
                        <Link to={ROUTES.REGISTER} className="guest-text">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
