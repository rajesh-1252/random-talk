// src/main/java/com/randomchat/settings/dto/RandomChatPreferencesDTO.java
package com.randomchat.settings.dto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RandomChatPreferencesDTO {
    private boolean enabled = true;
    private List<String> interests;
    
    @Valid
    private AgeRangeDTO ageRange = new AgeRangeDTO();
    
    private int locationRange = 50;
}
