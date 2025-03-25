import { MapPin, Camera, FileText, Image } from "lucide-react";

export function AttachmentMenu() {
  return (
    <div className="bg-white px-4 py-3 border-t border-gray-200 grid grid-cols-4 gap-4">
      <button className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-1">
          <Image className="w-6 h-6 text-indigo-600" />
        </div>
        <span className="text-xs">Photo</span>
      </button>
      <button className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-1">
          <Camera className="w-6 h-6 text-indigo-600" />
        </div>
        <span className="text-xs">Camera</span>
      </button>
      <button className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-1">
          <FileText className="w-6 h-6 text-indigo-600" />
        </div>
        <span className="text-xs">Document</span>
      </button>
      <button className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-1">
          <MapPin className="w-6 h-6 text-indigo-600" />
        </div>
        <span className="text-xs">Location</span>
      </button>
    </div>
  );
}
