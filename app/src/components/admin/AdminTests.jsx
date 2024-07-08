import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { Button, CardBody, CardHeader, CardFooter, Input, Typography, Tabs, TabsHeader, Tab } from '@material-tailwind/react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

import axios from 'axios';



const TABLE_HEAD = ['ID', 'Title', 'Date', 'Creator', 'Status'];
const TABS = [
  { label: 'Tous les tests', value: 'all' },
  { label: 'Tests actifs', value: 'active' },
  { label: 'Tests archivés', value: 'archived' },
];



export function AdminTests() {
  const [tests, setTests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/tests');
        console.log(response.data);
        setTests(response.data);
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

  const filteredTests = tests.filter((test) => {
    const titleMatch = test.title ? test.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const creatorMatch = test.creator ? test.creator.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const statusMatch = selectedTab === 'all' ? true : test.status === selectedTab;
    return (titleMatch || creatorMatch) && statusMatch;
  });

  const totalPages = Math.ceil(filteredTests.length / testsPerPage);
  const paginatedTests = filteredTests.slice((currentPage - 1) * testsPerPage, currentPage * testsPerPage);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography color="gray" className="mt-1 font-normal">
              Gestion des tests
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Link to='/register/tests/new'>
              <Button className="flex items-center gap-3 bg-current shadow-none hover:shadow-current" size="sm">
                <PlusIcon strokeWidth={2} className="h-4 w-4" /> Créer un test
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value={selectedTab} onChange={handleTabChange} className="w-full md:w-1/3">
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
              {paginatedTests.map((test) => (
                <tr key={test._id}>
                  <td className="p-4">
                    <Link to={`/register/tests/${test._id}`}>
                      <Typography variant="small" className="font-normal hover:underline">
                        {test._id}
                      </Typography>
                    </Link>
                  </td>
                  <td className="p-4"><Typography variant="small" className="font-normal">{test.title}</Typography></td>
                  <td className="p-4"><Typography variant="small" className="font-normal">{new Date(test.date).toLocaleString()}</Typography></td>
                  <td className="p-4"><Typography variant="small" className="font-normal">{test.creator}</Typography></td>
                  <td className="p-4"><Typography variant="small" className="font-normal">{test.status}</Typography></td>
                </tr>
              ))}
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
