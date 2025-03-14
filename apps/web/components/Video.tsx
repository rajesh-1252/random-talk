import React from "react";

interface VideoProps {
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  stopCall: () => void;
}

const Video: React.FC<VideoProps> = ({
  localVideoRef,
  remoteVideoRef,
  stopCall,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Video Call</h2>

      <div className="flex flex-col items-center gap-3 w-full">
        {/* Local Video */}
        <div className="relative w-40 h-40 border-2 border-gray-400 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          ></video>
          <span className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-xs px-2 py-1 rounded">
            You
          </span>
        </div>

        {/* Remote Video */}
        <div className="relative w-full h-64 border-2 border-gray-400 rounded-lg overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-full object-cover"
          ></video>
          <span className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-xs px-2 py-1 rounded">
            Remote
          </span>
        </div>
      </div>

      {/* Stop Call Button */}
      <button
        onClick={stopCall}
        className="mt-4 px-5 py-2 bg-red-600 hover:bg-red-700 transition-all text-white font-medium rounded-lg shadow-md"
      >
        End Call
      </button>
    </div>
  );
};

export default Video;
