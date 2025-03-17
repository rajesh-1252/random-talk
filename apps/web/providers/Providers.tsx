import { store } from "@/store/store";
import React, { ReactNode, FC } from "react";
import { Provider } from "react-redux";
import WebsocketProvider from "./WebsocketProvider";

const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <WebsocketProvider>{children}</WebsocketProvider>
    </Provider>
  );
};

export default Providers;
