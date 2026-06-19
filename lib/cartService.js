import axiosInstance from "@/lib/axios";

export const loadCart = async (isAuthenticated) => {
  if (isAuthenticated) {
    const { data } = await axiosInstance.get("/cart");

    return data;
  }

  const cart = JSON.parse(localStorage.getItem("cart") || '{"items":[]}');

  const { data } = await axiosInstance.post("/cart/guest/details", {
    items: cart.items,
  });

  return data;
};

export const addItemToGuestCart = (item) => {
  const cart = JSON.parse(localStorage.getItem("cart") || '{"items":[]}');

  const existingItem = cart.items.find(
    (cartItem) =>
      cartItem.productId === item.productId &&
      String(cartItem.variantId) === String(item.variantId) &&
      JSON.stringify(cartItem.customization || {}) ===
        JSON.stringify(item.customization || {}),
  );

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.items.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeGuestCartItem = (cartItemId) => {
  const cart = JSON.parse(localStorage.getItem("cart") || '{"items":[]}');

  cart.items = cart.items.filter((item) => item.cartItemId !== cartItemId);

  localStorage.setItem("cart", JSON.stringify(cart));
};

export const updateGuestCartQuantity = (cartItemId, quantity) => {
  const cart = JSON.parse(localStorage.getItem("cart") || '{"items":[]}');

  const item = cart.items.find((item) => item.cartItemId === cartItemId);

  if (item) {
    item.quantity = quantity;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearGuestCart = () => {
  localStorage.removeItem("cart");
};
