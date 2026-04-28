import { BannerGrid } from "./Components/Banner";
import FeaturedCategories from "./Components/Categories/FeaturedCategories";
// import DealsSection from "./Components/Deals/DealsSection";
import NewArrival from "./Components/NewArrival/NewArrival";

import RecommendedSection from "./Components/Recommended/RecommendedSection";
import PromotionalSection from "./Components/Promotional/PromotionalSection";

const Home = () => {
  return (
    <>
      {/* Banner Section */}
      <BannerGrid />
      <>
        <div className="pb-12">
          {/* Shop by Category */}
          <FeaturedCategories />

          {/* New Arrival Section */}
          <NewArrival />

          {/* Recommended Section */}
          <RecommendedSection />

          {/* Promotional Section */}
          <PromotionalSection />

          {/* Today's Hot Deals */}
          {/* <DealsSection /> */}
        </div>
      </>
    </>
  );
};

export default Home;
