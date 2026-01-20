import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Trash2 } from "lucide-react";
import {
    getWorkoutByDate,
    getExercises,
    getSetsByWorkout,
    deleteSet,
} from "../services/api";

import "../css/workoutSummary.css";

interface WorkoutSet {
    id: number;
    exercise_id: number;
    reps: number;
    weight: number;
    unit: string;
}

interface Workout {
    id: number;
    date: string;
}

const WorkoutSummaryPage = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState(
        new Date().toISOString().slice(0, 10)
    );

    const [workout, setWorkout] = useState<Workout | null>(null);
    const [sets, setSets] = useState<WorkoutSet[]>([]);
    const [exercises, setExercises] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getExercises()
            .then(setExercises)
            .catch(() => setExercises([]));
    }, []);

    const handleDeleteSet = async (setId: number) => {
        if (!window.confirm("Delete this set?")) return;

        await deleteSet(setId);
        setSets((prev) => prev.filter((s) => s.id !== setId))
    }

    const loadWorkout = async () => {
        setLoading(true);
        setError(null);
        setWorkout(null);
        setSets([]);

        try {
            const workoutData = await getWorkoutByDate(date);

            if (!workoutData) {
                setWorkout(null);
                return;
            }

            setWorkout(workoutData);

            const setsData = await getSetsByWorkout(workoutData.id);
            setSets(setsData ?? []);
        } catch {
            setError("Failed to load workout.");
        } finally {
            setLoading(false);
        }
    };

    const exerciseName = (id: number) =>
        exercises.find((e) => e.id === id)?.name ?? "Unknown exercise";

    const groupedSets = sets.reduce<Record<number, WorkoutSet[]>>(
        (acc, set) => {
            acc[set.exercise_id] ??= [];
            acc[set.exercise_id].push(set);
            return acc;
        },
        {}
    );

    return (
        <div className="workout-summary-container">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate("/")}>
                    <ArrowLeft size={20} />
                </button>
                <h2>Workout Summary</h2>
                <div style={{ width: 36 }} />
            </div>

            <div className="date-picker-section">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button onClick={loadWorkout}>
                    <Search size={18} />
                    View Workout
                </button>
            </div>

            {loading && <p className="status-message">Loading...</p>}

            {error && <p className="error-message">{error}</p>}

            {!loading && !workout && !error && (
                <p className="status-message">No workout logged for this date.</p>
            )}

            {workout && (
                <div>
                    <p className="workout-date-title">
                        Workout on <span>{workout.date}</span>
                    </p>

                    {sets.length === 0 && (
                        <p className="status-message">No sets logged for this workout.</p>
                    )}

                    {Object.entries(groupedSets).map(([exerciseId, sets]) => (
                        <div key={exerciseId} className="exercise-card">
                            <h4>{exerciseName(Number(exerciseId))}</h4>

                            {sets.map((s, i) => (
                                <div key={s.id} className="set-row">
                                    <span>
                                        Set {i + 1}: <strong>{s.reps} reps</strong> × <strong>{s.weight} {s.unit}</strong>
                                    </span>
                                    <button
                                        className="set-delete"
                                        onClick={() => handleDeleteSet(s.id)}
                                        aria-label="Delete set"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkoutSummaryPage;
