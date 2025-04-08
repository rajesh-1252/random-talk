// src/main/java/com/randomchat/settings/dto/AgeRangeDTO.java
package com.randomchat.settings.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgeRangeDTO {
    @Min(value = 18, message = "Minimum age must be at least 18")
    private int min = 18;
    
    @Max(value = 1000, message = "Maximum age must be at most 1000")
    private int max = 100;
}
