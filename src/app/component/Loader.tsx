import { LoaderCircle } from "lucide-react";

const Loading = ({size , width }:{size:number , width: number}) => {
  return <LoaderCircle size={size} strokeWidth={width} className={`animate-spin`}/>;
};

export default Loading;