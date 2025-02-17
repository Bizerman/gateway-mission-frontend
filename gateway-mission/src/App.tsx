import {registerSW} from "virtual:pwa-register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "../Routes";
import HomePage from "./pages/HomePage/HomePage.tsx";
import Navigation from "./components/Navigation.tsx";
import GatewayElementsPage from "./pages/GatewayElementsPage/GatewayElementsPage.tsx";
import ElementPage from "./pages/ElementPage/ElementPage.tsx";
import {useEffect} from "react";
import {invoke} from "@tauri-apps/api/core";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import DraftMissionPage from "./pages/MissionPage/DraftMissionPage.tsx";
import MissionsUserPage from "./pages/MissionsUserPage/MissionsUserPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import ProfileUpdatePage from "./pages/ProfileUpdatePage/ProfileUpdatePage.tsx";
import {useSelector} from "react-redux";
import {RootState} from "./store/store.ts";
import MissionsModeratorPage from "./pages/MissionsModeratorPage/MissionsModeratorPage.tsx";
import ElementsEditingPage from "./pages/ElementsEditingPage/ElementsEditingPage.tsx";



function App() {
    const { role } = useSelector((state: RootState) => state.user);
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
          <Navigation />
              <Routes>
                  <Route path={ROUTES.HOME} index element={<HomePage />} />
                  <Route path={ROUTES.GATEWAY_ELEMENTS} element={<GatewayElementsPage />} />
                    {(role !== "admin" && role !== "moderator") && (
                      <>
                        <Route path={ROUTES.MISSIONS} element={<MissionsUserPage />} />
                      </>
                    )}
                    {(role === "admin" || role === "moderator") && (
                      <>
                        <Route path={ROUTES.ELEMENTS_EDITION} element={<ElementsEditingPage />} />
                        <Route path={ROUTES.MISSIONS} element={<MissionsModeratorPage />} />
                      </>
                    )}
                    <Route path={ROUTES.GATEWAY_ELEMENT_DETAIL} element={<ElementPage />} />
                    <Route path={ROUTES.MISSION} element={<DraftMissionPage />} />
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                    <Route path={ROUTES.PROFILE} element={<ProfileUpdatePage />} />
              </Routes>
    </BrowserRouter>
  );
}
if ("serviceWorker" in navigator) {
  registerSW()
}

export default App;