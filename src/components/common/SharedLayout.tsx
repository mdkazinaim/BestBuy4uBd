import { Outlet } from "react-router-dom";
import TrackingManager from "./TrackingManager";
import { ThemeSwitcher } from "../ThemeSwitcher";

const SharedLayout = () => {
  return (
    <>
      <TrackingManager />
      <ThemeSwitcher />
      <Outlet />
    </>
  );
};

export default SharedLayout;
