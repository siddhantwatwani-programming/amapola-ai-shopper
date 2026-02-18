import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/store/cartStore";
import { StoreProvider } from "@/store/storeContext";
import { CustomerProvider } from "@/store/customerContext";
import { ModeProvider } from "@/store/modeContext";
import { PickupProvider } from "@/store/pickupContext";
import { OrderHistoryProvider } from "@/store/orderHistoryContext";
import { FavoritesProvider } from "@/store/favoritesStore";
import { AccessibilityProvider } from "@/store/accessibilityContext";
import { LanguageProvider } from "@/store/languageContext";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";
import Browse from "./pages/Browse";
import ProductDetail from "./pages/ProductDetail";
import AiAssistant from "./pages/AiAssistant";
import Cart from "./pages/Cart";
import Confirmation from "./pages/Confirmation";
import OrderStatus from "./pages/OrderStatus";
import BottomNav from "./components/BottomNav";
import IdleOverlay from "./components/IdleOverlay";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
      <ModeProvider>
        <StoreProvider>
          <CustomerProvider>
            <PickupProvider>
              <OrderHistoryProvider>
                <FavoritesProvider>
                  <AccessibilityProvider>
                    <CartProvider>
                      <Toaster />
                      <Sonner />
                      <BrowserRouter>
                        <div className="mx-auto min-h-screen bg-background max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-5xl">
                          <Routes>
                            <Route path="/" element={<Splash />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/welcome" element={<Welcome />} />
                            <Route path="/browse" element={<Browse />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/assistant" element={<AiAssistant />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/confirmation" element={<Confirmation />} />
                            <Route path="/order-status" element={<OrderStatus />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                          <BottomNav />
                          <IdleOverlay />
                        </div>
                      </BrowserRouter>
                    </CartProvider>
                  </AccessibilityProvider>
                </FavoritesProvider>
              </OrderHistoryProvider>
            </PickupProvider>
          </CustomerProvider>
        </StoreProvider>
      </ModeProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
