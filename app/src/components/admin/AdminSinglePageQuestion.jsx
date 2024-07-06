import React, { useState, useEffect } from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button, Typography, Checkbox, CardHeader, CardBody, Input, Spinner, Timeline, TimelineItem, TimelineConnector, TimelineIcon, TimelineHeader, Select, Option } from '@material-tailwind/react';
import { ArrowLeftIcon, TrashIcon, ArrowPathIcon, PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

import axios from 'axios';



export function AdminSinglePageQuestion() {
    const { id } = useParams();
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState('');
    const [type, setType] = useState({ nameType: '', content: '' });
    const [status, setStatus] = useState('');
    const [isModified, setIsModified] = useState(false);
    const [historyItems, setHistoryItems] = useState([]);
    const [user, setUser] = useState(null);
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

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchQuestionData = async () => {
            try {
                const response = await axios.get(`/api/questions/${id}`);
                setSelectedQuestion(response.data);
                setTitle(response.data.title);
                setType(response.data.type);
                setStatus(response.data.status);
                const historyWithAuthors = await Promise.all(
                    response.data.activity.map(async (item) => {
                        const authorName = await fetchAuthorData(item.author);
                        const formattedDate = new Date(item.date).toLocaleString();
                        return { ...item, authorName, date: formattedDate };
                    })
                );
                setHistoryItems(historyWithAuthors.reverse());
            } catch (error) {
                console.error('Error retrieving data:', error);
            }
        };

        fetchQuestionData();
    }, [id]);

    const fetchAuthorData = async (authorId) => {
        try {
            const authorData = await axios.get(`/api/users/${authorId}`);
            return `${authorData.data.firstName} ${authorData.data.lastName}`;
        } catch (error) {
            console.error('Error fetching author data:', error);
            return 'Unknown';
        }
    };

    const checkIsModified = () => {
        if (!selectedQuestion) return;
        if (title !== selectedQuestion.title || JSON.stringify(type) !== JSON.stringify(selectedQuestion.type) || status !== selectedQuestion.status) {
            setIsModified(true);
        } else {
            setIsModified(false);
        }
    };

    useEffect(() => {
        checkIsModified();
    }, [title, type, status]);

    const handleSaveQuestionChanges = async () => {
        if (!isModified) {
            alert('Aucune modification détectée.');
            return;
        }

        const updatedType = type.nameType === 'simple' ? { nameType: type.nameType, content: type.content } : type;
        const currentDate = new Date();

        const updatedActivity = [
            ...selectedQuestion.activity,
            {
                author: user._id,
                type: 'update',
                date: currentDate,
            },
        ];

        try {
            const storedUser = localStorage.getItem('user');
            const { token } = storedUser ? JSON.parse(storedUser) : {};

            await axios.put(`/api/questions/${id}`, { title, type: updatedType, status, activity: updatedActivity }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setIsModified(false);
            alert('Modifications enregistrées avec succès.');
            window.location.reload();
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const handleDeleteQuestion = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
            return;
        }

        try {
            const storedUser = localStorage.getItem('user');
            const { token } = storedUser ? JSON.parse(storedUser) : {};

            await axios.delete(`/api/questions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Question supprimée avec succès.');
            navigate('/admin/questions');
        } catch (error) {
            console.error('Error deleting data:', error);
            alert('Erreur lors de la suppression de la question.');
        }
    };

    const getEventTypeLabel = (type) => {
        switch (type) {
            case 'update':
                return 'Mise à jour des informations';
            case 'creation':
                return 'Création et publication';
            case 'delete':
                return 'Suppression';
            case 'recovery':
                return 'Remise en ligne';
            default:
                return '';
        }
    };

    const getEventIconColor = (type) => {
        switch (type) {
            case 'update':
                return '';
            case 'creation':
                return 'green';
            case 'delete':
                return 'red';
            case 'recovery':
                return 'orange';
            default:
                return '';
        }
    };

    const getEventIcon = (type) => {
        switch (type) {
            case 'update':
                return <ArrowPathIcon className="h-5 w-5" />;
            case 'creation':
                return <PlusIcon className="h-5 w-5" />;
            case 'delete':
                return <TrashIcon className="h-5 w-5" />;
            case 'recovery':
                return <ArrowDownTrayIcon className="h-5 w-5" />;
            default:
                return null;
        }
    };

    const handleCheckboxChange = (index) => {
        const newContent = type.content.map((choice, i) => {
            if (type.nameType === 'qcu') {
                return { ...choice, answer: i === index };
            }
            if (i === index) {
                return { ...choice, answer: !choice.answer };
            }
            return choice;
        });
        setType({ ...type, content: newContent });
    };

    const handleAddOption = () => {
        setType({
            ...type,
            content: [...type.content, { choice: '', answer: false }],
        });
    };

    return (
        <div>
            <div className="h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-8 grid items-center justify-between gap-8 sm:grid-cols-1 md:grid-cols-2">
                        <div className='flex items-center'>
                            <Link to='/register/questions'>
                                <Button variant="text" className='hover:bg-none' onClick={() => { setEditMode(false) }}>
                                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" color='purple' />
                                </Button>
                            </Link>
                            <Typography color="gray" className="mt-1 font-normal">
                                Question : {selectedQuestion ? selectedQuestion.title : 'Chargement...'}
                            </Typography>
                        </div>
                        <div className="flex shrink-0 gap-2 sm:flex-row md:justify-end">
                            {editMode ? (
                                <>
                                    <Button variant="secondary" color='red' onClick={() => setEditMode(false)}>
                                        Annuler
                                    </Button>
                                    <Button variant="gradient" color="green" onClick={handleSaveQuestionChanges}>
                                        Enregistrer
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button className='bg-current hover:shadow-none' onClick={() => setEditMode(true)}>
                                        Modifier
                                    </Button>
                                    <Button variant="outlined" color="red" onClick={handleDeleteQuestion}>
                                        <TrashIcon strokeWidth={2} className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    {selectedQuestion ? (
                        <>
                            <div>
                                <div className='gap-5 mt-5 grid sm:grid-cols-1 md:grid-cols-2'>
                                    <div className='gap-1 w-full'>
                                        <Typography>ID :</Typography>
                                        <Input color="purple" value={selectedQuestion._id} disabled />
                                    </div>
                                    <div className='gap-1 w-full'>
                                        <Typography>Statut :</Typography>
                                        <Select color="purple" value={status} onChange={(value) => setStatus(value)} disabled={!editMode}>
                                            <Option value="active">Active</Option>
                                            <Option value="archived">Désactivée</Option>
                                        </Select>
                                    </div>
                                    <div className='gap-1 w-full'>
                                        <Typography>Titre :</Typography>
                                        <Input color="purple" value={title} onChange={(e) => setTitle(e.target.value)} disabled={!editMode} />
                                    </div>
                                    <div className='gap-1 w-full'>
                                        <Typography>Type :</Typography>
                                        <Select color="purple" value={type.nameType} onChange={(value) => setType({ ...type, nameType: value, content: value === 'simple' ? '' : [] })} disabled={!editMode}>
                                            <Option value="simple">Simple</Option>
                                            <Option value="qcm">QCM</Option>
                                            <Option value="qcu">QCU</Option>
                                        </Select>
                                    </div>
                                    {type.nameType === 'simple' && (
                                        <div className='gap-1 w-full'>
                                            <Typography className='pt-2'>Contenu :</Typography>
                                            <Input
                                                label="Contenu"
                                                value={type.content}
                                                onChange={(e) => setType({ ...type, content: e.target.value })}
                                                size="lg"
                                                className="flex-1"
                                                disabled={!editMode}
                                                color='purple'
                                            />
                                        </div>
                                    )}
                                    {(type.nameType === 'qcm' || type.nameType === 'qcu') && (
                                        <div className='gap-1 w-full'>
                                            <Typography className='pt-2'>Contenu :</Typography>
                                            {type.content.map((choice, index) => (
                                                <div key={index} className="flex gap-4 pt-2 items-center">
                                                    <Input
                                                        label={`Option ${index + 1}`}
                                                        value={choice.choice}
                                                        onChange={(e) => {
                                                            const newContent = [...type.content];
                                                            newContent[index].choice = e.target.value;
                                                            setType({ ...type, content: newContent });
                                                        }}
                                                        size="lg"
                                                        className="flex-1"
                                                        disabled={!editMode}
                                                        color='purple'
                                                    />
                                                    <Checkbox
                                                        checked={choice.answer}
                                                        onChange={() => handleCheckboxChange(index)}
                                                        color="green"
                                                        label="Correct"
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                            ))}
                                            {editMode && (
                                                <Button className="mt-4" color="green" onClick={handleAddOption}>
                                                    Ajouter une option
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full pl-20 pr-20 pt-10">
                                <Timeline>
                                    {historyItems.map((item, index) => (
                                        <TimelineItem key={index} className="h-28">
                                            {index !== historyItems.length - 1 && <TimelineConnector className="!w-[78px]" />}
                                            <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                                                <TimelineIcon className="p-3" variant="ghost" color={getEventIconColor(item.type)}>
                                                    {getEventIcon(item.type)}
                                                </TimelineIcon>
                                                <div className="flex flex-col gap-1">
                                                    <Typography variant="h6" color="blue-gray">
                                                        {getEventTypeLabel(item.type)}
                                                    </Typography>
                                                    <div className='flex gap-1'>
                                                        <Typography variant="small" color="gray" className="font-normal">
                                                            Le {item.date} par
                                                        </Typography>
                                                        <Link to={`/settings/users/${item.author}`}>
                                                            <Typography variant="small" color="gray" className="font-normal hover:underline">{item.authorName}</Typography>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </TimelineHeader>
                                        </TimelineItem>
                                    ))}
                                </Timeline>
                            </div>
                        </>
                    ) : (
                        <div className='flex flex-col items-center justify-center min-h-screen'>
                            <Spinner className="h-20 w-20" color="purple" />
                        </div>
                    )}
                </CardBody>
            </div>
        </div>
    );
}
