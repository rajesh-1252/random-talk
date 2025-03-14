"use client";
import { useState } from "react";
import { useWebRtc } from "../../hooks/useWebRtc";
import { useWebSocket } from "../../hooks/useWebSocket";
import Video from "../../components/Video";
import Contacts from "../../components/Contacts";

const Page = () => {
  const ws = useWebSocket("ws://localhost:8003", onMessage);

  const {
    handleIncomingCall,
    stopCall,
    callFav,
    localVideoRef,
    remoteVideoRef,
    peerConnectionRef,
  } = useWebRtc(ws);

  async function onMessage(data: any) {
    switch (data.type) {
      case "incoming-call": {
        // check if the person is speaking to someone else
        // console.log('line busy')
        // if not send the call
        const { offer, from, to } = data;
        handleIncomingCall(offer, from, to);
        break;
      }
      case "answer-received": {
        console.log("answer-user called", data);
        const { answer } = data;
        const peer = peerConnectionRef.current;
        if (!peer) {
          console.error("No peer connection found");
          return;
        }
        await peer.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("Remote answer set:", answer);
        break;
      }

      case "ice-candidate": {
        const { candidate } = data;
        const peer = peerConnectionRef.current;
        if (!peer || !peer.remoteDescription) {
          console.log("Remote description not set yet. Queuing candidate...");
          return;
        }
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("ICE candidate added successfully");
        break;
      }
      default:
        console.log(" no socket type found ", data.type);
    }
  }

  return (
    <div>
      <Contacts callFav={callFav} />
      <Video
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        stopCall={stopCall}
      />
    </div>
  );
};

export default Page;
