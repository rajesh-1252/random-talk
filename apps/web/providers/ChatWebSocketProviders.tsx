import { fetchUser } from "@/store/features/user/userSlice";
import { AppDispatch, RootState, store } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const WEBSOCKET_CONNECT = "chatWebsocket/connect";
const WEBSOCKET_DISCONNECT = "chatWebsocket/disconnect";

const ChatWebsocketProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  // const { users } = useSelector((state: RootState) => state.chat);
  // const callerInfo = useSelector((state: RootState) => state.chat);

  console.log('ChatWebsocketProvider  running', process.env.NEXT_PUBLIC_WS_URL)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("no token available");
      return;
    }
    dispatch(fetchUser());
    dispatch({
      type: WEBSOCKET_CONNECT,
      payload: {
        url: `${process.env.NEXT_PUBLIC_WS_URL}`
      },
    });

    return () => {
      dispatch({ type: WEBSOCKET_DISCONNECT });
    };
  }, [dispatch]);

  return (
    <>
      {children}
    </>
  );
};

export default ChatWebsocketProvider;
