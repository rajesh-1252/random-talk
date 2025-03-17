import { RefObject, useRef } from "react";

const config = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:relay.metered.ca:80",
      username: "open",
      credential: "open",
    },
  ],
};
export const useWebRtc = (ws: RefObject<WebSocket | null>) => {
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const getLocalVideoStream = async (peer: RTCPeerConnection) => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mixedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);
      localStreamRef.current = mixedStream;
      if (localVideoRef.current) {
        console.log("hello");
        localVideoRef.current.srcObject = mixedStream;
      }
      mixedStream.getTracks().forEach((track) => {
        console.log("adding local track", track);
        peer.addTrack(track, mixedStream);
      });
    } catch (error) {
      console.log("error in getting local video", error);
    }
  };

  const handleIncomingCall = async (
    offer: RTCSessionDescriptionInit,
    from: string,
  ) => {
    await setupPeerConnection(from);
    const peer = peerConnectionRef.current;
    if (!peer) {
      console.log("no peer connection in handle incoming call");
      return;
    }

    try {
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
    } catch (error) {
      console.log("error in setting remote description", error);
    }
    await getLocalVideoStream(peer);
    await createAnswer(peer, from);
  };

  const sendOfferToSignalingServer = (
    offer: RTCSessionDescriptionInit,
    userId: string,
  ) => {
    ws?.current?.send(
      JSON.stringify({
        type: "call-user",
        to: userId,
        offer,
      }),
    );
    console.log("call-user sent", ws);
  };

  const sendAnswerToSignalingServer = (
    answer: RTCSessionDescriptionInit,
    user: string,
  ) => {
    ws.current?.send(
      JSON.stringify({
        type: "answer-user",
        to: user,
        answer,
      }),
    );
    console.log("answer-user sent", ws);
  };

  const setupPeerConnection = async (userId: string) => {
    const peer = new RTCPeerConnection(config);
    peerConnectionRef.current = peer;
    peer.onicecandidate = (event) => {
      console.log("ice candidate called", event);
      if (event.candidate) {
        if (!peer.remoteDescription) {
          console.log("Waiting for remote description before sending ICE...");
          return;
        }
        console.log("sending ice candidate", event.candidate);
        ws.current?.send(
          JSON.stringify({
            type: "ice-candidate",
            to: userId,
            candidate: event.candidate,
          }),
        );
      }
    };

    peer.ontrack = (event) => {
      console.log("Received remote track:", event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0] || null;
      } else {
        console.warn("remoteVideoRef.current is null");
      }
    };
  };

  const createOffer = async (peer: RTCPeerConnection, userId: string) => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    sendOfferToSignalingServer(offer, userId);
    console.log("offer created", offer);
  };

  const createAnswer = async (peer: RTCPeerConnection, user: string) => {
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    sendAnswerToSignalingServer(answer, user);
    console.log("answer created", answer);
  };

  const callFav = async (userId: string) => {
    await setupPeerConnection(userId);
    const peer = peerConnectionRef.current;
    if (!peer) {
      console.log("no pear found");
      return;
    }
    await getLocalVideoStream(peer);
    await createOffer(peer, userId);
  };

  const stopCall = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    remoteVideoRef.current!.srcObject = null;
    localVideoRef.current!.srcObject = null;
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
  };

  return {
    handleIncomingCall,
    stopCall,
    callFav,
    localVideoRef,
    remoteVideoRef,
    peerConnectionRef,
  };
};
