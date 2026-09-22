import React, { useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { deleteUser, getUsers } from "../services/userApi";
import { useNavigate } from "react-router-dom";

function UserListPage() {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            setError(error.message);
        }finally {
            setLoading(false);
        }
    }
    if (loading) {
        return <p>Loading users...</p>;
    }

    if(error) {
        return <p>Error: {error}</p>;
    }

    async function handleDelete(id) {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) {
            return;
        }

        try {
            await deleteUser(id);
            setUsers(users.filter((user) => user.id !== id));
        } catch (error) {
            setError("Failed to delete user");
        }
    }

    return(
        <div className="page">
            <h1>User List</h1>
            {users.length === 0 ? ( 
                <p> No users available. </p>
            ) : (
                <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                             <th>Name</th>
                            <th>Age</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Pincode</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.age}</td>
                                <td>{user.city}</td>
                                <td>{user.state}</td>
                                <td>{user.pincode}</td>
                                <td className="table-actions">
                                    <button
                                        className="icon-button edit-button"
                                        type="button"
                                        aria-label={`Edit ${user.name}`}
                                        title={`Edit ${user.name}`}
                                        onClick={() => navigate("/add-user", { state: { user } })}
                                    >
                                        <Pencil size={16} aria-hidden="true" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        className="icon-button delete-button"
                                        type="button"
                                        aria-label={`Delete ${user.name}`}
                                        title={`Delete ${user.name}`}
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        <Trash2 size={16} aria-hidden="true" />
                                        <span>Delete</span>
                                    </button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            )} 
        </div>
    );
}
export default UserListPage;