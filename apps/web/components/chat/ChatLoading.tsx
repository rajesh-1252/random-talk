import { Loader2 } from 'lucide-react';

const ChatLoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="animate-pulse">
            <Loader2
              className="h-16 w-16 text-blue-500 dark:text-blue-400 animate-spin"
            />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Loading Chats
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Connecting to your conversations...
        </p>
      </div>
    </div>
  );
};

export default ChatLoadingScreen;
