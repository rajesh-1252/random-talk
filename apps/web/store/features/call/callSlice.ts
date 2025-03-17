import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CallState {
  inCall: boolean;
  incomingCall: {
    from: string;
    offer: RTCSessionDescriptionInit;
  } | null;
  ringing: boolean;
  currentCallId: string | null;
  peerConnection: RTCPeerConnection | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isVideoOff: boolean;
  caller: { name: string; avatar: string };
}

const initialState: CallState = {
  inCall: false,
  incomingCall: null,
  ringing: false,
  currentCallId: null,
  peerConnection: null,
  localStream: null,
  remoteStream: null,
  isMuted: false,
  isVideoOff: false,
  caller: { name: "", avatar: "" },
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    callStarted: (state, action: PayloadAction<string>) => {
      state.inCall = true;
      state.currentCallId = action.payload;
    },
    callEnded: (state) => {
      state.inCall = false;
      state.currentCallId = null;
      state.incomingCall = null;
      state.peerConnection = null;
      state.localStream = null;
      state.remoteStream = null;
    },
    incomingCallReceived: (
      state,
      action: PayloadAction<{ from: string; offer: any }>,
    ) => {
      state.incomingCall = action.payload;
      state.ringing = true;
    },
    incomingCallAccepted: (state, action) => {
      console.log("incoming call accepted", state.incomingCall);
      if (state.incomingCall) {
        state.inCall = true;
        state.currentCallId = state.incomingCall.from;
        state.incomingCall = null;
        state.ringing = false;
        state.peerConnection?.setRemoteDescription(
          new RTCSessionDescription(action.payload),
        );
      }
    },
    setupIceCandidate: (state, action) => {
      const { candidate } = action.payload;
      const peer = state.peerConnection;
      if (!peer || !peer.remoteDescription) {
        console.log("Remote description not set yet. Queuing candidate...");
        return;
      }
      peer.addIceCandidate(new RTCIceCandidate(candidate));
    },
    answerReceived: (state, action) => {
      if (!state.peerConnection) {
        console.log("no peerconnection ");
        return;
      }
      state.peerConnection.setRemoteDescription(
        new RTCSessionDescription(action.payload.answer),
      );
    },

    incomingCallRejected: (state) => {
      state.incomingCall = null;
    },
    setLocalStream: (state, action: PayloadAction<MediaStream | null>) => {
      state.localStream = action.payload;
    },
    setRemoteStream: (state, action: PayloadAction<MediaStream | null>) => {
      state.remoteStream = action.payload;
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
      state.localStream?.getAudioTracks().forEach((track) => {
        track.enabled = !state.isMuted;
      });
    },
    toggleVideo: (state) => {
      state.isVideoOff = !state.isVideoOff;
      state.localStream?.getVideoTracks().forEach((track) => {
        track.enabled = !state.isVideoOff;
      });
    },
  },
});

export const {
  callStarted,
  callEnded,
  incomingCallReceived,
  incomingCallAccepted,
  setupIceCandidate,
  incomingCallRejected,
  setLocalStream,
  setRemoteStream,
  toggleMute,
  toggleVideo,
} = callSlice.actions;

export default callSlice.reducer;
