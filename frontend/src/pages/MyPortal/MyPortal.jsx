import React, { useEffect, useState } from "react";

export const MyPortal = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://44.223.36.86:8080/api/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Error loading users");
      });
  }, []);

  return (
    <div>
      <h2>My Portal</h2>

      {error && <p>{error}</p>}

      {users.length === 0 && !error && <p>Loading users...</p>}

      {users.map((user) => (
        <div key={user.id} style={{ marginBottom: "10px" }}>
          <strong>{user.firstName} {user.lastName}</strong>
          <div>Email: {user.email}</div>
          <div>Role: {user.role}</div>
        </div>
      ))}
    </div>
  );
};