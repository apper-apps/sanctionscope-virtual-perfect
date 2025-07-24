import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  variant = "default",
  children, 
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-lg transition-all duration-200";
  
  const variants = {
    default: "shadow-sm border border-gray-200 hover:shadow-md",
    elevated: "shadow-md hover:shadow-lg",
    outline: "border border-gray-200",
    ghost: "hover:bg-gray-50"
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;