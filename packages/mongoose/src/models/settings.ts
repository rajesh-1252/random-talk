import mongoose, { Schema } from "mongoose";

export interface ISettings extends Document {
  userId: mongoose.Types.ObjectId;
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
  secretChatKeys?: Map<string, string>;
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

const SettingsSchema = new Schema<ISettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    privacy: {
      showLastSeen: { type: Boolean, default: true },
      showProfilePicture: { type: Boolean, default: true },
      showStatus: { type: Boolean, default: true },
      readReceipts: { type: Boolean, default: true },
    },
    notifications: {
      messages: { type: Boolean, default: true },
      calls: { type: Boolean, default: true },
      groupChats: { type: Boolean, default: true },
    },
    secretChatKeys: { type: Map, of: String },
    videoCallSettings: {
      defaultMuteAudio: { type: Boolean, default: false },
      defaultMuteVideo: { type: Boolean, default: false },
      preferredResolution: { type: String, default: "720p" },
    },
    randomChatPreferences: {
      enabled: { type: Boolean, default: true },
      interests: { type: [String] },
      ageRange: {
        min: { type: Number, min: 18, default: 18 },
        max: { type: Number, max: 100, default: 100 },
      },
      locationRange: { type: Number, default: 50 },
    },
  },
  { timestamps: true },
);

// Index for faster lookup by userId
SettingsSchema.index({ userId: 1 });

const SettingsModel = mongoose.model<ISettings>("Settings", SettingsSchema);

export { SettingsModel };
