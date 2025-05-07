import Image from "next/image";

type InputProps = {
  placeholder?: string;
  type?: "password" | "email" | "text";
  image?: string;
  alt?: string;
  width?: number;
  height?: number;
};
const Input = (props: InputProps) => {
  return (
    <input
      className="bg-gray-700 text-white p-2 rounded focus:ring-0 focus:outline-none"
      type={props.type}
      placeholder={props.placeholder}
    >
      {props.image && props.alt && (
        <Image
          src={props.image}
          alt={props.alt}
          width={props.width || 20}
          height={props.height || 20}
        />
      )}
    </input>
  );
};

export default Input;
