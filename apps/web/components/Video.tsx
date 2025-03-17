"use client";
import React from "react";
import {
  PhoneOff,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
} from "lucide-react";

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
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoOff, setIsVideoOff] = React.useState(false);

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white  shadow-2xl w-full  mx-auto h-screen">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Video Call
        </h2>
        <div className="bg-gray-800 px-3 py-1 rounded-full text-xs font-medium text-gray-300 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Live
        </div>
      </div>

      <div className="relative w-full rounded-xl overflow-hidden bg-gray-800 mb-6 aspect-video">
        {/* Remote Video - Main Display */}
        <video
          ref={remoteVideoRef}
          autoPlay
          className={`w-full h-full object-cover ${isVideoOff ? "opacity-50" : ""}`}
        ></video>

        {/* Local Video - Picture in Picture */}
        <div className="absolute right-4 top-4 w-1/4 aspect-video rounded-lg overflow-hidden border-2 border-white shadow-lg z-10">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          ></video>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 px-2 py-1 text-xs font-medium">
            You
          </div>
        </div>

        {/* Remote User Label */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-3 py-2 rounded-lg text-sm font-medium flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          Remote User
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 py-4">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full ${isMuted ? "bg-red-500 hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600"} transition-all shadow-lg`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        <button
          onClick={stopCall}
          className="p-5 rounded-full bg-red-600 hover:bg-red-700 transition-all shadow-lg"
        >
          <PhoneOff size={28} />
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${isVideoOff ? "bg-red-500 hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600"} transition-all shadow-lg`}
        >
          {isVideoOff ? <VideoOff size={24} /> : <VideoIcon size={24} />}
        </button>
      </div>

      <div className="w-full pt-4 border-t border-gray-700 mt-2">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <div>Call duration: 00:12:45</div>
          <div>Signal strength: Excellent</div>
        </div>
      </div>
    </div>
  );
};

export default Video;
