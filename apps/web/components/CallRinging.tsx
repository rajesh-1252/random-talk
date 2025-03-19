/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import webRTCService from "@/service/webrtcService";
import { useRouter, useSearchParams } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { changeCallDisconnected } from "@/store/features/call/callSlice";

interface CallRingingProps {
  callerId: string;
}

const CallRinging: React.FC<CallRingingProps> = ({ callerId }) => {
  const [ringingTime, setRingingTime] = useState(0);
  const { startCall } = webRTCService;

  const searchParams = useSearchParams();
  const disconnected = searchParams.get("disconnected") === "true";
  const { inCall, ringing, callStatus } = useSelector(
    (state: RootState) => state.webRtc,
  );
  const router = useRouter();

  useEffect(() => {
    if (!ringing) return;

    const interval = setInterval(() => {
      setRingingTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [ringing]);

  useEffect(() => {
    if (!ringing) return;

    const ringInterval = setInterval(() => {
      console.log("Ring ring!");
    }, 3000);

    return () => clearInterval(ringInterval);
  }, [ringing]);

  const initializeCall = async () => {
    try {
      await startCall(callerId);
    } catch (error) {
      console.log("Failed to initialize call", error);
    }
  };

  useEffect(() => {
    if (!disconnected) {
      initializeCall();
    }
  }, []);

  console.log({ inCall });
  useEffect(() => {
    if (inCall) {
      router.replace(`/call/onCall/${callerId}`);
    }
  }, [inCall]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const dispatch = useDispatch();

  const callAgain = async () => {
    dispatch(changeCallDisconnected(false));
    await initializeCall();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4">
          <h3 className="text-xl font-bold text-white text-center">
            {callStatus}
          </h3>
        </div>

        {/* Caller Info */}
        <div className="flex flex-col items-center justify-center p-8">
          <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-white">
              {"unKnown".charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{"unknown"}</h2>

          {/* Ringing Animation */}
          {ringing && (
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-blue-500 opacity-25 animate-ping"></div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-blue-500 opacity-75"></div>
              </div>
            </div>
          )}

          {/* Call Timer */}
          {!ringing && (
            <div className="text-xl text-white mb-6">
              {formatTime(ringingTime)}
            </div>
          )}

          {disconnected && (
            <button
              onClick={callAgain}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition"
            >
              Call Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallRinging;
