import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const errorStyles = error 
    ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500" 
    : "border-gray-300 focus:border-primary-500 focus:ring-primary-500";
  
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        baseStyles,
        errorStyles,
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;