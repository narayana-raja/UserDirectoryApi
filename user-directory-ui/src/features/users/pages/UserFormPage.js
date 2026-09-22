import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createUser, updateUser } from "../services/userApi";

function UserFormPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const editingUser = location.state?.user;
    const isEditMode = !!editingUser;

    const [form, setForm] = useState({
        name: editingUser?.name || "",
        age: editingUser?.age ?? "",
        city: editingUser?.city || "",
        state: editingUser?.state || "",
        pincode: editingUser?.pincode || ""
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

        // Clear field error when user starts correcting it
        setErrors({
            ...errors,
            [name]: ""
        });
    }

    function validate() {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = "Name is required";
        } else if (
            form.name.trim().length < 2 ||
            form.name.trim().length > 100
        ) {
            newErrors.name = "Name must be between 2 and 100 characters";
        }

        if (form.age === "") {
            newErrors.age = "Age is required";
        } else if (form.age < 0 || form.age > 120) {
            newErrors.age = "Age must be between 0 and 120";
        } else if (!Number.isInteger(Number(form.age))) {
            newErrors.age = "Age must be an integer";
        }

        if (!form.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!form.state.trim()) {
            newErrors.state = "State is required";
        }

        if (!form.pincode) {
            newErrors.pincode = "Pincode is required";
        } else if (!/^\d{6}$/.test(form.pincode)) {
            newErrors.pincode = "Pincode must be exactly 6 digits";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function hasChanges() {
        if (!editingUser) {
            return true;
        }

        return (
            form.name !== editingUser.name ||
            Number(form.age) !== editingUser.age ||
            form.city !== editingUser.city ||
            form.state !== editingUser.state ||
            form.pincode !== editingUser.pincode
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setMessage("");

        if (!validate()) {
            return;
        }

        try {
            setSaving(true);

            if (isEditMode) {
                await updateUser(editingUser.id, form);
                setMessage("User updated successfully");
            } else {
                await createUser(form);
                setMessage("User added successfully");
            }

            setTimeout(() => {
                navigate("/users");
            }, 1000);

        } catch (error) {
            setMessage(
                isEditMode
                    ? "Failed to update user"
                    : "Failed to add user"
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="page">

            <h1>{isEditMode ? "Edit User" : "Add User"}</h1>

            <form onSubmit={handleSubmit}>

                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                {errors.name && (
                    <span className="error">{errors.name}</span>
                )}

                <label>Age:</label>
                <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    required
                />
                {errors.age && (
                    <span className="error">{errors.age}</span>
                )}

                <label>City:</label>
                <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                />
                {errors.city && (
                    <span className="error">{errors.city}</span>
                )}

                <label>State:</label>
                <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                />
                {errors.state && (
                    <span className="error">{errors.state}</span>
                )}

                <label>Pincode:</label>
                <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    maxLength={6}
                    inputMode="numeric"
                    onChange={(e) => {
                        const value = e.target.value;

                        if (/^\d{0,6}$/.test(value)) {
                            handleChange(e);
                        }
                    }}
                    required
                />
                {errors.pincode && (
                    <span className="error">{errors.pincode}</span>
                )}

                <div className="form-buttons">

                    <button
                        type="button"
                        onClick={() => navigate("/users")}
                    >
                        View Users
                    </button>

                    <button
                        type="submit"
                        disabled={saving || (isEditMode && !hasChanges())}
                    >
                        {saving
                            ? "Saving..."
                            : isEditMode
                                ? "Update User"
                                : "Add User"}
                    </button>

                </div>

                {message && (
                    <p className="success">{message}</p>
                )}

            </form>
        </div>
    );
}

export default UserFormPage;