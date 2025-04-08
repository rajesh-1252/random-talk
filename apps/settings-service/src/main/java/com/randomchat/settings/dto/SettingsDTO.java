// src/main/java/com/randomchat/settings/dto/SettingsDTO.java
package com.randomchat.settings.dto;

import com.randomchat.settings.model.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettingsDTO {
    private String id;
    
    @NotBlank(message = "User ID is required")
    private String userId;
    
    @Valid
    private PrivacySettingsDTO privacy;
    
    @Valid
    private NotificationSettingsDTO notifications;
    
    private Map<String, String> secretChatKeys;
    
    @Valid
    private VideoCallSettingsDTO videoCallSettings;
    
    @Valid
    private RandomChatPreferencesDTO randomChatPreferences;
}





