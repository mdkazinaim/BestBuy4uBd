import Contact from "../pages/Public/Contact/Contact";
// import Services from "@/pages/Public/Services/Services";
import Home from "@/pages/Public/Home/Home1/Home";
import Shop from "@/pages/Public/Shop/Shop";
import ProductDetails from "@/pages/Public/Shop/Components/ProductDetails/ProductDetails";
import Checkout from "@/pages/Public/Checkout/Checkout";
import OrderTrack from "@/pages/Public/OrderTracking/OrderTrack";
import Cart from "@/pages/Public/Cart/Cart";

export const publicRoutes = [
  {
    label: "Home",
    index: true,
    path: "/",
    element: <Home />,
  },
  {
    label: "Shop",
    path: "/shop",
    element: <Shop />,
    children: [],
  },
  {
    path: "/product/:id",
    element: <ProductDetails />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    label: "Contact",
    path: "/contact",
    element: <Contact />,
  },
  {
    // label: "Order Track",
    path: "/order-track",
    element: <OrderTrack />,
  },
  {
    label: "Cart",
    path: "/cart",
    element: <Cart />,
  },
  // {
  //   label: "Services",
  //   path: "/services",
  //   element: <Services />,
  // },
];
