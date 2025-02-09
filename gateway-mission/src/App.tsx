import {registerSW} from "virtual:pwa-register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "../Routes";
import HomePage from "./pages/HomePage.tsx";
import Navigation from "./components/Navigation.tsx";
import GatewayElementsPage from "./pages/GatewayElementsPage.tsx";
import ElementPage from "./pages/ElementPage.tsx";
import {useEffect} from "react";
import {invoke} from "@tauri-apps/api/core";



function App() {
    useEffect(()=>{
        invoke('tauri', {cmd: 'create'})
            .then((response: any) => console.log(response))
            .catch((error: any) => console.log(error));

        return() => {
            invoke('tauri', {cmd: 'close'})
                .then((response: any) => console.log(response))
                .catch((error: any) => console.log(error));
        }
    }, []);
  return (
    <BrowserRouter basename="/gateway-mission-frontend">
      <Navigation/>
      <Routes>
        <Route path={ROUTES.HOME} index element={<HomePage />} />
        <Route path={ROUTES.GATEWAY_ELEMENTS} element={<GatewayElementsPage />} />
        <Route path={ROUTES.GATEWAY_ELEMENT_DETAIL} element={<ElementPage />} />
      </Routes>
    </BrowserRouter>
  );
}
if ("serviceWorker" in navigator) {
  registerSW()
}

export default App;