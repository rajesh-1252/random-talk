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

// receiver -> server (acknowledge receipt of message) (double tick)
export const MESSAGE_RECEIVED_BY_RECEIVER_SEND_ACK_TO_SERVER =
  "MESSAGE_RECEIVED_BY_RECEIVER_SEND_ACK_TO_SERVER";

// server -> sender (acknowledge delivery to receiver)
export const MESSAGE_RECEIVED_BY_RECEIVER_SEND_TO_SENDER =
  "MESSAGE_RECEIVED_BY_RECEIVER_SEND_TO_SENDER";

// receiver -> server (message seen)
export const MESSAGE_SEEN_BY_RECEIVER_SEND_TO_SERVER =
  "MESSAGE_SEEN_BY_RECEIVER_SEND_TO_SERVER";

// server -> sender (notify sender that message was seen)
export const MESSAGE_SEEN_BY_RECEIVER_SEND_TO_SENDER =
  "MESSAGE_SEEN_BY_RECEIVER_SEND_TO_SENDER";

// sender -> server (is typing...)
export const TYPING_STARTED_BY_SENDER_SEND_TO_SERVER =
  "TYPING_STARTED_BY_SENDER_SEND_TO_SERVER";

// server -> receiver (show typing)
export const TYPING_STARTED_BY_SENDER_SEND_TO_RECEIVER =
  "TYPING_STARTED_BY_SENDER_SEND_TO_RECEIVER";

// sender -> server (stopped typing)
export const TYPING_STOPPED_BY_SENDER_SEND_TO_SERVER =
  "TYPING_STOPPED_BY_SENDER_SEND_TO_SERVER";

// server -> receiver (hide typing)
export const TYPING_STOPPED_BY_SENDER_SEND_TO_RECEIVER =
  "TYPING_STOPPED_BY_SENDER_SEND_TO_RECEIVER";
