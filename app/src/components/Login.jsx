import React, { useState } from "react";

import { Link } from "react-router-dom";

import { Card, CardHeader, CardBody, CardFooter, Typography, Input, Button } from "@material-tailwind/react";

import axios from 'axios';

import logo from '../assets/logo_nobg.jpg'



export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const signInWithEmailAndPasswordHandler = async (event, username, password) => {
        event.preventDefault();
        setError('');
        
        if (!username || !password) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        console.log('Sending login request:', { username, password });

        try {
            const response = await axios.post('/api/auth/login', { username, password });
            console.log('Login response:', response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            window.location.reload();
        } catch (error) {
            console.error('Login error', error.response.data);
            setError(error.response.data.msg || 'Erreur lors de la connexion.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Card className="w-96 my-[3rem]">
                <CardHeader className="text-center py-4">
                    <Typography variant="h4">
                        <img src={logo} className=""/>
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col gap-4">
                    {error && <Typography color="red">{error}</Typography>}
                    <Input 
                        label="Nom d'utilisateur" 
                        size="lg" 
                        type="test" 
                        color="purple" 
                        value={username} 
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <Input 
                        label="Mot de passe" 
                        size="lg" 
                        type="password" 
                        color="purple" 
                        value={password} 
                        onChange={(event) => setPassword(event.target.value)} 
                    />
                </CardBody>
                <CardFooter className="pt-0">
                    <Button onClick={(event) => signInWithEmailAndPasswordHandler(event, username, password)} className="bg-eds hover:shadow-none" fullWidth>
                        Se Connecter
                    </Button>
                    <Typography variant="small" className="mt-6 flex justify-center">
                        Pas de compte ?
                        <Link to='/register'>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="ml-1 font-bold"
                            >
                                Créer un compte
                            </Typography>
                        </Link>
                    </Typography>
                </CardFooter>
            </Card>
        </div>
    );
}
