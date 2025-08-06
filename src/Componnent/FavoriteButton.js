// src/Componnent/FavoriteButton.js
import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "http://localhost:8000";

function FavoriteButton({ adId, isFavorited, onToggle }) {
  const { token } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const toggleFavorite = useMutation({
    mutationFn: async () => {
      await axios.post(`${BASE_URL}/api/favorites/toggle/${adId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites"]);
      if (onToggle) {
        onToggle(adId);
      }
    },
    onError: () => {
      alert("حدث خطأ أثناء تعديل المفضلة");
    },
  });

  const handleClick = () => {
    if (!token) {
      alert("يرجى تسجيل الدخول أولاً");
      return;
    }
    toggleFavorite.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className={`btn btn-sm ${isFavorited ? "btn-danger" : "btn-outline-danger"} ms-2`}
      disabled={toggleFavorite.isLoading}
    >
      {isFavorited ? "❤️ إزالة" : "🤍 مفضلة"}
    </button>
  );
}

export default FavoriteButton;
