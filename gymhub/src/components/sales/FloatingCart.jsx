import React from "react";
import { ShoppingCart } from "lucide-react";
import "../../css/FloatingCart.css";

const FloatingCart = ({ contador, onClick }) => {
  return (
    <div className="floating-cart" onClick={onClick}>
      <ShoppingCart size={32} />
      {contador > 0 && (
        <div className="cart-counter">
          {contador}
        </div>
      )}
    </div>
  );
};

export default FloatingCart;
