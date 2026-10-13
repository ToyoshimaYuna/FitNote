import { useEffect, useState } from 'react'
import './App.css'


function App() {
  useEffect(() => {
    const fetchWorkoutRecords = async () => {
      try {
        const recordResponse = await fetch(
          'https://fitnote.onrender.com/workout-records'
        )

        if (!recordResponse.ok) {
          throw new Error('トレーニング日の取得に失敗しました')
        }

        const records = await recordResponse.json()

        const detailResponse = await fetch(
          'https://fitnote.onrender.com/workout-details'
        )

        if (!detailResponse.ok) {
          throw new Error('種目の取得に失敗しました')
        }

        const details = await detailResponse.json()

        const formattedRecords = details.map((detail) => {
          const record = records.find(
            (item) => item.recordId === detail.recordId
          )

          return {
            id: detail.detailId,
            date: record
              ? String(record.workoutDate).replaceAll('-', '/')
              : '',
            exercise: detail.exerciseName,
            weight: detail.weight,
            reps: detail.reps,
            sets: detail.sets,
            time: detail.time ?? '',
            speed: detail.speed ?? '',
            incline: detail.incline ?? '',
          }
        })

        setWorkoutRecords(formattedRecords)

        console.log('取得したトレーニング記録:', formattedRecords)
      } catch (error) {
        console.error('データ取得エラー:', error)
      }
    }

    fetchWorkoutRecords()
  }, [])

  const [workoutRecords, setWorkoutRecords] = useState([
    {
      id: 1,
      date: '2026/10/09',
      exercise: 'ベンチプレス',
      weight: 40,
      reps: 10,
      sets: 3,
    },
    {
      id: 2,
      date: '2026/10/08',
      exercise: 'スクワット',
      weight: 50,
      reps: 10,
      sets: 3,
    },
    {
      id: 3,
      date: '2026/10/07',
      exercise: 'ラットプルダウン',
      weight: 30,
      reps: 12,
      sets: 3,
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [searchDate, setSearchDate] = useState('')
  const [appliedSearchDate, setAppliedSearchDate] = useState('')
  // 詳細画面に表示する日付
  const [selectedDate, setSelectedDate] = useState(null)
  // 編集するトレーニングのID
  const [editingId, setEditingId] = useState(null)
  // 詳細画面で追加フォームを表示するか
  const [showDetailForm, setShowDetailForm] = useState(false)

  // 詳細画面で追加する種目の入力内容
  const [detailForm, setDetailForm] = useState({
    exercise: '',
    weight: '',
    reps: '',
    sets: '',
    time: '',
    speed: '',
    incline: '',
  })

  // 編集フォームの入力内容
  const [editForm, setEditForm] = useState({
    exercise: '',
    weight: '',
    reps: '',
    sets: '',
    time: '',
    speed: '',
    incline: '',
  })
  // 編集したトレーニングを保存する
  // 編集したトレーニングを保存する
  const handleEditSave = async () => {
    if (
      !editForm.exercise.trim() ||
      editForm.weight === '' ||
      editForm.reps === '' ||
      editForm.sets === ''
    ) {
      alert('種目名、重量、回数、セット数を入力してください。')
      return
    }

    if (
      Number(editForm.weight) < 0 ||
      Number(editForm.reps) <= 0 ||
      Number(editForm.sets) <= 0 ||
      (editForm.time !== '' && Number(editForm.time) < 0) ||
      (editForm.speed !== '' && Number(editForm.speed) < 0) ||
      (editForm.incline !== '' && Number(editForm.incline) < 0)
    ) {
      alert('重量・時間・速度・傾斜は0以上、回数とセット数は1以上で入力してください。')
      return
    }

    try {
      console.log('編集するID:', editingId)
      const response = await fetch(
        `https://fitnote.onrender.com/workout-details/${editingId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            exerciseName: editForm.exercise.trim(),
            weight: Number(editForm.weight),
            reps: Number(editForm.reps),
            sets: Number(editForm.sets),
            time: editForm.time === '' ? null : Number(editForm.time),
            speed: editForm.speed === '' ? null : Number(editForm.speed),
            incline: editForm.incline === '' ? null : Number(editForm.incline),
          }),
        }
      )

      if (!response.ok) {
        throw new Error('編集の保存に失敗しました')
      }

      setWorkoutRecords((records) =>
        records.map((record) =>
          record.id === editingId
            ? {
              ...record,
              exercise: editForm.exercise.trim(),
              weight: Number(editForm.weight),
              reps: Number(editForm.reps),
              sets: Number(editForm.sets),
              time: editForm.time === '' ? '' : Number(editForm.time),
              speed: editForm.speed === '' ? '' : Number(editForm.speed),
              incline: editForm.incline === '' ? '' : Number(editForm.incline),
            }
            : record
        )
      )

      setEditingId(null)
      alert('トレーニング記録を更新しました！')
    } catch (error) {
      console.error('編集エラー:', error)
      alert('編集の保存に失敗しました。')
    }
  }

  const [date, setDate] = useState('2026-10-09')

  const createEmptyExercise = () => ({
    exercise: '',
    weight: '',
    reps: '',
    sets: '',
    time: '',
    speed: '',
    incline: '',
  })

  const [exercises, setExercises] = useState([createEmptyExercise()])
  // トレーニングを登録する


  const handleRegister = async (event) => {
    event.preventDefault()

    if (!date) {
      alert('トレーニング日を入力してください。')
      return
    }

    for (const item of exercises) {
      if (
        !item.exercise.trim() ||
        item.weight === '' ||
        item.reps === '' ||
        item.sets === ''
      ) {
        alert('種目名、重量、回数、セット数を入力してください。')
        return
      }

      if (
        Number(item.weight) < 0 ||
        Number(item.reps) <= 0 ||
        Number(item.sets) <= 0 ||
        (item.time !== '' && Number(item.time) < 0) ||
        (item.speed !== '' && Number(item.speed) < 0) ||
        (item.incline !== '' && Number(item.incline) < 0)
      ) {
        alert('重量・時間・速度・傾斜は0以上、回数とセット数は1以上で入力してください。')
        return
      }
    }

    try {
      // トレーニング日を登録
      const recordResponse = await fetch('https://fitnote.onrender.com/workout-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workoutDate: date,
        }),
      })

      if (!recordResponse.ok) {
        throw new Error('トレーニング日の登録に失敗しました')
      }

      const savedRecord = await recordResponse.json()

      // 各種目を登録
      for (const item of exercises) {
        const detailResponse = await fetch('https://fitnote.onrender.com/workout-details', {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recordId: savedRecord.recordId,
            exerciseId: null,
            exerciseName: item.exercise.trim(),
            weight: Number(item.weight),
            reps: Number(item.reps),
            sets: Number(item.sets),
            time: item.time === '' ? null : Number(item.time),
            speed: item.speed === '' ? null : Number(item.speed),
            incline: item.incline === '' ? null : Number(item.incline),
          }),
        })

        if (!detailResponse.ok) {
          throw new Error('トレーニング種目の登録に失敗しました')
        }
      }

      // 登録した記録を画面にも反映
      const newRecords = exercises.map((item, index) => ({
        id: Date.now() + index,
        date: date.replaceAll('-', '/'),
        exercise: item.exercise.trim(),
        weight: Number(item.weight),
        reps: Number(item.reps),
        sets: Number(item.sets),
        time: item.time === '' ? '' : Number(item.time),
        speed: item.speed === '' ? '' : Number(item.speed),
        incline: item.incline === '' ? '' : Number(item.incline),
      }))

      setWorkoutRecords((records) => [...newRecords.reverse(), ...records])
      setDate('2026-10-09')
      setExercises([createEmptyExercise()])
      setShowForm(false)

      alert('トレーニング記録を登録しました！')
    } catch (error) {
      console.error('登録エラー:', error)
      alert('登録に失敗しました。ブラウザのコンソールとバックエンドのログを確認してください。')
    }
  }


  // 日付で検索する
  const handleSearch = () => {
    setAppliedSearchDate(searchDate.replaceAll('-', '/'))
  }

  // 検索条件に合う記録だけを表示する
  const filteredRecords = workoutRecords.filter((record) =>
    record.date.includes(appliedSearchDate)
  )
  // 選択した日付のトレーニング記録を取得
  const selectedRecords = workoutRecords.filter(
    (record) => record.date === selectedDate
  )

  return (
    <div className="app">
      {selectedDate ? (
        <div>
          <h2>{selectedDate} のトレーニング詳細</h2>

          <div className="detail-actions">
            <button
              type="button"
              className="detail-add-button"
              onClick={() => {
                setShowDetailForm(!showDetailForm)
                setDetailForm({
                  exercise: '',
                  weight: '',
                  reps: '',
                  sets: '',
                  time: '',
                  speed: '',
                  incline: '',
                })
              }}
            >
              {showDetailForm ? '追加フォームを閉じる' : '＋ トレーニングを追加'}
            </button>

            <button
              type="button"
              className="detail-back-button"
              onClick={() => setSelectedDate(null)}
            >
              一覧に戻る
            </button>
          </div>
          <div className="detail-content">

            {selectedRecords.map((record) => (
              <section className="record-card" key={record.id}>
                <h3>{record.exercise}</h3>

                <button
                  type="button"
                  onClick={() => {
                    setEditingId(record.id)
                    setEditForm({
                      exercise: record.exercise,
                      weight: record.weight,
                      reps: record.reps,
                      sets: record.sets,
                      time: record.time ?? '',
                      speed: record.speed ?? '',
                      incline: record.incline ?? '',
                    })
                  }}
                >
                  編集
                </button>


                {/* 👇 この位置に削除ボタンを追加！ */}
                <button
                  type="button"
                  onClick={async () => {
                    const confirmed = window.confirm(
                      `${record.exercise}の記録を削除しますか？`
                    )

                    if (confirmed) {
                      try {
                        const response = await fetch(
                          `https://fitnote.onrender.com/workout-details/${record.id}`,
                          {
                            method: 'DELETE',
                          }
                        )

                        if (!response.ok) {
                          throw new Error('削除に失敗しました')
                        }

                        setWorkoutRecords((records) =>
                          records.filter((item) => item.id !== record.id)
                        )

                        alert('トレーニング記録を削除しました！')
                      } catch (error) {
                        console.error('削除エラー:', error)
                        alert('削除に失敗しました。')
                      }
                    }
                  }}
                >
                  削除
                </button>
                {editingId === record.id && (
                  <div className="edit-form">
                    <label>
                      種目名
                      <input
                        type="text"
                        value={editForm.exercise}
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            exercise: event.target.value,
                          })
                        }
                      />
                    </label>

                    <label>
                      重量（kg）
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={editForm.weight}
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            weight: event.target.value,
                          })
                        }
                      />
                    </label>

                    <label>
                      回数
                      <input
                        type="number"
                        min="1"
                        value={editForm.reps}
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            reps: event.target.value,
                          })
                        }
                      />
                    </label>

                    <label>
                      セット数
                      <input
                        type="number"
                        min="1"
                        value={editForm.sets}
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            sets: event.target.value,
                          })
                        }
                      />
                    </label>

                    <label>
                      時間（分）
                      <input
                        type="number"
                        min="0"
                        value={editForm.time}
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            time: event.target.value,
                          })
                        }
                      />
                    </label>

                    <label>
                      速度（km/h）
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={editForm.speed}
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            speed: event.target.value,
                          })
                        }
                      />
                    </label>

                    <label>
                      傾斜（%）
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={editForm.incline}
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            incline: event.target.value,
                          })
                        }
                      />
                    </label>
                    <div className="edit-buttons">
                      <button
                        type="button"
                        onClick={handleEditSave}
                      >
                        変更を保存
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                )}

                <p>重量：{record.weight} kg</p>
                <p>回数：{record.reps} 回</p>
                <p>セット数：{record.sets} セット</p>

                {record.time !== '' && record.time !== undefined && (
                  <p>時間：{record.time} 分</p>
                )}

                {record.speed !== '' && record.speed !== undefined && (
                  <p>速度：{record.speed} km/h</p>
                )}

                {record.incline !== '' && record.incline !== undefined && (
                  <p>傾斜：{record.incline} %</p>
                )}
              </section>
            ))}
            {/* トレーニング追加フォーム */}
            {showDetailForm && (
              <form
                className="record-form detail-add-form"
                onSubmit={async (event) => {
                  event.preventDefault()

                  if (
                    !detailForm.exercise.trim() ||
                    detailForm.weight === '' ||
                    detailForm.reps === '' ||
                    detailForm.sets === ''
                  ) {
                    alert('種目名、重量、回数、セット数を入力してください。')
                    return
                  }

                  try {
                    // トレーニング日の一覧を取得
                    const recordResponse = await fetch(
                      'https://fitnote.onrender.com/workout-records'
                    )

                    if (!recordResponse.ok) {
                      throw new Error('トレーニング日の取得に失敗しました')
                    }

                    const records = await recordResponse.json()

                    // 選択した日付の記録を探す
                    const parentRecord = records.find(
                      (record) =>
                        String(record.workoutDate).replaceAll('-', '/') === selectedDate
                    )

                    if (!parentRecord) {
                      alert('トレーニング日が見つかりません。')
                      return
                    }

                    // 種目をデータベースに登録
                    const response = await fetch(
                      'https://fitnote.onrender.com/workout-details',
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          recordId: parentRecord.recordId,
                          exerciseId: null,
                          exerciseName: detailForm.exercise.trim(),
                          weight: Number(detailForm.weight),
                          reps: Number(detailForm.reps),
                          sets: Number(detailForm.sets),
                          time:
                            detailForm.time === ''
                              ? null
                              : Number(detailForm.time),
                          speed:
                            detailForm.speed === ''
                              ? null
                              : Number(detailForm.speed),
                          incline:
                            detailForm.incline === ''
                              ? null
                              : Number(detailForm.incline),
                        }),
                      }
                    )

                    if (!response.ok) {
                      throw new Error('トレーニング種目の登録に失敗しました')
                    }

                    const savedDetail = await response.json()

                    // 画面に登録内容を反映
                    const newRecord = {
                      id: savedDetail.detailId,
                      date: selectedDate,
                      exercise: savedDetail.exerciseName,
                      weight: savedDetail.weight,
                      reps: savedDetail.reps,
                      sets: savedDetail.sets,
                      time: savedDetail.time ?? '',
                      speed: savedDetail.speed ?? '',
                      incline: savedDetail.incline ?? '',
                    }

                    setWorkoutRecords((records) => [newRecord, ...records])

                    setDetailForm({
                      exercise: '',
                      weight: '',
                      reps: '',
                      sets: '',
                      time: '',
                      speed: '',
                      incline: '',
                    })

                    setShowDetailForm(false)
                    alert('トレーニング記録を追加しました！')
                  } catch (error) {
                    console.error('追加エラー:', error)
                    alert('登録に失敗しました。バックエンドのログを確認してください。')
                  }
                }}
              >
                <h3>トレーニングを追加</h3>

                <label>
                  種目名
                  <input
                    type="text"
                    value={detailForm.exercise}
                    onChange={(event) =>
                      setDetailForm({ ...detailForm, exercise: event.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  重量（kg）
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={detailForm.weight}
                    onChange={(event) =>
                      setDetailForm({ ...detailForm, weight: event.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  回数
                  <input
                    type="number"
                    min="1"
                    value={detailForm.reps}
                    onChange={(event) =>
                      setDetailForm({ ...detailForm, reps: event.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  セット数
                  <input
                    type="number"
                    min="1"
                    value={detailForm.sets}
                    onChange={(event) =>
                      setDetailForm({ ...detailForm, sets: event.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  時間（分）
                  <input
                    type="number"
                    min="0"
                    value={detailForm.time}
                    onChange={(event) =>
                      setDetailForm({ ...detailForm, time: event.target.value })
                    }
                  />
                </label>

                <label>
                  速度（km/h）
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={detailForm.speed}
                    onChange={(event) =>
                      setDetailForm({ ...detailForm, speed: event.target.value })
                    }
                  />
                </label>

                <label>
                  傾斜（%）
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={detailForm.incline}
                    onChange={(event) =>
                      setDetailForm({ ...detailForm, incline: event.target.value })
                    }
                  />
                </label>

                <button type="submit" className="add-button">
                  登録する
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <>
          <header className="header">
            <h1>Fitノート</h1>
            <p>トレーニング記録を管理しよう！</p>
          </header>

          <main className="main">
            <div className="actions">
              <input
                type="date"
                value={searchDate}
                onChange={(event) => setSearchDate(event.target.value)}
                aria-label="検索するトレーニング日"
              />

              <button
                type="button"
                className="search-button"
                onClick={handleSearch}
              >
                検索
              </button>

              <button
                type="button"
                className="add-button"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? '登録フォームを閉じる' : '＋ トレーニングを登録'}
              </button>
            </div>

            {showForm && (
              <form className="record-form" onSubmit={handleRegister}>
                <h2>トレーニングを登録</h2>

                <label>
                  トレーニング日
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                  />
                </label>

                {exercises.map((item, index) => (
                  <div className="exercise-form" key={index}>
                    <h3>{index + 1}種目目</h3>

                    <label>
                      種目名
                      <input
                        type="text"
                        placeholder="例：ベンチプレス"
                        value={item.exercise}
                        onChange={(event) =>
                          setExercises((current) =>
                            current.map((exercise, i) =>
                              i === index
                                ? { ...exercise, exercise: event.target.value }
                                : exercise
                            )
                          )
                        }
                        required
                      />
                    </label>

                    <label>
                      重量（kg）
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={item.weight}
                        onChange={(event) =>
                          setExercises((current) =>
                            current.map((exercise, i) =>
                              i === index
                                ? { ...exercise, weight: event.target.value }
                                : exercise
                            )
                          )
                        }
                        required
                      />
                    </label>

                    <label>
                      回数
                      <input
                        type="number"
                        min="1"
                        value={item.reps}
                        onChange={(event) =>
                          setExercises((current) =>
                            current.map((exercise, i) =>
                              i === index
                                ? { ...exercise, reps: event.target.value }
                                : exercise
                            )
                          )
                        }
                        required
                      />
                    </label>

                    <label>
                      セット数
                      <input
                        type="number"
                        min="1"
                        value={item.sets}
                        onChange={(event) =>
                          setExercises((current) =>
                            current.map((exercise, i) =>
                              i === index
                                ? { ...exercise, sets: event.target.value }
                                : exercise
                            )
                          )
                        }
                        required
                      />
                    </label>

                    <label>
                      時間（分）
                      <input
                        type="number"
                        min="0"
                        value={item.time}
                        onChange={(event) =>
                          setExercises((current) =>
                            current.map((exercise, i) =>
                              i === index
                                ? { ...exercise, time: event.target.value }
                                : exercise
                            )
                          )
                        }
                        placeholder="例：30"
                      />
                    </label>

                    <label>
                      速度（km/h）
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={item.speed}
                        onChange={(event) =>
                          setExercises((current) =>
                            current.map((exercise, i) =>
                              i === index
                                ? { ...exercise, speed: event.target.value }
                                : exercise
                            )
                          )
                        }
                        placeholder="例：5.5"
                      />
                    </label>

                    <label>
                      傾斜（%）
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={item.incline}
                        onChange={(event) =>
                          setExercises((current) =>
                            current.map((exercise, i) =>
                              i === index
                                ? { ...exercise, incline: event.target.value }
                                : exercise
                            )
                          )
                        }
                        placeholder="例：5"
                      />
                    </label>

                    {exercises.length > 1 && (
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() =>
                          setExercises((current) =>
                            current.filter((_, i) => i !== index)
                          )
                        }
                      >
                        この種目を削除
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="add-exercise-button"
                  onClick={() =>
                    setExercises((current) => [
                      ...current,
                      createEmptyExercise(),
                    ])
                  }
                >
                  ＋ トレーニングを追加
                </button>

                <button type="submit" className="add-button">
                  登録する
                </button>
              </form>
            )}

            {!showForm && (
              <>
                <h2>トレーニング記録一覧</h2>

                {filteredRecords.length > 0 ? (
                  Object.entries(
                    filteredRecords.reduce((groups, record) => {
                      if (!groups[record.date]) {
                        groups[record.date] = []
                      }

                      groups[record.date].push(record)

                      return groups
                    }, {})
                  )
                    .sort((a, b) => b[0].localeCompare(a[0]))
                    .map(([date, records]) => (
                      <section
                        className="record-card"
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        style={{ cursor: 'pointer' }}
                      >
                        <h3>{date}</h3>
                        {records.map((record) => (
                          <div className="exercise-record" key={record.id}>
                            <p>種目：{record.exercise}</p>

                            <p>
                              重量：{record.weight} kg ／
                              回数：{record.reps} 回 ／
                              セット数：{record.sets} セット
                            </p>

                            {record.time !== '' &&
                              record.time !== undefined && (
                                <p>時間：{record.time} 分</p>
                              )}

                            {record.speed !== '' &&
                              record.speed !== undefined && (
                                <p>速度：{record.speed} km/h</p>
                              )}

                            {record.incline !== '' &&
                              record.incline !== undefined && (
                                <p>傾斜：{record.incline} %</p>
                              )}
                          </div>
                        ))}
                      </section>
                    ))
                ) : (
                  <p>該当するトレーニング記録はありません。</p>
                )}

              </>
            )}
          </main>
        </>
      )}
    </div>
  )
}

export default App