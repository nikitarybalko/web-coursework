"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchRestaurantByOwnerEmail } from "@/lib/utils";
import { Restaurant } from "@/types/Restaurant";

interface RestaurantContextType {
  restaurant: Restaurant | null;
  isLoading: boolean;
}

const RestaurantContext = createContext<RestaurantContextType>({
  restaurant: null,
  isLoading: true,
});

export const RestaurantProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (session?.idToken) {
        try {
          const response = await fetchRestaurantByOwnerEmail(session.idToken);
          setRestaurant(response);
        } catch (error) {
          console.error("Помилка завантаження ресторану", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRestaurant();
  }, [session?.idToken]);

  return (
    <RestaurantContext.Provider value={{ restaurant, isLoading }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => useContext(RestaurantContext);
