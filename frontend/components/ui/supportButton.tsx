"use client";

import React from "react";
import { HelpCircleIcon } from "lucide-react";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};

const SupportButton = (props: ButtonProps) => {
  return (
    <button
      className="hover:text-gray-400 text-gray-600 text-sm py-2 px-4 rounded-full flex gap-2 w-full justify-center items-center"
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
    >
      <HelpCircleIcon strokeWidth={1.25} className="h-4 w-4" />
      {props.children}
    </button>
  );
};

export default SupportButton;
