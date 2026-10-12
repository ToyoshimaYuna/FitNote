package com.fitnote.repository;

import com.fitnote.entity.WorkoutDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutDetailRepository
        extends JpaRepository<WorkoutDetail, Long> {
}