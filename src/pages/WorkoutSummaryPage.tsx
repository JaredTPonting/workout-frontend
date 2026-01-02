import { useEffect, useState } from "react";
import {
    getWorkoutByDate,
    getExercises,
    getSetsByWorkout,
} from "../services/api";



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
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
            <h2>Workout Summary</h2>

            <div style={{ marginBottom: "1rem" }}>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button onClick={loadWorkout} style={{ marginLeft: "1rem" }}>
                    View Workout
                </button>
            </div>

            {loading && <p>Loading...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !workout && !error && (
                <p>No workout logged for this date.</p>
            )}

            {workout && (
                <div>
                    <h3>Workout on {workout.date}</h3>

                    {sets.length === 0 && (
                        <p>No sets logged for this workout.</p>
                    )}

                    {Object.entries(groupedSets).map(([exerciseId, sets]) => (
                        <div
                            key={exerciseId}
                            style={{
                                marginBottom: "1.5rem",
                                padding: "1rem",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                            }}
                        >
                            <h4>{exerciseName(Number(exerciseId))}</h4>

                            {sets.map((s, i) => (
                                <div key={s.id}>
                                    Set {i + 1}: {s.reps} reps × {s.weight}{" "}
                                    {s.unit}
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
