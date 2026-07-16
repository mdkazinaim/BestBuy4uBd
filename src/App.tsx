import Layout from "./Layout/PublicLayout/Layout";
import { useEffect } from "react";
import { useGetHost } from "./utils/useGetHost";
import VisitorTracker from "./components/VisitorTracker/VisitorTracker";

function App() {
  const brand = useGetHost();
  useEffect(() => {
    document.title = brand.title;

    const favicon = document.querySelector(
      "link[rel='icon']",
    ) as HTMLLinkElement | null;

    if (favicon) {
      favicon.href = brand.logo;
    }
  }, [brand]);
  return (
    <>
      <VisitorTracker />
      <Layout />
    </>
  );
}

export default App;
