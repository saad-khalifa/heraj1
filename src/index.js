import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.rtl.min.css";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import MenuContext from "./Context/MenuContext";
// المسار الصحيح لملف echo.js



const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MenuContext>
    <AuthProvider>
      <BrowserRouter>
        <FavoritesProvider>
          <QueryClientProvider client={queryClient}>
            
          <App />
          </QueryClientProvider>
        </FavoritesProvider>
      </BrowserRouter>
    </AuthProvider>
    </MenuContext>
  </React.StrictMode>
);
