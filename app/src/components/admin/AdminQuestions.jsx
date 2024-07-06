import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { Button, CardBody, CardHeader, CardFooter, Input, Typography, Tabs, TabsHeader, Tab } from '@material-tailwind/react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

import axios from 'axios';



const TABLE_HEAD = ['ID', 'Title', 'Type', 'Status'];
const TABS = [
    { label: 'Toutes les questions', value: 'all' },
    { label: 'Questions actives', value: 'active' },
    { label: 'Questions archivées', value: 'archived' },
];



export function AdminQuestions() {
    const [questions, setQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/questions');
                setQuestions(response.data);
            } catch (error) {
                console.error('Error retrieving data:', error);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleTabChange = (value) => {
        setSelectedTab(value);
        setCurrentPage(1);
    };

    const filteredQuestions = questions.filter((question) => {
        const titleMatch = question.title ? question.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const authorMatch = question.author ? question.author.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const statusMatch = selectedTab === 'all' || question.status === selectedTab;
        return (titleMatch || authorMatch) && statusMatch;
    });

    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
    const paginatedQuestions = filteredQuestions.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage);

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography color="gray" className="mt-1 font-normal">
                            Gestion des questions
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Link to='/register/questions/new'>
                            <Button className="flex items-center gap-3 bg-current shadow-none hover:shadow-current" size="sm">
                                <PlusIcon strokeWidth={2} className="h-4 w-4" /> Ajouter une question
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <Tabs value={selectedTab} onChange={(e) => handleTabChange(e)} className="w-full md:w-max">
                        <TabsHeader className="flex-nowrap">
                            {TABS.map(({ label, value }) => (
                                <Tab key={value} value={value} onClick={() => handleTabChange(value)} className="text-sm px-4 py-2 whitespace-nowrap">
                                    {label}
                                </Tab>
                            ))}
                        </TabsHeader>
                    </Tabs>
                    <div className="w-full md:w-72">
                        <Input label="Recherche" color='purple' icon={<MagnifyingGlassIcon className="h-5 w-5" />} onChange={handleSearchInputChange} />
                    </div>
                </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((title) => (
                                    <th key={title} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                            {title}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedQuestions.map(({ _id, title, type, author, date, status }, index) => {
                                const isLast = index === paginatedQuestions.length - 1;
                                const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50';
                                return (
                                    <tr key={_id}>
                                        <td className={classes}>
                                            <Link to={`/register/questions/${_id}`}>
                                                <div className="flex items-center gap-3">
                                                    <Typography variant="small" color="blue-gray" className="font-normal hover:underline">
                                                        {_id}
                                                    </Typography>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {title}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {type.nameType}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {status}
                                                </Typography>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Page {currentPage} sur {totalPages}
                </Typography>
                <div className="flex gap-2">
                    <Button
                        className='bg-current shadow-none hover:shadow-current'
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        Précédent
                    </Button>
                    <Button
                        className='bg-current shadow-none hover:shadow-current'
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Suivant
                    </Button>
                </div>
            </CardFooter>
        </div>
    );
}