
// src/main/java/com/randomchat/settings/dto/NotificationSettingsDTO.java
package com.randomchat.settings.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSettingsDTO {
    private boolean messages = true;
    private boolean calls = true;
    private boolean groupChats = true;
}
