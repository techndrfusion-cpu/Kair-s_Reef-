import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Função para extrair o valor numérico de strings como "R$ 389,90" ou "Consultar"
export const parsePrice = (priceStr) => {
  if (!priceStr || typeof priceStr !== 'string') return 0;
  if (priceStr.toLowerCase().includes('consultar')) return 0;
  
  // Limpar a string
  const cleanStr = priceStr
    .replace('R$', '')
    .replace(/\s/g, '')
    .replace(/\./g, '')  // Remove pontos de milhar
    .replace(',', '.');  // Troca vírgula decimal por ponto

  const value = parseFloat(cleanStr);
  return isNaN(value) ? 0 : value;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('kairos_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('kairos_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + amount;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice = cartItems.reduce((acc, item) => {
    // Suporte para novo formato (price_cash numérico) e antigo (price string)
    const unitPrice = item.product.price_cash || parsePrice(item.product.price);
    return acc + (unitPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
