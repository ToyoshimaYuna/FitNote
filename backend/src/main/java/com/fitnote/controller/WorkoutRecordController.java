package com.fitnote.controller;

import com.fitnote.entity.WorkoutRecord;
import com.fitnote.repository.WorkoutRecordRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workout-records")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://fit-note-pied.vercel.app"
})
public class WorkoutRecordController {

    private final WorkoutRecordRepository repository;

    public WorkoutRecordController(WorkoutRecordRepository repository) {
        this.repository = repository;
    }

    // 筋トレ記録をすべて取得
    @GetMapping
    public List<WorkoutRecord> getAllRecords() {
        return repository.findAll();
    }

    // 筋トレ記録を登録
    @PostMapping
    public WorkoutRecord createRecord(@RequestBody WorkoutRecord record) {
        return repository.save(record);
    }

    // 筋トレ記録を1件取得
    @GetMapping("/{id}")
    public WorkoutRecord getRecord(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    // 筋トレ記録を削除
    @DeleteMapping("/{id}")
    public void deleteRecord(@PathVariable Long id) {
        repository.deleteById(id);
    }
}