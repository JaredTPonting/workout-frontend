const BASE_URL = "http://localhost:8000/";

export const apiFetch = async (url: string, options: any = {}) => {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    const res = await fetch(BASE_URL + url, { ...options, headers });

    if (res.status === 204) return null;
    if (res.status === 404) return null;

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    return res.json();
};

// exercises
export const getExercises = () => apiFetch("exercises/");
export const getExerciseById = (id: number) => apiFetch(`exercises/${id}/`);
export const postExercise = (data: { name: string }) =>
    apiFetch("exercises/", { method: "POST", body: JSON.stringify(data) });

// workouts
export const getWorkouts = () => apiFetch("workouts/");
export const getWorkoutById = (id: number) => apiFetch(`workouts/${id}/`);
export const getWorkoutByDate = (date: string) =>
    apiFetch(`workouts/by-date/${date}/`);
export const postWorkout = (data: { date?: string }) =>
    apiFetch("workouts/", { method: "POST", body: JSON.stringify(data) });

// sets
export const getSetsByWorkout = (workout_id: number) =>
    apiFetch(`sets/by-workout/${workout_id}/`);
export const getSetsByExercise = (exercise_id: number) =>
    apiFetch(`sets/by-exercise/${exercise_id}/`);
export const postSet = (data: {
    exercise_id: number;
    reps: number;
    weight: number;
    unit: "kg" | "lbs";
    date?: string;
}) =>
    apiFetch("sets/", { method: "POST", body: JSON.stringify(data) });
export const deleteSet = (id: number) =>
    apiFetch(`sets/${id}/`, { method: "DELETE" });
