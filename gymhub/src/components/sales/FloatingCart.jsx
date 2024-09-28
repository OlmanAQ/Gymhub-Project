import React from "react";
import { ShoppingCart } from "lucide-react";
import "../../css/FloatingCart.css";

const FloatingCart = () => {
  return (
    <div className="floating-cart">
      <ShoppingCart size={32} />
    </div>
  );
};

export default FloatingCart;
