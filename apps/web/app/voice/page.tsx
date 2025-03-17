"use client";
import React, { useEffect, useRef, useState } from "react";

const config = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }, // STUN
    {
      urls: "turn:relay1.expressturn.com:3478",
      username: "efxtoken",
      credential: "efxtoken",
    }, // TURN (fallback)
  ],
};

const Page = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [matched, setMatched] = useState(true);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const findCaller = () => { };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found");
      return;
    }
    const socket = new WebSocket(`ws://localhost:8003?token${token}`); // Connect to signaling server

    socket.onopen = () => console.log("connected to web socket");

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("Recieved web socket message", data);
      switch (data.type) {
        case "find_peer":
      }
    };
    setWs(socket);
    return () => socket.close();
  }, []);

  const getLocalVideoStream = async (peer: RTCPeerConnection) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        console.log("hello");
        localVideoRef.current.srcObject = stream;
      }
      stream.getTracks().forEach((track) => {
        console.log("adding local track", track);
        peer.addTrack(track, stream);
      });
    } catch (error) {
      console.log("error in getting local video", error);
    }
  };

  const setupPeerConnection = async () => {
    const peer = new RTCPeerConnection(config);
    peerConnectionRef.current = peer;
    getLocalVideoStream(peer);
    createOffer(peer);
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("sending ice candidate", event.candidate);
      }
    };
  };

  const createOffer = async (peer: RTCPeerConnection) => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    sendOfferToSignalingServer(offer);
    console.log("offer created", offer);
  };

  const sendOfferToSignalingServer = (offer: RTCSessionDescriptionInit) => {
    ws?.send(JSON.stringify({ type: "offer", offer }));
  };

  const sendAnswerToCaller = (answer: RTCSessionDescriptionInit) => { };

  const acceptOffer = async (offer: RTCSessionDescriptionInit) => {
    const peer = peerConnectionRef.current!;
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    console.log(answer);
    sendAnswerToCaller(answer);
  };

  useEffect(() => {
    setupPeerConnection();
  }, []);

  return (
    <div>
      {matched ? (
        <div>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            style={{ width: "100%" }}
          ></video>
          <video ref={remoteVideoRef} autoPlay></video>
        </div>
      ) : (
        <div>
          <button onClick={findCaller}>find random person</button>
        </div>
      )}
    </div>
  );
};

export default Page;
