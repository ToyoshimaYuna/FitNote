package com.fitnote.controller;

import com.fitnote.entity.WorkoutDetail;
import com.fitnote.repository.WorkoutDetailRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workout-details")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://fit-note-pied.vercel.app"
})
public class WorkoutDetailController {

    private final WorkoutDetailRepository repository;

    public WorkoutDetailController(WorkoutDetailRepository repository) {
        this.repository = repository;
    }

    // 筋トレ詳細をすべて取得
    @GetMapping
    public List<WorkoutDetail> getAllDetails() {
        return repository.findAll();
    }

    // 筋トレ詳細を登録
    @PostMapping
    public WorkoutDetail createDetail(@RequestBody WorkoutDetail detail) {
        return repository.save(detail);
    }

    // 筋トレ詳細を削除
    @DeleteMapping("/{id}")
    public void deleteDetail(@PathVariable Long id) {
        repository.deleteById(id);
    }
    // 筋トレ詳細を編集
@PutMapping("/{id}")
public WorkoutDetail updateDetail(
        @PathVariable Long id,
        @RequestBody WorkoutDetail newDetail) {

    WorkoutDetail detail = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("記録が見つかりません"));

    detail.setExerciseName(newDetail.getExerciseName());
    detail.setWeight(newDetail.getWeight());
    detail.setReps(newDetail.getReps());
    detail.setSets(newDetail.getSets());
    detail.setTime(newDetail.getTime());
    detail.setSpeed(newDetail.getSpeed());
    detail.setIncline(newDetail.getIncline());

    return repository.save(detail);
}
}