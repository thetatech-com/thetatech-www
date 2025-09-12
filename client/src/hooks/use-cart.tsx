import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Generate a session ID for the cart
const getSessionId = () => {
  let sessionId = localStorage.getItem('cart-session-id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('cart-session-id', sessionId);
  }
  return sessionId;
};

export function useCart() {
  const [sessionId] = useState(getSessionId);
  const queryClient = useQueryClient();

  const { data: cartItems = [] } = useQuery({
    queryKey: ['/api/cart', sessionId],
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      return apiRequest("POST", "/api/cart", {
        sessionId,
        productId,
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/cart/clear/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
  });

  const addToCart = async (productId: string, quantity: number = 1) => {
    return addToCartMutation.mutateAsync({ productId, quantity });
  };

  const clearCart = async () => {
    return clearCartMutation.mutateAsync();
  };

  const cartItemCount = (cartItems as any[]).reduce((total: number, item: any) => total + item.quantity, 0);

  return {
    sessionId,
    cartItems,
    cartItemCount,
    addToCart,
    clearCart,
    isAddingToCart: addToCartMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
  };
}
