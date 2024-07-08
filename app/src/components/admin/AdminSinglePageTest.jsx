import React, { useState, useEffect } from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';

import { Alert, Button, Typography, CardHeader, CardBody, Input, Spinner, Timeline, TimelineItem, TimelineConnector, TimelineIcon, TimelineHeader, Select, Option, Chip, Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';
import { ArrowLeftIcon, TrashIcon, ArrowPathIcon, PlusIcon, ArrowDownTrayIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import axios from 'axios';



export function AdminSinglePageTest() {
    const { id } = useParams();
    const [selectedTest, setSelectedTest] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [content, setContent] = useState([]);
    const [status, setStatus] = useState('');
    const [isModified, setIsModified] = useState(false);
    const [historyItems, setHistoryItems] = useState([]);
    const [user, setUser] = useState(null);
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [hasInactiveQuestions, setHasInactiveQuestions] = useState(false);
    const [alertOpen, setAlertOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        
    }, []);

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
        
        const fetchTestData = async () => {
            try {
                const response = await axios.get(`/api/tests/${id}`);
                setSelectedTest(response.data);
                setTitle(response.data.title);
                setDesc(response.data.desc);
                setContent(response.data.content.map(q => ({ questionId: q.questionId, title: '', status: 'active' })));
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

        const fetchQuestions = async () => {
            try {
                const response = await axios.get('/api/questions');
                setAvailableQuestions(response.data);

                setContent((prevContent) =>
                    prevContent.map((c) => {
                        const question = response.data.find((q) => q._id === c.questionId);
                        return question ? { questionId: c.questionId, title: question.title, status: question.status } : c;
                    })
                );
                
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchUser();
        fetchTestData();
        fetchQuestions();
    }, [id]);

    useEffect(() => {
        const inactiveQuestions = content.filter(q => q.status !== 'active').length > 0;
        setHasInactiveQuestions(inactiveQuestions);
    }, [content]);

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
        if (!selectedTest) return;
        if (title !== selectedTest.title || desc !== selectedTest.desc || JSON.stringify(content) !== JSON.stringify(selectedTest.content) || status !== selectedTest.status) {
            setIsModified(true);
        } else {
            setIsModified(false);
        }
    };

    useEffect(() => {
        checkIsModified();
    }, [title, desc, content, status]);

    const handleSaveTestChanges = async () => {
        if (!isModified) {
            alert('Aucune modification détectée.');
            return;
        }

        const currentDate = new Date();

        const updatedActivity = [
            ...selectedTest.activity,
            {
                author: user._id,
                type: 'update',
                date: currentDate,
            },
        ];

        try {
            const storedUser = localStorage.getItem('user');
            const { token } = storedUser ? JSON.parse(storedUser) : {};

            await axios.put(`/api/tests/${id}`, { title, desc, content, status, activity: updatedActivity }, {
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

    const handleDeleteTest = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce test ?')) {
            return;
        }

        try {
            const storedUser = localStorage.getItem('user');
            const { token } = storedUser ? JSON.parse(storedUser) : {};

            await axios.delete(`/api/tests/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Test supprimé avec succès.');
            navigate('/admin/tests');
        } catch (error) {
            console.error('Error deleting data:', error);
            alert('Erreur lors de la suppression du test.');
        }
    };

    const handleAddQuestion = (questionId, questionTitle, questionStatus) => {
        setContent([...content, { questionId, title: questionTitle, status: questionStatus }]);
    };

    const handleRemoveQuestion = (questionId) => {
        setContent(content.filter((question) => question.questionId !== questionId));
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
                {hasInactiveQuestions && alertOpen && (
                    <Alert
                        icon={<ExclamationTriangleIcon />}
                        className="rounded-none border-l-4 border-[#c92e2e] bg-[#c92e2e]/10 font-medium text-[#c92e2e]"
                        open={alertOpen}
                        action={
                            <Button
                                variant="text"
                                color="white"
                                size="sm"
                                className="!absolute top-3 right-3 text-[#c92e2e]"
                                onClick={() => setAlertOpen(false)}
                            >
                                Close
                            </Button>
                        }
                    >
                        Une ou plusieurs questions sélectionnées sont désactivées.
                    </Alert>
                )}
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-8 grid items-center justify-between gap-8 sm:grid-cols-1 md:grid-cols-2">
                        <div className='flex items-center'>
                            <Link to='/register/tests'>
                                <Button variant="text" className='hover:bg-none' onClick={() => { setEditMode(false) }}>
                                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" color='purple' />
                                </Button>
                            </Link>
                            <Typography color="gray" className="mt-1 font-normal">
                                Test : {selectedTest ? selectedTest.title : 'Chargement...'}
                            </Typography>
                        </div>
                        <div className="flex shrink-0 gap-2 sm:flex-row md:justify-end">
                            {editMode ? (
                                <>
                                    <Button variant="secondary" color='red' onClick={() => setEditMode(false)}>
                                        Annuler
                                    </Button>
                                    <Button variant="gradient" color="green" onClick={handleSaveTestChanges}>
                                        Enregistrer
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button className='bg-current hover:shadow-none' onClick={() => setEditMode(true)}>
                                        Modifier
                                    </Button>
                                    <Button variant="outlined" color="red" onClick={handleDeleteTest}>
                                        <TrashIcon strokeWidth={2} className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    {selectedTest ? (
                        <>
                            <div>
                                <div className='gap-5 mt-5 grid sm:grid-cols-1 md:grid-cols-2'>
                                    <div className='gap-1 w-full'>
                                        <Typography>ID :</Typography>
                                        <Input color="purple" value={selectedTest._id} disabled />
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
                                        <Typography>Description :</Typography>
                                        <Input color="purple" value={desc} onChange={(e) => setDesc(e.target.value)} disabled={!editMode} />
                                    </div>
                                </div>
                                <div className='py-1'>
                                    <div className="flex items-center gap-3 pb-2">
                                        <Typography>Questions :</Typography>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {content.map((question) => (
                                                <Chip key={question.questionId} value={`${question.title} ${question.status !== 'active' ? '(désactivée)' : ''}`} onClose={editMode ? () => handleRemoveQuestion(question.questionId) : null} variant="outlined" color='purple'>
                                                    {question.title}
                                                </Chip>
                                            ))}
                                        </div>
                                    </div>
                                    {editMode && (
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