import Layout from "./Layout/PublicLayout/Layout";
import { useEffect } from "react";
import { useGetHost } from "./utils/useGetHost";

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
      <Layout />
    </>
  );
}

export default App;
