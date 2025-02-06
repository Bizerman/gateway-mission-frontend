import {Link, useLocation} from "react-router-dom";
import {ROUTES} from "../../Routes.tsx";
import "./Navigation.css"
const Navigation = () =>{
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    return (
        <nav className={`head ${isHomePage ? 'without-bg' : 'with-bg'}`}>
            <Link to={ROUTES.HOME}>
                <span className="home-btn-text">Gateway Mission</span>
                <div className="home-btn-line"></div>
            </Link>
        </nav>
    );
};
export default Navigation