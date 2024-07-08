import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, CardHeader, CardBody, CardFooter, Input, Typography, Chip, Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';
import axios from 'axios';

export function AdminCreateTest() {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [content, setContent] = useState([]);
    const [user, setUser] = useState(null);
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const { token } = JSON.parse(storedUser);
                if (token) {
                    try {
                        const response = await axios.get('/api/auth', {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        setUser(response.data);
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                        localStorage.removeItem('user');
                    }
                }
            }
        };

        const fetchQuestions = async () => {
            try {
                const response = await axios.get('/api/questions');
                setAvailableQuestions(response.data.filter(q => q.status === 'active'));
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchUser();
        fetchQuestions();
        setLoading(false);
    }, []);

    const handleAddQuestion = (questionId, questionTitle, questionStatus) => {
        setContent([...content, { questionId, title: questionTitle, status: questionStatus }]);
    };

    const handleRemoveQuestion = (questionId) => {
        setContent(content.filter((question) => question.questionId !== questionId));
    };

    const handleSubmit = async () => {
        if (!user) {
            alert('Utilisateur non authentifié');
            return;
        }

        const currentDate = new Date();

        const testData = {
            title: title,
            desc: desc,
            content: content.map(c => ({ questionId: c.questionId })),
            status: 'active',
            author: user._id,
            activity: [
                {
                    author: user._id,
                    type: 'creation',
                    date: currentDate
                }
            ]
        };

        try {
            const { token } = JSON.parse(localStorage.getItem('user'));
            await axios.post('/api/tests', testData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Nouveau test créé avec succès !');
            navigate('/register/tests');
        } catch (error) {
            console.error('Error creating test:', error);
            alert('Erreur lors de la création du test.');
        }
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <CardHeader floated={false} shadow={false} className="rounded-none flex flex-col items-center justify-center py-[2rem]">
                <Typography variant="h4">
                    Publier un nouveau test
                </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
                <Input label="Titre du test" color="purple" value={title} size="lg" onChange={(e) => setTitle(e.target.value)} />
                <Input label="Description du test" color="purple" value={desc} size="lg" onChange={(e) => setDesc(e.target.value)} />
                <div className='py-1'>
                    <div className="flex items-center gap-3 pb-2">
                        <Typography>Questions :</Typography>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {content.map((question) => (
                                <Chip key={question.questionId} value={`${question.title} ${question.status !== 'active' ? '(désactivée)' : ''}`} onClose={() => handleRemoveQuestion(question.questionId)} variant="outlined" color='purple'>
                                    {question.title}
                                </Chip>
                            ))}
                        </div>
                    </div>
                    <Menu>
                        <MenuHandler>
                            <Button className="bg-pixi hover:shadow-none">Sélectionner des questions</Button>
                        </MenuHandler>
                        <MenuList>
                            {availableQuestions.map((question) => (
                                <MenuItem key={question._id} onClick={() => handleAddQuestion(question._id, question.title, question.status)}>
                                    {question.title}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                </div>
            </CardBody>
            <CardFooter className='flex gap-2'>
                <Link to='/register/tests'>
                    <Button variant="outlined" color="red">
                        <span>Annuler</span>
                    </Button>
                </Link>
                <Button variant="gradient" color="green" onClick={handleSubmit}>
                    <span>Publier</span>
                </Button>
            </CardFooter>
        </div>
    );
}
