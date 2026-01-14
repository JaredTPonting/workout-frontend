import { useEffect, useState } from "react";
import { getExercises, postExercise, deleteExercise, putExercise } from "../services/api";
import "../css/CreateExercise.css";

interface Exercise {
    id: number;
    name: string;
}

const CreateExercise = () => {
    const [exerciseName, setExerciseName] = useState("");
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [editing, setEditing] = useState<Exercise | null>(null);
    const [editName, setEditName] = useState("");

    const fetchExercises = async () => {
        const data = await getExercises();
        const sorted = [...data].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
        setExercises(sorted);
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    const handleSubmit = async () => {
        if (!exerciseName.trim()) return;
        await postExercise({ name: exerciseName });
        setExerciseName("");
        fetchExercises();
    };

    const handleDelete = async (exerciseId: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this exercise? This can not be undone."
        );

        if (!confirmed) return;

        await deleteExercise(exerciseId);
        fetchExercises();
    }

    const openEdit = (exercise: Exercise) => {
        setEditing(exercise);
        setEditName(exercise.name);
    }

    const handleEditSave = async () => {
        if (!editing || !editName.trim()) return;

        await putExercise(editing.id, { name: editName });
        setEditing(null);
        fetchExercises();
    }

    return (
        <div className="create-exercise-container">
            <h2>Add New Exercise</h2>

            <div className="input-row">
                <input
                    type="text"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    placeholder="Exercise name"
                />
                <button onClick={handleSubmit}>Add</button>
            </div>

            <h3>Exercises</h3>
            <ul className="exercise-list">
                {exercises.map((exercise) => (
                    <li key={exercise.id} className="exercise-item" onClick={() => openEdit(exercise)}>
                        <span>{exercise.name}</span>
                        <button
                            className="delete-btn"
                            onClick={() => handleDelete(exercise.id)}
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
            {editing && (
                <div className="modal-backdrop" onClick={() => setEditing(null)}>
                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Edit Exercise</h3>

                        <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            autoFocus
                        />

                        <div className="modal-actions">
                            <button onClick={() => setEditing(null)}>
                                Cancel
                            </button>
                            <button onClick={handleEditSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateExercise;
