import React, { useEffect } from "react";
import { getUsers,deleteUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
function UserList(){
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
                <table>
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
                            <td>
                                <button onClick={()=>navigate("/add-user",{state:{user}})}>Edit</button>
                                <button onClick={()=>handleDelete(user.id)}>Delete</button>                                
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )} 
        </div>
    );
}
export default UserList;