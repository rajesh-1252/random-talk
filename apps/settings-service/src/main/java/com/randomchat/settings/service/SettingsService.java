// src/main/java/com/randomchat/settings/service/SettingsService.java
package com.randomchat.settings.service;

import com.randomchat.settings.dto.SettingsDTO;
import com.randomchat.settings.exception.ResourceNotFoundException;
import com.randomchat.settings.exception.UserSettingsAlreadyExistsException;
import com.randomchat.settings.mapper.SettingsMapper;
import com.randomchat.settings.model.Settings;
import com.randomchat.settings.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final SettingsRepository settingsRepository;
    private final SettingsMapper settingsMapper;

    @Transactional
    public SettingsDTO createSettings(SettingsDTO settingsDTO) {
        if (settingsRepository.existsByUserId(settingsDTO.getUserId())) {
            throw new UserSettingsAlreadyExistsException("Settings for user with ID " + settingsDTO.getUserId() + " already exist");
        }
        
        Settings settings = settingsMapper.toEntity(settingsDTO);
        settings = settingsRepository.save(settings);
        return settingsMapper.toDto(settings);
    }

    public SettingsDTO getSettingsByUserId(String userId) {
        Settings settings = settingsRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Settings not found for user ID: " + userId));
        return settingsMapper.toDto(settings);
    }

    @Transactional
    public SettingsDTO updateSettings(String userId, SettingsDTO settingsDTO) {
        if (!settingsRepository.existsByUserId(userId)) {
            throw new ResourceNotFoundException("Settings not found for user ID: " + userId);
        }
        
        Settings existingSettings = settingsRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Settings not found for user ID: " + userId));
        
        // Ensure we're updating the correct user's settings
        settingsDTO.setId(existingSettings.getId());
        settingsDTO.setUserId(userId);
        
        Settings updatedSettings = settingsMapper.toEntity(settingsDTO);
        updatedSettings = settingsRepository.save(updatedSettings);
        return settingsMapper.toDto(updatedSettings);
    }

    @Transactional
    public void deleteSettings(String userId) {
        if (!settingsRepository.existsByUserId(userId)) {
            throw new ResourceNotFoundException("Settings not found for user ID: " + userId);
        }
        
        settingsRepository.deleteByUserId(userId);
    }
}
