// src/main/java/com/randomchat/settings/repository/SettingsRepository.java
package com.randomchat.settings.repository;

import com.randomchat.settings.model.Settings;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SettingsRepository extends MongoRepository<Settings, String> {
    Optional<Settings> findByUserId(String userId);
    void deleteByUserId(String userId);
    boolean existsByUserId(String userId);
}
