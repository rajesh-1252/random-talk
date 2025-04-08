// src/main/java/com/randomchat/settings/model/NotificationSettings.java
package com.randomchat.settings.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSettings {
    private boolean messages = true;
    private boolean calls = true;
    private boolean groupChats = true;
}
