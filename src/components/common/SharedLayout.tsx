import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TrackingManager from "./TrackingManager";

const SharedLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <TrackingManager />
      <Outlet />
    </>
  );
};

export default SharedLayout;
