// sender receiver

// sender -> server (sends message)
// server -> receiver
export const SEND_MESSAGE = "SEND_MESSAGE";

// receiver -> server (acknowledge message is received for double tick. here we can check chat is open and directly change to bluetick)
// server -> sender (put double tick)
export const RECEIVED_MESSAGE = "RECEIVED_MESSAGE";

// server -> receiver (forward message) (double tick , bluetick start)
export const SEND_TO_RECEIVER = "SEND_TO_RECEIVER";
export const SEND_TO_SENDER = "SEND_TO_SENDER";

export const BULK_UPDATE_STATUS = "BULK_UPDATE_STATUS";
