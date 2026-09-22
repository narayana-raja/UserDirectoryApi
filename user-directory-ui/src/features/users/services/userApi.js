
import apiClient from "../../../shared/http/apiClient";

export async function getUsers() {
    try {
        const response = await apiClient.get("/users");
        return response.data;
    } catch {
        throw new Error("Failed to fetch users");
    }
}

export async function createUser(user) {
    try {
        const response = await apiClient.post("/users", user);
        return response.data;
    } catch {
        throw new Error("Failed to create user");
    }           
}

export async function updateUser(id, user) {
    try {
        await apiClient.put(`/users/${id}`, user);
    } catch {
        throw new Error("Failed to update user");
    }
}

export async function deleteUser(id) {
    try {
        await apiClient.delete(`/users/${id}`);
    } catch {
        throw new Error("Failed to delete user");
    }
}