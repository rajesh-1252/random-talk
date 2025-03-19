"use client";

import {
  callEnded,
  callStarted,
  incomingCallAccepted,
  setLocalStream,
  setRemoteStream,
} from "@/store/features/call/callSlice";
import { AppDispatch, RootState, store } from "@/store/store";

class WebRTCService {
  private static instance: WebRTCService;
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private store: {
    dispatch: AppDispatch;
    getState: () => Pick<RootState, "webRtc">;
  };

  private constructor(store: {
    dispatch: AppDispatch;
    getState: () => Pick<RootState, "webRtc">;
  }) {
    this.store = store;

    // Bind methods to ensure correct 'this' context
    this.startCall = this.startCall.bind(this);
    this.endCall = this.endCall.bind(this);
    this.acceptCall = this.acceptCall.bind(this);
  }

  public static getInstance(store: {
    dispatch: AppDispatch;
    getState: () => Pick<RootState, "webRtc">;
  }): WebRTCService {
    if (!WebRTCService.instance) {
      WebRTCService.instance = new WebRTCService(store);
    }
    return WebRTCService.instance;
  }

  async enableMedia(type: "video" | "audio"): Promise<void> {
    try {
      if (!this.localStream) {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: type === "video",
          audio: type === "audio",
        });
      }

      if (this.peerConnection) {
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection!.addTrack(track, this.localStream!);
        });
      }
    } catch (error) {
      console.error(`Error enabling ${type}:`, error);
    }
  }

  private async getLocalVideoStream() {
    const { dispatch } = this.store;
    if (!this.peerConnection) return null;

    try {
      // const screenStream = await navigator.mediaDevices.getDisplayMedia({
      //   video: true,
      // });
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mixedStream = new MediaStream([
        ...audioStream.getAudioTracks(),
        // ...screenStream.getVideoTracks(),
      ]);

      dispatch(setLocalStream(mixedStream));

      mixedStream.getTracks().forEach((track) => {
        this.peerConnection!.addTrack(track, mixedStream);
      });

      this.peerConnection.ontrack = (event: RTCTrackEvent) => {
        if (event.streams.length > 0) {
          dispatch(setRemoteStream(event.streams[0] ?? null));
        }
      };
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }

  private async setupPeerConnection(userId: string) {
    if (this.peerConnection) {
      console.warn("Peer connection already exists, skipping setup.");
      return;
    }
    const { dispatch } = this.store;
    try {
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:relay.metered.ca:80",
            username: "open",
            credential: "open",
          },
        ],
      });

      const peer = this.peerConnection;

      peer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
          if (!peer.remoteDescription) {
            console.log("Waiting for remote description before sending ICE...");
            return;
          }
          dispatch({
            type: "websocket/send",
            payload: {
              type: "ice-candidate",
              candidate: event.candidate,
              to: userId,
            },
          });
        }
      };

      peer.ontrack = (event) => {
        if (event.streams.length > 0) {
          dispatch(setRemoteStream(event.streams[0] ?? null));
        }
      };
    } catch (error) {
      console.error("Error setting up peer connection:", error);
    }
  }

  private async createOffer(userId: string) {
    if (!this.peerConnection) return null;
    const { dispatch } = this.store;
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    dispatch({
      type: "websocket/send",
      payload: {
        type: "call-user",
        offer: offer,
        to: userId,
      },
    });
  }

  private async createAnswer(userId: string) {
    if (!this.peerConnection) return null;
    const { dispatch } = this.store;
    try {
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      dispatch({
        type: "websocket/send",
        payload: {
          type: "answer-call",
          answer: answer,
          to: userId,
        },
      });
    } catch (error) {
      console.error("Error creating answer:", error);
    }
  }

  async startCall(userId: string): Promise<RTCPeerConnection | null> {
    const { dispatch } = this.store;
    try {
      await this.setupPeerConnection(userId);
      if (!this.peerConnection) {
        console.log("peer connection failed");
        return null;
      }
      await this.getLocalVideoStream();
      await this.createOffer(userId);
      dispatch(
        callStarted({
          currentCallId: userId,
          peerConnection: this.peerConnection,
        }),
      );
      return this.peerConnection;
    } catch (error) {
      console.error("Error starting call:", error);
    }
    return null;
  }

  async acceptCall(
    offer: RTCSessionDescriptionInit,
    userId: string,
  ): Promise<void> {
    const { dispatch } = this.store;
    try {
      await this.setupPeerConnection(userId);
      if (!this.peerConnection) {
        console.log("peer connection failed");
        return;
      }
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      dispatch(
        incomingCallAccepted({
          currentCallId: userId,
          peerConnection: this.peerConnection,
        }),
      );
      await this.getLocalVideoStream();
      await this.createAnswer(userId);
    } catch (error) {
      console.error("Error accepting call:", error);
    }
  }

  endCall(): void {
    const { dispatch, getState } = this.store;
    const { webRtc } = getState();
    const { localStream, remoteStream, currentCallId } = webRtc;

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }

    dispatch(callEnded());
    dispatch({
      type: "websocket/send",
      payload: {
        type: "end-call",
        to: currentCallId,
      },
    });
  }
}

// Usage
const webRTCService = WebRTCService.getInstance({
  dispatch: store.dispatch,
  getState: store.getState,
});

export default webRTCService;
