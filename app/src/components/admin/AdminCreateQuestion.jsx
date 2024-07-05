import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, CardHeader, CardBody, CardFooter, Input, Typography, Checkbox, Radio } from '@material-tailwind/react';
import axios from 'axios';

export function AdminCreateQuestion() {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('simple');
    const [choices, setChoices] = useState([{ id: '', choice: '', answer: false }]);
    const [user, setUser] = useState(null);
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
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleChoiceChange = (index, field, value) => {
        const newChoices = [...choices];
        newChoices[index][field] = value;
        setChoices(newChoices);
    };

    const addChoice = () => {
        setChoices([...choices, { id: '', choice: '', answer: false }]);
    };

    const removeChoice = (index) => {
        const newChoices = choices.filter((_, i) => i !== index);
        setChoices(newChoices);
    };

    const handleSubmit = async () => {
        if (!user) {
            alert('Utilisateur non authentifié');
            return;
        }

        const currentDate = new Date();

        let questionData = {
            title: title,
            type: {
                nameType: type,
                content: []
            },
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

        if (type === 'simple') {
            questionData.type.content = '';
        } else {
            questionData.type.content = choices.map(choice => ({
                id: choice.id || Math.random().toString(36).substr(2, 9),
                choice: choice.choice,
                answer: choice.answer,
            }));
        }

        try {
            const { token } = JSON.parse(localStorage.getItem('user'));
            await axios.post('/api/questions', questionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Nouvelle question créée avec succès !');
            navigate('/admin/questions');
        } catch (error) {
            console.error('Error creating question:', error);
            alert('Erreur lors de la création de la question.');
        }
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <CardHeader floated={false} shadow={false} className="rounded-none flex flex-col items-center justify-center py-[2rem]">
                <Typography variant="h4">
                    Publier une nouvelle question
                </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
                <Input label="Titre de la question" color="purple" value={title} size="lg" onChange={(e) => setTitle(e.target.value)} />
                <Typography variant="h6" className="mt-4">
                    Type de question
                </Typography>
                <div className="flex gap-4">
                    <Radio
                        name="type"
                        label="Simple"
                        color="purple"
                        checked={type === 'simple'}
                        onChange={() => setType('simple')}
                    />
                    <Radio
                        name="type"
                        label="QCM"
                        color="purple"
                        checked={type === 'qcm'}
                        onChange={() => setType('qcm')}
                    />
                    <Radio
                        name="type"
                        label="QCU"
                        color="purple"
                        checked={type === 'qcu'}
                        onChange={() => setType('qcu')}
                    />
                </div>

                {(type === 'qcm' || type === 'qcu') && (
                    <div className="flex flex-col gap-4 mt-4">
                        <Typography variant="h6">
                            Options de réponse
                        </Typography>
                        {choices.map((choice, index) => (
                            <div key={index} className="flex gap-4 items-center">
                                <Input
                                    label={`Option ${index + 1}`}
                                    value={choice.choice}
                                    onChange={(e) => handleChoiceChange(index, 'choice', e.target.value)}
                                    size="lg"
                                    className="flex-1"
                                    color='purple'
                                />
                                <Checkbox
                                    checked={choice.answer}
                                    onChange={(e) => handleChoiceChange(index, 'answer', e.target.checked)}
                                    color="green"
                                    label="Correct"
                                />
                                <Button
                                    variant="outlined"
                                    color="red"
                                    onClick={() => removeChoice(index)}
                                >
                                    Supprimer
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="gradient"
                            color="purple"
                            onClick={addChoice}
                        >
                            Ajouter une option
                        </Button>
                    </div>
                )}
            </CardBody>
            <CardFooter className='flex gap-2'>
                <Link to='/admin/questions'>
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
