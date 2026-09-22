import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddUser from "./AddUser";
import { createUser, updateUser } from "../services/userService";

jest.mock("../services/userService", () => ({
    createUser: jest.fn(),
    updateUser: jest.fn()
}));

const validUser = {
    name: "Jane Doe",
    age: "30",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001"
};

function renderAddUser(initialEntries = ["/add-user"]) {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <AddUser />
        </MemoryRouter>
    );
}

function fillForm(user = validUser) {
    fireEvent.change(screen.getAllByRole("textbox")[0], {
        target: { name: "name", value: user.name }
    });
    fireEvent.change(screen.getByRole("spinbutton"), {
        target: { name: "age", value: user.age }
    });
    fireEvent.change(screen.getAllByRole("textbox")[1], {
        target: { name: "city", value: user.city }
    });
    fireEvent.change(screen.getAllByRole("textbox")[2], {
        target: { name: "state", value: user.state }
    });
    fireEvent.change(screen.getAllByRole("textbox")[3], {
        target: { name: "pincode", value: user.pincode }
    });
}

beforeEach(() => {
    jest.clearAllMocks();
});

test("shows validation messages and does not create an incomplete user", () => {
    renderAddUser();

    fireEvent.click(screen.getByRole("button", { name: "Add User" }));

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Age is required")).toBeInTheDocument();
    expect(screen.getByText("City is required")).toBeInTheDocument();
    expect(screen.getByText("State is required")).toBeInTheDocument();
    expect(screen.getByText("Pincode is required")).toBeInTheDocument();
    expect(createUser).not.toHaveBeenCalled();
});

test("creates a valid user and shows a success message", async () => {
    createUser.mockResolvedValue({ id: 1, ...validUser });
    renderAddUser();

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Add User" }));

    await waitFor(() => expect(createUser).toHaveBeenCalledWith(validUser));
    expect(await screen.findByText("User added successfully")).toBeInTheDocument();
});

test("loads edit values and updates when a field changes", async () => {
    const existingUser = { id: 7, ...validUser, age: 29 };
    updateUser.mockResolvedValue(undefined);
    renderAddUser([{ pathname: "/add-user", state: { user: existingUser } }]);

    expect(screen.getByRole("heading", { name: "Edit User" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update User" })).toBeDisabled();

    fireEvent.change(screen.getByRole("spinbutton"), {
        target: { name: "age", value: "30" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Update User" }));

    await waitFor(() =>
        expect(updateUser).toHaveBeenCalledWith(7, { ...validUser, age: "30" })
    );
    expect(await screen.findByText("User updated successfully")).toBeInTheDocument();
});