// Models package

// src/main/java/com/randomchat/settings/model/Settings.java
package com.randomchat.settings.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "settings")
public class Settings {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String userId;
    
    private PrivacySettings privacy;
    private NotificationSettings notifications;
    private Map<String, String> secretChatKeys;
    private VideoCallSettings videoCallSettings;
    private RandomChatPreferences randomChatPreferences;
}
