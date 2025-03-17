import {
  callEnded,
  callStarted,
  setLocalStream,
  setRemoteStream,
} from "@/store/features/call/callSlice";
import { AppDispatch, RootState, store } from "@/store/store";

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private store: {
    dispatch: AppDispatch;
    getState: () => Pick<RootState, "webRtc">;
  };

  constructor(store: {
    dispatch: AppDispatch;
    getState: () => Pick<RootState, "webRtc">;
  }) {
    console.log("helelo inside constructor", store);
    this.store = store;
    this.startCall = this.startCall.bind(this);
    this.endCall = this.endCall.bind(this);
  }

  private async getLocalVideoStream() {
    const { dispatch } = this.store;
    if (!this.peerConnection) return null;
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    dispatch(setLocalStream(stream));

    stream.getTracks().forEach((track) => {
      this.peerConnection!.addTrack(track, stream);
    });

    this.peerConnection.ontrack = (event: RTCTrackEvent) => {
      console.log("ontrack");
      if (event.streams.length > 0) {
        console.log("ontrack setRemoteStream", event.streams[0]);
        dispatch(setRemoteStream(event.streams[0] ?? null));
      }
    };
  }
  private async setupPeerConnection(userId: string) {
    console.log("setupPeerConnection called");
    const { dispatch } = this.store;
    try {
      this.peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      const peer = this.peerConnection;
      peer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
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
        console.log("Received remote track:", event.streams[0]);
        if (event.streams.length > 0) {
          dispatch(setRemoteStream(event.streams[0] ?? null));
        }
      };
    } catch (error) {
      console.log("error in setting up peer", error);
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
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    dispatch({
      type: "websocket/send",
      payload: {
        type: "answer-call",
        answer: this.peerConnection.localDescription,
        to: userId,
      },
    });
  }

  async startCall(userId: string): Promise<RTCPeerConnection | null> {
    const { dispatch } = this.store;
    try {
      await this.setupPeerConnection(userId);
      await this.getLocalVideoStream();
      await this.createOffer(userId);

      dispatch(callStarted(userId));
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
    try {
      await this.setupPeerConnection(userId);
      if (!this.peerConnection) {
        console.log("no peer connection ");
        return;
      }
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      await this.getLocalVideoStream();
      await this.createAnswer(userId);
    } catch (error) {
      console.error("Error accepting call:", error);
    }
  }

  endCall(): void {
    // const { dispatch, getState } = this.store;
    // const { webRtc } = getState();
    // const { localStream, remoteStream } = webRtc;
    //
    // if (this.peerConnection) {
    //   this.peerConnection.close();
    //   this.peerConnection = null;
    // }
    //
    // if (localStream) {
    //   localStream.getTracks().forEach((track) => track.stop());
    // }
    //
    // if (remoteStream) {
    //   remoteStream.getTracks().forEach((track) => track.stop());
    // }
    //
    // dispatch(callEnded());
  }
}
