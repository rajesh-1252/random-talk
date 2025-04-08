// src/main/java/com/randomchat/settings/mapper/SettingsMapper.java
package com.randomchat.settings.mapper;

import com.randomchat.settings.dto.*;
import com.randomchat.settings.model.*;
import org.springframework.stereotype.Component;

@Component
public class SettingsMapper {

    public Settings toEntity(SettingsDTO dto) {
        if (dto == null) {
            return null;
        }
        
        return Settings.builder()
                .id(dto.getId())
                .userId(dto.getUserId())
                .privacy(toPrivacyEntity(dto.getPrivacy()))
                .notifications(toNotificationEntity(dto.getNotifications()))
                .secretChatKeys(dto.getSecretChatKeys())
                .videoCallSettings(toVideoCallEntity(dto.getVideoCallSettings()))
                .randomChatPreferences(toRandomChatPreferencesEntity(dto.getRandomChatPreferences()))
                .build();
    }

    public SettingsDTO toDto(Settings entity) {
        if (entity == null) {
            return null;
        }
        
        return SettingsDTO.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .privacy(toPrivacyDto(entity.getPrivacy()))
                .notifications(toNotificationDto(entity.getNotifications()))
                .secretChatKeys(entity.getSecretChatKeys())
                .videoCallSettings(toVideoCallDto(entity.getVideoCallSettings()))
                .randomChatPreferences(toRandomChatPreferencesDto(entity.getRandomChatPreferences()))
                .build();
    }

    private PrivacySettings toPrivacyEntity(PrivacySettingsDTO dto) {
        if (dto == null) {
            return new PrivacySettings();
        }
        
        return PrivacySettings.builder()
                .showLastSeen(dto.isShowLastSeen())
                .showProfilePicture(dto.isShowProfilePicture())
                .showStatus(dto.isShowStatus())
                .readReceipts(dto.isReadReceipts())
                .build();
    }

    private PrivacySettingsDTO toPrivacyDto(PrivacySettings entity) {
        if (entity == null) {
            return new PrivacySettingsDTO();
        }
        
        return PrivacySettingsDTO.builder()
                .showLastSeen(entity.isShowLastSeen())
                .showProfilePicture(entity.isShowProfilePicture())
                .showStatus(entity.isShowStatus())
                .readReceipts(entity.isReadReceipts())
                .build();
    }

    private NotificationSettings toNotificationEntity(NotificationSettingsDTO dto) {
        if (dto == null) {
            return new NotificationSettings();
        }
        
        return NotificationSettings.builder()
                .messages(dto.isMessages())
                .calls(dto.isCalls())
                .groupChats(dto.isGroupChats())
                .build();
    }

    private NotificationSettingsDTO toNotificationDto(NotificationSettings entity) {
        if (entity == null) {
            return new NotificationSettingsDTO();
        }
        
        return NotificationSettingsDTO.builder()
                .messages(entity.isMessages())
                .calls(entity.isCalls())
                .groupChats(entity.isGroupChats())
                .build();
    }

    private VideoCallSettings toVideoCallEntity(VideoCallSettingsDTO dto) {
        if (dto == null) {
            return new VideoCallSettings();
        }
        
        return VideoCallSettings.builder()
                .defaultMuteAudio(dto.isDefaultMuteAudio())
                .defaultMuteVideo(dto.isDefaultMuteVideo())
                .preferredResolution(dto.getPreferredResolution())
                .build();
    }

    private VideoCallSettingsDTO toVideoCallDto(VideoCallSettings entity) {
        if (entity == null) {
            return new VideoCallSettingsDTO();
        }
        
        return VideoCallSettingsDTO.builder()
                .defaultMuteAudio(entity.isDefaultMuteAudio())
                .defaultMuteVideo(entity.isDefaultMuteVideo())
                .preferredResolution(entity.getPreferredResolution())
                .build();
    }

    private RandomChatPreferences toRandomChatPreferencesEntity(RandomChatPreferencesDTO dto) {
        if (dto == null) {
            return new RandomChatPreferences();
        }
        
        return RandomChatPreferences.builder()
                .enabled(dto.isEnabled())
                .interests(dto.getInterests())
                .ageRange(toAgeRangeEntity(dto.getAgeRange()))
                .locationRange(dto.getLocationRange())
                .build();
    }

    private RandomChatPreferencesDTO toRandomChatPreferencesDto(RandomChatPreferences entity) {
        if (entity == null) {
            return new RandomChatPreferencesDTO();
        }
        
        return RandomChatPreferencesDTO.builder()
                .enabled(entity.isEnabled())
                .interests(entity.getInterests())
                .ageRange(toAgeRangeDto(entity.getAgeRange()))
                .locationRange(entity.getLocationRange())
                .build();
    }

    private AgeRange toAgeRangeEntity(AgeRangeDTO dto) {
        if (dto == null) {
            return new AgeRange();
        }
        
        return AgeRange.builder()
                .min(dto.getMin())
                .max(dto.getMax())
                .build();
    }

    private AgeRangeDTO toAgeRangeDto(AgeRange entity) {
        if (entity == null) {
            return new AgeRangeDTO();
        }
        
        return AgeRangeDTO.builder()
                .min(entity.getMin())
                .max(entity.getMax())
                .build();
    }
}
