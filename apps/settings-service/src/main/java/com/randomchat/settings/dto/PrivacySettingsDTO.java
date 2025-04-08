
// src/main/java/com/randomchat/settings/dto/PrivacySettingsDTO.java
package com.randomchat.settings.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrivacySettingsDTO {
    private boolean showLastSeen = true;
    private boolean showProfilePicture = true;
    private boolean showStatus = true;
    private boolean readReceipts = true;
}
