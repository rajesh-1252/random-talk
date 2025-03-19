import { createSlice, PayloadAction } from "@reduxjs/toolkit";

enum callStatus {
  Ringing = "Ringing",
  CallRejected = "CallRejected ",
  Busy = "",
  CallDisconnected = "CallDisconnected ",
  OnCall = "OnCall",
  NotOnCall = "NotOnCall",
}

export interface CallState {
  callStatus: callStatus;
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
  callRejected: boolean;
  callDisconnected: boolean;
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
  callRejected: false,
  callDisconnected: false,
  callStatus: callStatus.NotOnCall,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    callStarted: (
      state,
      action: PayloadAction<{
        currentCallId: string;
        peerConnection: RTCPeerConnection;
      }>,
    ) => {
      state.callDisconnected = false;
      state.currentCallId = action.payload.currentCallId;
      state.peerConnection = action.payload.peerConnection;
      state.callRejected = false;
      state.callStatus = callStatus.Ringing;
    },
    changeCallDisconnected: (state, action) => {
      state.callDisconnected = action.payload;
    },
    callEnded: (state) => {
      state.inCall = false;
      state.currentCallId = null;
      state.incomingCall = null;
      state.peerConnection = null;
      state.localStream = null;
      state.remoteStream = null;
      state.callRejected = false;
      state.callDisconnected = true;
      state.callStatus = callStatus.CallDisconnected;
    },
    incomingCallReceived: (
      state,
      action: PayloadAction<{
        from: string;
        offer: RTCSessionDescriptionInit;
      }>,
    ) => {
      state.incomingCall = action.payload;
      state.ringing = true;
    },
    incomingCallAccepted: (
      state,
      action: PayloadAction<{
        currentCallId: string;
        peerConnection?: RTCPeerConnection;
      }>,
    ) => {
      state.inCall = true;
      state.ringing = false;
      state.currentCallId = action.payload.currentCallId;
      state.callStatus = callStatus.OnCall;
      if (action.payload.peerConnection) {
        state.peerConnection = action.payload.peerConnection;
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

    incomingCallRejected: (state) => {
      state.incomingCall = null;
      state.ringing = false;
      state.callStatus = callStatus.NotOnCall;
    },

    outGoingCallRejected: (state) => {
      state.incomingCall = null;
      state.ringing = false;
      state.callRejected = true;
      state.callStatus = callStatus.CallRejected;
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
  changeCallDisconnected,
} = callSlice.actions;

export default callSlice.reducer;
