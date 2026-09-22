import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserListPage from "./UserListPage";
import { deleteUser, getUsers } from "../services/userApi";

jest.mock("../services/userApi", () => ({
    deleteUser: jest.fn(),
    getUsers: jest.fn()
}));

const users = [
    {
        id: 1,
        name: "Jane Doe",
        age: 30,
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001"
    }
];

beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn();
});

test("loads and displays users", async () => {
    getUsers.mockResolvedValue(users);

    render(
        <MemoryRouter>
            <UserListPage />
        </MemoryRouter>
    );

    expect(screen.getByText("Loading users...")).toBeInTheDocument();
    expect(await screen.findByRole("cell", { name: "Jane Doe" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "411001" })).toBeInTheDocument();
});

test("deletes a confirmed user", async () => {
    getUsers.mockResolvedValue(users);
    deleteUser.mockResolvedValue(undefined);
    window.confirm.mockReturnValue(true);

    render(
        <MemoryRouter>
            <UserListPage />
        </MemoryRouter>
    );

    await screen.findByRole("cell", { name: "Jane Doe" });
    fireEvent.click(screen.getByRole("button", { name: "Delete Jane Doe" }));

    await waitFor(() => expect(deleteUser).toHaveBeenCalledWith(1));
    expect(await screen.findByText(/No users available/)).toBeInTheDocument();
});

test("shows a loading error when users cannot be fetched", async () => {
    getUsers.mockRejectedValue(new Error("Network unavailable"));

    render(
        <MemoryRouter>
            <UserListPage />
        </MemoryRouter>
    );

    expect(await screen.findByText("Error: Network unavailable")).toBeInTheDocument();
});