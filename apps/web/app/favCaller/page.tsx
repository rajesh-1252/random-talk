"use client";
import { useEffect, useRef, useState } from "react";
import { User } from "../../types/user";
import { getUserContacts } from "../../api/userService";
import { PhoneCall } from "lucide-react";

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
const Contacts = () => {
  const [contacts, setContacts] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<Record<string, string>>({});
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getUserContacts();
        setContacts(data);
      } catch {
        console.error("Failed to fetch contacts.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No token found");
      return;
    }
    let socket: WebSocket;
    const connectWebSocket = () => {
      socket = new WebSocket(`ws://localhost:8003?token=${token}`);

      socket.onopen = () => {
        console.log("connected to web socket");
      };

      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log("Recieved web socket message", data);
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
            const { answer, from } = data;
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
              console.log(
                "Remote description not set yet. Queuing candidate...",
              );
              return;
            }
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
            console.log("ICE candidate added successfully");
            break;
          }
          default:
            console.log(" no socket type found ", data.type);
        }
      };
      ws.current = socket;
      console.log({ socket });
    };
    connectWebSocket();
    return () => socket.close();
  }, []);

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
    to: string,
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
    ws.current?.send(
      JSON.stringify({
        type: "call-user",
        from: userDetails.userId,
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
        from: userDetails.userId,
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
            from: userDetails.userId,
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

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <h2>Contacts</h2>
      <ul>
        {contacts.map((user) => (
          <li className="flex gap-2" key={user._id}>
            <p>{user.name}</p>
            <p>({user.email})</p>
            <p>
              <button onClick={() => callFav(user._id)}>
                <PhoneCall />
              </button>
            </p>
          </li>
        ))}
      </ul>
      <video
        ref={localVideoRef}
        autoPlay
        muted
        style={{ width: "200px", height: "200px" }}
      ></video>

      <video ref={remoteVideoRef} autoPlay style={{ width: "100%" }}></video>
      <button onClick={stopCall}>Stop Call</button>
    </div>
  );
};

export default Contacts;
