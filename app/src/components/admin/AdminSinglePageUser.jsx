import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Spinner } from "@material-tailwind/react";

export function AdminSinglePageUser() {
    const { id } = useParams();
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/users/${id}`);
                setSelectedUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching the user:", error);
                setError('Could not fetch the user.');
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);
    

    return (
        <>
            {loading ? (
                <div className='flex flex-col items-center justify-center min-h-screen'>
                    <Spinner className="h-20 w-20" color="purple" />
                </div>
            ) : (
                <div>
                    <Typography variant="h4">User Details</Typography>
                    <Typography>ID: {selectedUser._id || 'N/A'}</Typography>
                    <Typography>First Name: {selectedUser.firstName || 'N/A'}</Typography>
                    <Typography>Last Name: {selectedUser.lastName || 'N/A'}</Typography>
                    <Typography>Email: {selectedUser.email || 'N/A'}</Typography>
                    <Typography>Role: {selectedUser.role || 'N/A'}</Typography>
                </div>
            )}
        </>
    );
}
