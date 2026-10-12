package com.fitnote.repository;

import com.fitnote.entity.WorkoutRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutRecordRepository
        extends JpaRepository<WorkoutRecord, Long> {
}