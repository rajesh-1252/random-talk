import IncomingCallModal from "@/components/IncomingCallModal";
import { AppDispatch, RootState, store } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const WEBSOCKET_CONNECT = "websocket/connect";
const WEBSOCKET_DISCONNECT = "websocket/disconnect";

const WebsocketProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ringing } = useSelector((state: RootState) => state.webRtc);
  const callerInfo = useSelector((state: RootState) => state.webRtc.caller);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("no token available");
      return;
    }

    dispatch({
      type: WEBSOCKET_CONNECT,
      payload: { url: `ws://localhost:8003/?token=${token}` },
    });

    return () => {
      dispatch({ type: WEBSOCKET_DISCONNECT });
    };
  }, [dispatch]);

  return (
    <>
      {ringing && <IncomingCallModal caller={callerInfo} />}
      {children}
    </>
  );
};

export default WebsocketProvider;
