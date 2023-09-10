import { Player } from "@lottiefiles/react-lottie-player";
import LoadingAnimation from "../assets/json/Loading.json";

function Loading() {
  return (
    <div>
      <Player
        autoplay={true}
        loop={true}
        controls={true}
        src={LoadingAnimation}
        style={{ height: "300px", width: "300px" }}
      ></Player>
      <h1 className="text-sm text-green-500 text-center">
        Your password is getting generated!
      </h1>
    </div>
  );
}

export default Loading;
