import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Phone, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { incomingCallRejected } from "@/store/features/call/callSlice";

// Action types

interface CallInfoProps {
  caller?: {
    name: string;
    avatar?: string;
  };
}

const IncomingCallModal: React.FC<CallInfoProps> = ({
  caller = { name: "Unknown" },
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const offer = useSelector((state: RootState) => state.webRtc.incomingCall);
  const handleAcceptCall = async () => {
    if (!offer?.offer && !offer?.from) return;
    router.push(`/call/onCall/${offer.from}?new=true`);
  };

  const handleRejectCall = () => {
    if (!offer?.from) return;
    dispatch(incomingCallRejected());
    dispatch({
      type: "websocket/send",
      payload: {
        type: "reject-call",
        to: offer?.from,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 max-w-md ">
        <div className="flex flex-col items-center mb-6">
          {caller.avatar ? (
            <Image
              src={caller.avatar}
              alt={`${caller.name}'s avatar`}
              className="w-24 h-24 rounded-full border-4 border-green-500 mb-4"
              height={30}
              width={30}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-gray-600 border-4 border-green-500 mb-4">
              {caller.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">Incoming Call</h2>
            <p className="text-gray-600 text-lg mb-2">{caller.name}</p>
            <div className="flex items-center justify-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm text-green-600">Calling...</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleRejectCall}
            className="flex-1 mr-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-full flex items-center justify-center transition-colors duration-300"
            aria-label="Reject call"
          >
            <X size={20} />
            <span className="ml-2">Decline</span>
          </button>

          <button
            onClick={handleAcceptCall}
            className="flex-1 ml-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-full flex items-center justify-center transition-colors duration-300"
            aria-label="Accept call"
          >
            <Phone size={20} />
            <span className="ml-2">Answer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
