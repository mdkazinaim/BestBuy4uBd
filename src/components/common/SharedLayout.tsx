import { Outlet } from "react-router-dom";
import TrackingManager from "./TrackingManager";

const SharedLayout = () => {
  return (
    <>
      <TrackingManager />
      <Outlet />
    </>
  );
};

export default SharedLayout;
