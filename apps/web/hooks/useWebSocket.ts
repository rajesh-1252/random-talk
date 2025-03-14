"use client";

import { useEffect, useRef, useState } from "react";

export const useWebSocket = (url: string, onMessage: (data: any) => void) => {
  const ws = useRef<WebSocket | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.error("❌ No token found");
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    ws.current = new WebSocket(`${url}?token=${token}`);

    ws.current.onopen = () => {
      console.log("✅ Connected to WebSocket");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.current.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    ws.current.onclose = () => {
      console.log("❌ WebSocket closed");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [token, url]);

  return ws;
};
