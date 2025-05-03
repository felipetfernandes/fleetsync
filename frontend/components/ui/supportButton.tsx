import React from "react";
import Image from "next/image";


const supportImage = "/images/supportImage.svg";

type ButtonProps = {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};
const SupportButton = (props: ButtonProps) => {
  return (
    <button
      className="hover:text-gray-400 text-gray-900 text-sm py-2 px-4 rounded-full flex gap-2 w-full justify-center"
      type='button'
      >
      <Image src={supportImage} alt="support" width={20} height={20}/>
      {props.children}
    </button>
  );
};

export default SupportButton;