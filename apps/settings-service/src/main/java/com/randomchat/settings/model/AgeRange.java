
// src/main/java/com/randomchat/settings/model/AgeRange.java
package com.randomchat.settings.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgeRange {
    private int min = 18;
    private int max = 1000;
}
