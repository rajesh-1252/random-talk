import { store } from "@/store/store";
import React, { ReactNode, FC } from "react";
import { Provider } from "react-redux";
import WebsocketProvider from "./WebsocketProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/react-query/QueryClientProvider";
import ChatWebsocketProvider from "./ChatWebSocketProviders";
const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ChatWebsocketProvider>
          <WebsocketProvider>
            {children}
          </WebsocketProvider>
        </ChatWebsocketProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default Providers;
