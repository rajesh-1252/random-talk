"use client";
import Contacts from "@/components/Contacts";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const handleCall = (callerId: string) => {
    router.push(`/call/${callerId}`);
  };

  return (
    <div className="h-screen">
      <Contacts callFav={handleCall} />
    </div>
  );
};

export default Page;
