import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Typography, CardHeader, CardBody, Checkbox, Input, Spinner, Timeline, TimelineItem, TimelineConnector, TimelineIcon, TimelineHeader } from '@material-tailwind/react';
import { ArrowLeftIcon, TrashIcon, ArrowPathIcon, PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export function AdminSinglePageQuestion() {
    const { id } = useParams();
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState('');
    const [type, setType] = useState({ nameType: '', content: '' });
    const [isModified, setIsModified] = useState(false);
    const [historyItems, setHistoryItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestionData = async () => {
            try {
                const response = await axios.get(`/api/questions/${id}`);
                setSelectedQuestion(response.data);
                setTitle(response.data.title);
                setType(response.data.type);
                const historyWithAuthors = await Promise.all(
                    response.data.activity.map(async (item) => {
                        const authorName = await fetchAuthorData(item.author);
                        const formattedDate = new Date(item.date).toLocaleString();
                        return { ...item, authorName, date: formattedDate };
                    })
                );
                setHistoryItems(historyWithAuthors);
            } catch (error) {
                console.error('Error retrieving data:', error);
            }
        };

        fetchQuestionData();
    }, [id]);

    const fetchAuthorData = async (authorId) => {
        try {
            const authorData = await axios.get(`/api/users/${authorId}`);
            return authorData.data.username;
        } catch (error) {
            console.error('Error fetching author data:', error);
            return 'Unknown';
        }
    };

    const checkIsModified = () => {
        if (!selectedQuestion) return;
        if (title !== selectedQuestion.title || JSON.stringify(type) !== JSON.stringify(selectedQuestion.type)) {
            setIsModified(true);
        } else {
            setIsModified(false);
        }
    };

    useEffect(() => {
        checkIsModified();
    }, [title, type]);

    const handleSaveQuestionChanges = async () => {
        if (!isModified) {
            alert('Aucune modification détectée.');
            return;
        }

        try {
            await axios.put(`/api/questions/${id}`, { title, type });
            setIsModified(false);
            alert('Modifications enregistrées avec succès.');
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

    return (
        <div>
            <div className="h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-8 grid items-center justify-between gap-8 sm:grid-cols-1 md:grid-cols-2">
                        <div className='flex items-center'>
                            <Link to='/admin/questions'>
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
                                        <Typography>Titre :</Typography>
                                        <Input color="purple" value={title} onChange={(e) => setTitle(e.target.value)} disabled={!editMode} />
                                    </div>
                                    <div className='gap-1 w-full'>
                                        <Typography>Type :</Typography>
                                        <Input color="purple" value={type.nameType} onChange={(e) => setType({ ...type, nameType: e.target.value })} disabled={!editMode} />
                                    </div>
                                    {(type.nameType === 'qcm' || type.nameType === 'qcu') && (
                                        <div className='gap-1 w-full'>
                                            <Typography>Contenu :</Typography>
                                            {type.content.map((choice, index) => (
                                                <div key={index} className="flex gap-4 items-center">
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
                                                    />
                                                    <Checkbox
                                                        checked={choice.answer}
                                                        onChange={(e) => {
                                                            const newContent = [...type.content];
                                                            newContent[index].answer = e.target.checked;
                                                            setType({ ...type, content: newContent });
                                                        }}
                                                        color="green"
                                                        label="Correct"
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                            ))}
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
