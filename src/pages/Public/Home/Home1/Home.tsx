import { BannerGrid } from "./Components/Banner";
import FeaturedCategories from "./Components/Categories/FeaturedCategories";
// import DealsSection from "./Components/Deals/DealsSection";
import NewArrival from "./Components/NewArrival/NewArrival";

import RecommendedSection from "./Components/Recommended/RecommendedSection";
import PromotionalSection from "./Components/Promotional/PromotionalSection";
import StatsBanner from "./Components/StatsBanner";

const Home = () => {
  return (
    <>
      {/* Banner Section */}
      <BannerGrid />
      <>
        <div className="pb-6 sm:pb-12 flex flex-col gap-10 sm:gap-20">
          {/* Shop by Category */}
          <FeaturedCategories />

          {/* New Arrival Section */}
          <NewArrival />

          {/* Recommended Section */}
          <RecommendedSection />

          {/* Promotional Section */}
          <PromotionalSection />

          {/* Stats Banner */}
          <div className="container mx-auto px-4">
            <StatsBanner />
          </div>

          {/* Today's Hot Deals */}
          {/* <DealsSection /> */}
        </div>
      </>
    </>
  );
};

export default Home;
