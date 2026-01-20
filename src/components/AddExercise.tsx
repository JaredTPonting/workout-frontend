import React, { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { postExercise } from "../services/api";

interface Exercise {
    id: number;
    name: string;
}

interface AddExerciseProps {
    onAdd: (exercise: Exercise) => void;
}

const AddExercise: React.FC<AddExerciseProps> = ({ onAdd }) => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        setLoading(true);
        try {
            const newExercise = await postExercise({ name });
            onAdd(newExercise);
            setName("");
        } catch (err) {
            console.error(err);
            alert("Error adding exercise");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card" style={{ display: "flex", gap: "0.75rem" }}>
            <input
                type="text"
                placeholder="Quick add exercise..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ flex: 1 }}
            />
            <button
                type="submit"
                disabled={loading}
                className="btn-icon"
                style={{
                    background: "var(--gradient-blue)",
                    border: "none",
                    minWidth: "140px",
                    opacity: loading ? 0.7 : 1,
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={18} className="spin" />
                        Adding...
                    </>
                ) : (
                    <>
                        <Plus size={18} />
                        Add Exercise
                    </>
                )}
            </button>
        </form>
    );
};

export default AddExercise;
