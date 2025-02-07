import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "../Routes";
import HomePage from "./pages/HomePage.tsx";
import Navigation from "./components/Navigation.tsx";
import GatewayElementsPage from "./pages/GatewayElementsPage.tsx";
import ElementPage from "./pages/ElementPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Navigation/>
      <Routes>
        <Route path={ROUTES.HOME} index element={<HomePage />} />
        <Route path={ROUTES.GATEWAY_ELEMENTS} element={<GatewayElementsPage />} />
        <Route path={ROUTES.GATEWAY_ELEMENT_DETAIL} element={<ElementPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;