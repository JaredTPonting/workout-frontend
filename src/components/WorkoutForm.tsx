import {useEffect, useState} from "react";
import {getExercises, getWorkoutByDate, postSet,} from "../services/api";
import {WeightUnit} from "../types";
import "../css/workoutLog.css";

interface SetData {
    exerciseId: number;
    reps: number | "";
    weight: number | "";
    unit: WeightUnit;
}

const WorkoutForm = () => {
    const [date, setDate] = useState(
        new Date().toISOString().slice(0, 10)
    );
    const [exercises, setExercises] = useState<{ id: number; name: string }[]>([]);
    const [sets, setSets] = useState<SetData[]>([]);
    const [existingSets, setExistingSets] = useState<SetData[]>([]);

    // Load exercises on mount
    useEffect(() => {
        getExercises().then((data) => {
            const sorted = [...data].sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            setExercises(sorted);
        });
    }, []);

    // Load workout sets for the selected date
    useEffect(() => {
        getWorkoutByDate(date)
            .then((workout: any) => {
                if (workout?.sets) {
                    const formattedSets = workout.sets.map((s: any) => ({
                        exerciseId: s.exercise_id,
                        reps: s.reps,
                        weight: s.weight,
                        unit: s.unit,
                    }));
                    setExistingSets(formattedSets);
                } else {
                    setExistingSets([]);
                }
            })
            .catch(() => setExistingSets([]));
    }, [date]);

    const addSet = () => {
        if (exercises.length === 0) return;

        setSets([
            ...sets,
            {
                exerciseId: exercises[0].id,
                reps: "",
                weight: "",
                unit: WeightUnit.KG,
            },
        ]);
    };

    const handleChange = (
        index: number,
        field: keyof SetData,
        value: string | WeightUnit | number
    ) => {
        const newSets = [...sets];
        newSets[index] = { ...newSets[index], [field]: value };
        setSets(newSets);
    };

    const handleSubmit = async () => {
        if (sets.length === 0) return;

        try {
            for (const s of sets) {
                await postSet({
                    exercise_id: s.exerciseId,
                    reps: Number(s.reps),
                    weight: Number(s.weight),
                    unit: s.unit,
                    date,
                });
            }
            alert("Workout submitted");
            setSets([]);

            // Refresh existing sets
            getWorkoutByDate(date).then((workout: any) => {
                if (workout?.sets) {
                    const formattedSets = workout.sets.map((s: any) => ({
                        exerciseId: s.exercise_id,
                        reps: s.reps,
                        weight: s.weight,
                        unit: s.unit,
                    }));
                    setExistingSets(formattedSets);
                }
            });
        } catch (e) {
            console.error(e);
            alert("Error submitting workout");
        }
    };

    return (
        <div className="workout-log-container">
            <h2>Log Workout</h2>

            <div style={{ marginBottom: "1rem" }}>
                <label>
                    Date:{" "}
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </label>
            </div>

            {/* Existing Sets */}
            {existingSets.length > 0 && (
                <>
                    <h3>Existing Sets for {date}</h3>
                    {existingSets.map((s, i) => (
                        <div key={i} className="existing-set">
                            {exercises.find((ex) => ex.id === s.exerciseId)?.name || "Exercise"}:{" "}
                            {s.reps} reps x {s.weight} {s.unit}
                        </div>
                    ))}
                </>
            )}

            {/* Column labels */}
            {sets.length > 0 && (
                <div className="set-grid" style={{ fontWeight: "bold" }}>
                    <span>Exercise</span>
                    <span>Reps</span>
                    <span>Weight</span>
                    <span>Unit</span>
                </div>
            )}

            {/* Set rows */}
            {sets.map((set, i) => (
                <div key={i} className="set-grid">
                    <select
                        value={set.exerciseId}
                        onChange={(e) =>
                            handleChange(i, "exerciseId", Number(e.target.value))
                        }
                    >
                        {exercises.map((ex) => (
                            <option key={ex.id} value={ex.id}>
                                {ex.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => handleChange(i, "reps", e.target.value)}
                        min={0}
                    />

                    <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => handleChange(i, "weight", e.target.value)}
                        min={0}
                    />

                    <select
                        value={set.unit}
                        onChange={(e) =>
                            handleChange(i, "unit", e.target.value as WeightUnit)
                        }
                    >
                        <option value={WeightUnit.KG}>kg</option>
                        <option value={WeightUnit.LBS}>lbs</option>
                    </select>
                </div>
            ))}

            {/* Actions */}
            <div style={{ marginTop: "1rem" }}>
                <button onClick={addSet}>Add Set</button>
                <button onClick={handleSubmit} style={{ marginLeft: "1rem" }}>
                    Submit Workout
                </button>
            </div>
        </div>
    );

};

export default WorkoutForm;
