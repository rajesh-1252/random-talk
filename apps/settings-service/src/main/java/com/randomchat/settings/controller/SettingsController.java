// src/main/java/com/randomchat/settings/controller/SettingsController.java
package com.randomchat.settings.controller;

import com.randomchat.settings.dto.SettingsDTO;
import com.randomchat.settings.service.SettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @PostMapping
    public ResponseEntity<SettingsDTO> createSettings(@Valid @RequestBody SettingsDTO settingsDTO) {
        SettingsDTO createdSettings = settingsService.createSettings(settingsDTO);
        return new ResponseEntity<>(createdSettings, HttpStatus.CREATED);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<SettingsDTO> getSettingsByUserId(@PathVariable String userId) {
        SettingsDTO settings = settingsService.getSettingsByUserId(userId);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<SettingsDTO> updateSettings(
            @PathVariable String userId,
            @Valid @RequestBody SettingsDTO settingsDTO) {
        SettingsDTO updatedSettings = settingsService.updateSettings(userId, settingsDTO);
        return ResponseEntity.ok(updatedSettings);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteSettings(@PathVariable String userId) {
        settingsService.deleteSettings(userId);
        return ResponseEntity.noContent().build();
    }
}
