// src/main/java/com/randomchat/settings/model/PrivacySettings.java
package com.randomchat.settings.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrivacySettings {
    private boolean showLastSeen = true;
    private boolean showProfilePicture = true;
    private boolean showStatus = true;
    private boolean readReceipts = true;
}
