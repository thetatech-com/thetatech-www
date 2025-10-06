import { ReactNode, useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/types';
import { CartContext } from '../contexts/CartContext';

// CartProvider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, products(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const cartItems: CartItem[] = (data || []).map((item) => ({
        ...item,
        product: item.products,
      }));

      setItems(cartItems);
    } catch (error: unknown) {
      console.error('Error fetching cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cart items',
        variant: 'destructive',
      });
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    refreshCart();
  }, [user, refreshCart]);

  const addToCart = async (
    item: Omit<CartItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
  ) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add items to cart',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Check if item already exists
      const { data: existingItems, error: existingError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', item.product_id)
        .single();

      if (existingError && existingError.code !== 'PGRST116') { // Ignore 'No rows found' error
        throw existingError;
      }

      if (existingItems) {
        // Update quantity
        await updateQuantity(existingItems.id, existingItems.quantity + item.quantity);
      } else {
        // Insert new item
        const { error } = await supabase.from('cart_items').insert({
          ...item,
          user_id: user.id,
        });
        if (error) throw error;
      }

      await refreshCart();
      toast({
        title: 'Added to cart',
        description: 'Item has been added to your cart',
      });
    } catch (error: unknown) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add item to cart',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      await refreshCart();
      toast({
        title: 'Removed from cart',
        description: 'Item has been removed from your cart',
      });
    } catch (error: unknown) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove item from cart',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      await refreshCart();
    } catch (error: unknown) {
      console.error('Error updating quantity:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update quantity',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const clearCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setItems([]);
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart',
      });
    } catch (error: unknown) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to clear cart',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};