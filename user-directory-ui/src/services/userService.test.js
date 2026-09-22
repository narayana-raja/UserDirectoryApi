import { createUser, deleteUser, getUsers, updateUser } from "./userService";

const apiUrl = "https://localhost:7146/api/users";

beforeEach(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    jest.restoreAllMocks();
});

test("gets users from the API", async () => {
    const users = [{ id: 1, name: "Jane Doe" }];
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue(users) });

    await expect(getUsers()).resolves.toEqual(users);
    expect(fetch).toHaveBeenCalledWith(apiUrl);
});

test("creates a user with a JSON POST request", async () => {
    const user = { name: "Jane Doe", age: "30" };
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue({ id: 1, ...user }) });

    await createUser(user);

    expect(fetch).toHaveBeenCalledWith(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });
});

test("updates and deletes a user", async () => {
    const user = { name: "Jane Doe" };
    fetch.mockResolvedValue({ ok: true });

    await updateUser(4, user);
    await deleteUser(4);

    expect(fetch).toHaveBeenNthCalledWith(1, `${apiUrl}/4`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });
    expect(fetch).toHaveBeenNthCalledWith(2, `${apiUrl}/4`, {
        method: "DELETE"
    });
});

test("rejects when the API returns an unsuccessful response", async () => {
    fetch.mockResolvedValue({ ok: false });

    await expect(getUsers()).rejects.toThrow("Failed to fetch users");
    await expect(createUser({})).rejects.toThrow("Failed to create user");
    await expect(updateUser(1, {})).rejects.toThrow("Failed to update user");
    await expect(deleteUser(1)).rejects.toThrow("Failed to delete user");
});