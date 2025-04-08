// src/main/java/com/randomchat/settings/dto/VideoCallSettingsDTO.java
package com.randomchat.settings.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoCallSettingsDTO {
    private boolean defaultMuteAudio = false;
    private boolean defaultMuteVideo = false;
    private String preferredResolution = "720p";
}
