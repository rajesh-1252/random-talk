export interface User {
  _id: string;
  name: string;
  email: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  phone?: string;
  friends: string[];
  blockedUsers: string[];
  rating: number;
  status: "online" | "offline" | "away" | "busy";
  lastSeen?: string;
  device?: {
    platform: string;
    token: string;
  };
}

export interface ISettings {
  privacy: {
    showLastSeen: boolean;
    showProfilePicture: boolean;
    showStatus: boolean;
    readReceipts: boolean;
  };
  notifications: {
    messages: boolean;
    calls: boolean;
    groupChats: boolean;
  };
  videoCallSettings: {
    defaultMuteAudio: boolean;
    defaultMuteVideo: boolean;
    preferredResolution: string;
  };
  randomChatPreferences: {
    enabled: boolean;
    interests: string[];
    ageRange: {
      min: number;
      max: number;
    };
    locationRange: number;
  };
}

export interface UserState {
  user: IUser | null;
  settings: ISettings | null;
  loading: boolean;
  error: string | null;
}

