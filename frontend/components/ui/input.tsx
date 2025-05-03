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
      className="px-2 bg-gray-400 placeholder:text-gray-600 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm -mt-2"
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
