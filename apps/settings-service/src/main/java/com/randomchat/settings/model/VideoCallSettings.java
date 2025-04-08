// src/main/java/com/randomchat/settings/model/VideoCallSettings.java
package com.randomchat.settings.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoCallSettings {
    private boolean defaultMuteAudio = false;
    private boolean defaultMuteVideo = false;
    private String preferredResolution = "720p";
}
