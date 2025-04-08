
// src/main/java/com/randomchat/settings/model/RandomChatPreferences.java
package com.randomchat.settings.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RandomChatPreferences {
    private boolean enabled = true;
    private List<String> interests;
    private AgeRange ageRange = new AgeRange();
    private int locationRange = 50;
}
