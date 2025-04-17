// import { animationDefaultOptions } from "../../../../lib/utils";
import Lottie from "react-lottie";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 text-white md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-100 transition-all">
      {/* Fix this lottie animation later */}
      {/* <Lottie
      isClickToPauseDisabled = {true}
      height = {200}
      width = {200}
      options = {animationDefaultOptions}
      /> */}
      <img src="/message.png" alt="meesage icon" height={200} width={200} />
      <div className="flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className="poppins-medium">
          Hi<span className="text-blue-500">! </span>
          Welcome to
          <span className="text-blue-500"> ChatU </span>
          App
          <span className="text-blue-500">.</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
