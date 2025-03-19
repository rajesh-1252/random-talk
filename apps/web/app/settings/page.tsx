// pages/settings.js
"use client";
import { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Users,
  Sliders,
  Volume2,
  Moon,
  UserPlus,
  UserMinus,
  Globe,
  Eye,
  EyeOff,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  LogOut,
  User,
  Smartphone,
} from "lucide-react";

export default function SettingsPage() {
  // State for various settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [privateProfileEnabled, setPrivateProfileEnabled] = useState(false);
  const [allowFriendRequests, setAllowFriendRequests] = useState(true);
  const [audioQuality, setAudioQuality] = useState("high");
  const [language, setLanguage] = useState("english");
  const [blockedUsers, setBlockedUsers] = useState([
    { id: 1, name: "Alex Thompson", date: "2025-03-10" },
    { id: 2, name: "Jamie Rivera", date: "2025-03-15" },
  ]);

  // Toggle functions
  const toggleSetting = (setting, setSetting) => {
    setSetting(!setting);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-indigo-600 p-6 text-white">
        <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Settings className="w-6 h-6" />
          Settings
        </h1>
        <p className="text-center text-indigo-100 mt-2">
          Customize your random call experience
        </p>
      </div>

      {/* Settings Content */}
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        {/* Account Section */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Account Settings
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">Profile Visibility</h3>
                <p className="text-sm text-gray-500">
                  Make your profile private
                </p>
              </div>
              <button
                onClick={() =>
                  toggleSetting(privateProfileEnabled, setPrivateProfileEnabled)
                }
                className="text-gray-500"
              >
                {privateProfileEnabled ? (
                  <ToggleRight className="w-8 h-8 text-indigo-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">Friend Requests</h3>
                <p className="text-sm text-gray-500">
                  Allow others to add you as friend
                </p>
              </div>
              <button
                onClick={() =>
                  toggleSetting(allowFriendRequests, setAllowFriendRequests)
                }
                className="text-gray-500"
              >
                {allowFriendRequests ? (
                  <ToggleRight className="w-8 h-8 text-indigo-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h3 className="font-medium">Language</h3>
                <p className="text-sm text-gray-500">
                  Set your preferred language
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2 capitalize">
                  {language}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              Privacy & Security
            </h2>
          </div>

          <div>
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium mb-3">Blocked Users</h3>
              {blockedUsers.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {blockedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="py-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">
                          Blocked on {user.date}
                        </p>
                      </div>
                      <button className="text-red-500 text-sm">Unblock</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  You haven't blocked any users
                </p>
              )}
            </div>

            <div className="p-4">
              <button className="w-full py-3 text-center text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              App Preferences
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-gray-500">
                  Push notifications for calls and messages
                </p>
              </div>
              <button
                onClick={() =>
                  toggleSetting(notificationsEnabled, setNotificationsEnabled)
                }
                className="text-gray-500"
              >
                {notificationsEnabled ? (
                  <ToggleRight className="w-8 h-8 text-indigo-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-gray-500">Enable dark theme</p>
              </div>
              <button
                onClick={() =>
                  toggleSetting(darkModeEnabled, setDarkModeEnabled)
                }
                className="text-gray-500"
              >
                {darkModeEnabled ? (
                  <ToggleRight className="w-8 h-8 text-indigo-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h3 className="font-medium">Audio Quality</h3>
                <p className="text-sm text-gray-500">
                  Set preferred call audio quality
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2 capitalize">
                  {audioQuality}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Call Preferences */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-600" />
              Call Preferences
            </h2>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-medium mb-2">Call Region</h3>
              <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <span>Global (All regions)</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Call Duration Limit</h3>
              <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                <span>30 minutes</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Auto-reject calls from</h3>
              <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                <span>Blocked users only</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}
