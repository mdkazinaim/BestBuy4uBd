import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "@/store/Api/ProductApi";
import Template1LandingPage from "./Template1/LandingPage";
import Template2LandingPage from "./Template2/LandingPage/LandingPage";
import Template3LandingPage from "./Template3/LandingPage/LandingPage";
import Template4LandingPage from "./Template4/LandingPage/LandingPage";
import { useTracking } from "@/hooks/useTracking";
import { useEffect } from "react";

const LandingPageContainer = () => {
  const { id } = useParams<{ id: string }>();
  const { trackViewItem } = useTracking();
  
  const {
    data: response,
    isLoading,
    error,
  } = useGetProductByIdQuery(
    { id: id as string },
    {
      skip: !id,
    }
  );

  const product = response?.data;
  const template = product?.additionalInfo?.landingPageTemplate || "template1";

  useEffect(() => {
    if (product) {
      trackViewItem({
        id: product._id,
        name: product.basicInfo.title,
        price: product.price.discounted || product.price.regular,
        category: product.basicInfo.category,
      });
    }
  }, [product, trackViewItem]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-red-100 p-6 rounded-lg">
          <p className="text-red-600 text-lg">
            Error loading product: {(error as any)?.message || "Product not found"}
          </p>
        </div>
      </div>
    );
  }

  const renderTemplate = () => {
    switch (template.toLowerCase()) {
      case "template4":
        return <Template4LandingPage product={product} />;
      case "template3":
        return <Template3LandingPage product={product} />;
      case "template2":
        return <Template2LandingPage product={product} />;
      case "template1":
      default:
        return <Template1LandingPage product={product} />;
    }
  };

  return (
    <>
      {renderTemplate()}
    </>
  );
};

export default LandingPageContainer;
