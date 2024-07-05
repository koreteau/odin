import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Button, CardBody, CardHeader, Typography, Spinner, Tabs, TabsHeader, Tab, Input } from "@material-tailwind/react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from "axios";
import blankProfile from '../../assets/blank-profile-picture.webp';

const TABLE_HEAD = ['ID', 'Titre', 'Prénom', 'Nom', 'Date du test'];
const TABS = [
    { label: 'Tous les résultats', value: 'all' },
    { label: 'Résultats récents', value: 'recent' },
    { label: 'Résultats anciens', value: 'old' },
];

export function AdminHome() {
    const [user, setUser] = useState(null);
    const [profilePictureURL, setProfilePictureURL] = useState(blankProfile);
    const [testResults, setTestResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('all');

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

        const fetchTestResults = async () => {
            try {
                const response = await axios.get('/api/test-results');
                setTestResults(response.data);
            } catch (error) {
                console.error('Error fetching test results:', error);
            }
            setLoading(false);
        };

        fetchUser();
        fetchTestResults();
    }, []);

    const handleTabChange = (value) => {
        setSelectedTab(value);
        setCurrentPage(1);
    };

    const filteredResults = testResults.filter((result) => {
        const firstNameMatch = result.firstName ? result.firstName.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const lastNameMatch = result.lastName ? result.lastName.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const titleMatch = result.title ? result.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        return firstNameMatch || lastNameMatch || titleMatch;
    });

    const sortedResults = filteredResults.sort((a, b) => {
        if (selectedTab === 'recent') {
            return new Date(b.answerDate) - new Date(a.answerDate);
        }
        if (selectedTab === 'old') {
            return new Date(a.answerDate) - new Date(b.answerDate);
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedResults.length / resultsPerPage);
    const paginatedResults = sortedResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            {user ? (
                <div className="p-5">
                    <div className="flex gap-5 items-center p-5">
                        <Avatar
                            variant="circular"
                            className="h-48 w-48"
                            alt="Profile Picture"
                            src={profilePictureURL || ""}
                        />
                        <div className="">
                            <Typography variant='h5'>Bonjour {user.firstName} {user.lastName}</Typography>
                            <hr className="my-1" />
                            <div className="flex gap-10">
                                <Typography>Statut : {user.role}</Typography>
                            </div>
                        </div>
                    </div>
                    <hr className="my-5" />
                    <div>
                        <Typography variant='h6'>Résultats des tests récents :</Typography>
                        <div className="grid grid-cols-1 gap-3 custom-sm custom-md custom-lg custom-xlg">
                            <CardHeader floated={false} shadow={false} className="rounded-none">
                            <div className="mb-8 flex items-center justify-between gap-8">
                                    <div>
                                        <Typography variant='h6' className="mt-1 font-normal">
                                        Formations en attente d'approbation :
                                        </Typography>
                                    </div>
                                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                        <Link to='/register/tests'>
                                            <Button className="flex items-center gap-3 bg-current shadow-none hover:shadow-current" size="sm">
                                                Voir toutes les résultats
                                            </Button>
                                        </Link>
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
                                            {paginatedResults.map((result) => (
                                                <tr key={result.id}>
                                                    <td className="p-4">
                                                        <Link to={`/admin/tests/${result.id}`}>
                                                            <Typography variant="small" className="font-normal hover:underline">
                                                                {result.id}
                                                            </Typography>
                                                        </Link>
                                                    </td>
                                                    <td className="p-4"><Typography variant="small" className="font-normal">{result.title}</Typography></td>
                                                    <td className="p-4"><Typography variant="small" className="font-normal">{result.firstName}</Typography></td>
                                                    <td className="p-4"><Typography variant="small" className="font-normal">{result.lastName}</Typography></td>
                                                    <td className="p-4"><Typography variant="small" className="font-normal">{new Date(result.answerDate).toLocaleString()}</Typography></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </CardBody>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center min-h-screen'>
                    <Spinner className="h-20 w-20" color="purple" />
                </div>
            )}
        </>
    );
}
