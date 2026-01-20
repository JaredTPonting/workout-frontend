const BASE_URL = import.meta.env.VITE_API_URL;

// Helper to get the token from localStorage
const getAuthToken = (): string | null => {
    return localStorage.getItem("auth_token");
};

export const apiFetch = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-API-Key": import.meta.env.VITE_API_KEY,
        ...(options.headers as Record<string, string>),
    };

    // Add Authorization header if token exists
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(BASE_URL + url, { ...options, headers });

    if (res.status === 204) return null;
    if (res.status === 404) return null;

    // Handle unauthorized - could trigger logout
    if (res.status === 401) {
        // Clear invalid token
        localStorage.removeItem("auth_token");
        throw new Error("Unauthorized - please log in again");
    }

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `API error: ${res.status}`);
    }

    return res.json();
};

// exercises
export const getExercises = () => apiFetch("exercises/");
export const getExerciseById = (id: number) => apiFetch(`exercises/${id}/`);
export const postExercise = (data: { name: string }) =>
    apiFetch("exercises/", { method: "POST", body: JSON.stringify(data) });

export const deleteExercise = (exerciseId: number) =>
    apiFetch(`exercises/${exerciseId}`, { method: "DELETE" });

export const putExercise = (id: number, data: { name: string }) =>
    apiFetch(`exercises/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

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
}) => apiFetch("sets/", { method: "POST", body: JSON.stringify(data) });
export const deleteSet = (id: number) =>
    apiFetch(`sets/${id}/`, { method: "DELETE" });
