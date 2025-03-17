import React from "react";
import VideoCallPage from "./VideoCall";

interface VideoCallPageProps {
  params: { callerId: string };
}
const page = async ({ params }: VideoCallPageProps) => {
  const id = await params;
  return <VideoCallPage callerId={id.callerId} />;
};

export default page;
