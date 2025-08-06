import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [favoriteAds, setFavoriteAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.get("http://localhost:8000/api/favorites/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFavoriteAds(res.data);
      })
      .catch(() => {
        setFavoriteAds([]);
      })
      .finally(() => setLoading(false));
    } else {
      setFavoriteAds([]);
      setLoading(false);
    }
  }, [token]);

  return (
    <FavoritesContext.Provider value={{ favoriteAds, loading, setFavoriteAds }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
