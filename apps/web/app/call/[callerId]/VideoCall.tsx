"use client";
import Video from "@/components/Video";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "@/store/store";
import React, { useEffect, useRef } from "react";
import { WebRTCService } from "@/service/webrtcService";
interface VideoCallPageProps {
  callerId: string;
}

const VideoCallPage = ({ callerId }: VideoCallPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  // const router = useRouter();
  const localStream = useSelector(
    (state: RootState) => state.webRtc.localStream,
  );
  const remoteStream = useSelector(
    (state: RootState) => state.webRtc.remoteStream,
  );

  const webRtc = new WebRTCService({
    dispatch,
    getState: () => ({ webRtc: store.getState().webRtc }),
  });
  const { startCall, endCall } = webRtc;

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const initializeCall = async () => {
    try {
      const peerConnection = await startCall(callerId);
      peerConnectionRef.current = peerConnection;
    } catch (error) {
      console.log("Failed to initialize call", error);

      // router.push("/");
    }
  };
  useEffect(() => {
    initializeCall();
    return () => {
      endCall();
    };
  }, []);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const stopCall = () => {
    endCall();
    // router.push("/");
  };

  return (
    <div>
      <div className="h-screen">
        <Video
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          stopCall={stopCall}
        />
      </div>
    </div>
  );
};

export default VideoCallPage;
