import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Index";
import Services from "./pages/RepairServices";
import MarketPlace from "./pages/Store";
import Layout from "./pages/Layout";
import Social from "./pages/Social";
import BuildPC from "./pages/BuildPC";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import AdminApproval from "./pages/AdminApproval";
import Checkout from "./pages/Checkout";
import Friends from "./pages/Friends";
import Gaming from "./pages/Gaming";
import Groups from "./pages/Groups";
import LiveStream from "./pages/LiveStream";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Pages from "./pages/Pages";
import PayTogether from "./pages/PayTogether";
import Profile from "./pages/Profile";
import Saved from "./pages/Saved";
import SellerDashboard from "./pages/SellerDashboard";
import Watch from "./pages/Watch";
import WatchVideo from "./pages/WatchVideo";
import { CartProvider } from "@/components/CartProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/repair",
        element: <Services />,
      },
      {
        path: "/marketplace",
        element: <MarketPlace />,
      },
      {
        path: "/store",
        element: <MarketPlace />,
      },
      {
        path: "/social",
        element: <Social />,
      },
      {
        path: "/build-pc",
        element: <BuildPC />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/admin/approval",
        element: <AdminApproval />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/friends",
        element: <Friends />,
      },
      {
        path: "/gaming",
        element: <Gaming />,
      },
      {
        path: "/groups",
        element: <Groups />,
      },
      {
        path: "/livestream",
        element: <LiveStream />,
      },
      {
        path: "/messages",
        element: <Messages />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/pages",
        element: <Pages />,
      },
      {
        path: "/pay-together",
        element: <PayTogether />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/saved",
        element: <Saved />,
      },
      {
        path: "/seller/dashboard",
        element: <SellerDashboard />,
      },
      {
        path: "/watch",
        element: <Watch />,
      },
      {
        path: "/watch/:id",
        element: <WatchVideo />,
      },
    ],
  },
]);

const App = () => (
  <AuthProvider>
    <CartProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </CartProvider>
  </AuthProvider>
);

export default App;
