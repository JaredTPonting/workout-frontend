import React, { useState } from "react";
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
    onAdd(newExercise); // Notify parent
    setName("");
  } catch (err) {
    console.error(err);
    alert("Error adding exercise");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "16px" }}>
      <input
        type="text"
        placeholder="New exercise name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Exercise"}
      </button>
    </form>
  );
};

export default AddExercise;
