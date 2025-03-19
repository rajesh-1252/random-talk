import CallRinging from "@/components/CallRinging";
import React from "react";

interface RingingProps {
  params: { callerId: string };
}

const page = async ({ params }: RingingProps) => {
  const id = await params;
  return <CallRinging callerId={id.callerId} />;
};

export default page;
