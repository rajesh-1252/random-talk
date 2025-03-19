/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Video from "@/components/Video";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "@/store/store";
import React, { useEffect, useRef } from "react";
import webRTCService from "@/service/webrtcService";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { incomingCallAccepted } from "@/store/features/call/callSlice";
interface VideoCallPageProps {
  callerId: string;
}

const VideoCallPage = ({ callerId }: VideoCallPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  // const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new");
  const router = useRouter();

  const {
    localStream,
    remoteStream,
    callDisconnected,
    incomingCall,
    peerConnection,
  } = useSelector((state: RootState) => state.webRtc);

  const { endCall, acceptCall } = webRTCService;
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const fdsa = async () => {
    if (!incomingCall?.offer && !incomingCall?.from) return;
    await acceptCall(incomingCall.offer, incomingCall?.from);
    dispatch(incomingCallAccepted());
    await peerConnection?.setRemoteDescription(
      new RTCSessionDescription(incomingCall.offer),
    );
  };
  useEffect(() => {
    if (!isNew) {
      console.log("");
    } else {
      fdsa();
    }
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

  useEffect(() => {
    console.log({ callDisconnected });
    if (callDisconnected) {
      router.replace(`/call/ringing/${callerId}?disconnected=${true}`);
    }
  }, [callDisconnected]);

  const stopCall = () => {
    endCall();
    router.push("/");
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
