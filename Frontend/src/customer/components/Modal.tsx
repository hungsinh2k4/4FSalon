interface PopupProps {
  title: string;
  message: string;
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
}

const Modal = (props: PopupProps) => {
  if (!props.isOpen) return null;

  const handleAccept = () => {
    props.onAccept();
  };

  const handleReject = () => {
    props.onReject();
  };

  return (
    <div
      className={`absolute inset-0 bg-opacity-25 backdrop-blur-[1px] flex items-center justify-center`}
    >
      <div className="flex bg-white p-6 border border-solid rounded-xl justify-center gap-2 shadow-lg">
        <div className="p-2 bg-red-100 h-fit w-fit rounded-full items-center justify-center">
          <svg
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            className="text-red-400"
          >
            <path d="M13 17.5a1 1 0 11-2 0 1 1 0 012 0zm-.25-8.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z" />
            <path
              fillRule="evenodd"
              d="M9.836 3.244c.963-1.665 3.365-1.665 4.328 0l8.967 15.504c.963 1.667-.24 3.752-2.165 3.752H3.034c-1.926 0-3.128-2.085-2.165-3.752L9.836 3.244zm3.03.751a1 1 0 00-1.732 0L2.168 19.499A1 1 0 003.034 21h17.932a1 1 0 00.866-1.5L12.866 3.994z"
            />
          </svg>
        </div>
        <div>
          <h4 className="text-2xl font-semibold text-gray-800">
            {props.title}
          </h4>
          <p className="text-gray-600">{props.message}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleReject}
              className="px-2 py-1 bg-white-500 text-black border border-solid border-b-zinc-700 rounded-md mr-4 w-fit"
            >
              Hủy
            </button>
            <button
              onClick={handleAccept}
              className="px-2 py-1 bg-red-500 text-white rounded-md w-fit"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
