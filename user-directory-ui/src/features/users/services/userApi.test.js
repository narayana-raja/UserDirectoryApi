import { createUser, deleteUser, getUsers, updateUser } from "./userApi";
import apiClient from "../../../shared/http/apiClient";

jest.mock("../../../shared/http/apiClient", () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
}));

beforeEach(() => {
    jest.clearAllMocks();
});

test("gets users from the API", async () => {
    const users = [{ id: 1, name: "Jane Doe" }];
    apiClient.get.mockResolvedValue({ data: users });

    await expect(getUsers()).resolves.toEqual(users);
    expect(apiClient.get).toHaveBeenCalledWith("/users");
});

test("creates a user with a JSON POST request", async () => {
    const user = { name: "Jane Doe", age: "30" };
    apiClient.post.mockResolvedValue({ data: { id: 1, ...user } });

    await createUser(user);

    expect(apiClient.post).toHaveBeenCalledWith("/users", user);
});

test("updates and deletes a user", async () => {
    const user = { name: "Jane Doe" };
    apiClient.put.mockResolvedValue({});
    apiClient.delete.mockResolvedValue({});

    await updateUser(4, user);
    await deleteUser(4);

    expect(apiClient.put).toHaveBeenCalledWith("/users/4", user);
    expect(apiClient.delete).toHaveBeenCalledWith("/users/4");
});

test("rejects when the API returns an unsuccessful response", async () => {
    apiClient.get.mockRejectedValue(new Error("Request failed"));
    apiClient.post.mockRejectedValue(new Error("Request failed"));
    apiClient.put.mockRejectedValue(new Error("Request failed"));
    apiClient.delete.mockRejectedValue(new Error("Request failed"));

    await expect(getUsers()).rejects.toThrow("Failed to fetch users");
    await expect(createUser({})).rejects.toThrow("Failed to create user");
    await expect(updateUser(1, {})).rejects.toThrow("Failed to update user");
    await expect(deleteUser(1)).rejects.toThrow("Failed to delete user");
});