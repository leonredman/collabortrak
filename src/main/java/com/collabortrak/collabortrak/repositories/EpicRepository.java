package com.collabortrak.collabortrak.repositories;
import com.collabortrak.collabortrak.entities.Epic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EpicRepository extends JpaRepository<Epic, Long> {
    List<Epic> findByCustomerId(Long customerId);
}
