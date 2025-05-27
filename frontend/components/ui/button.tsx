"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};
const Button = (props: ButtonProps) => {
  return (
    <button
      className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full ${props.className}`}
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
    >
      {props.children}
    </button>
  );
};

export default Button;
