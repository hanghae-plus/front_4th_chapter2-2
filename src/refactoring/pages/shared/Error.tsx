interface ErrorProps {
  message: string;
}
function Error(props: ErrorProps) {
  const { message } = props;

  return <p className="text-red-500 text-sm">{message}</p>;
}

export default Error;
