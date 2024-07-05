import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Drawer, IconButton, Typography, List, ListItem, ListItemPrefix, Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { Bars3Icon, ChevronDownIcon, Cog6ToothIcon, PowerIcon, PresentationChartBarIcon, TableCellsIcon } from "@heroicons/react/24/outline";

import axios from 'axios';

import logo from '../assets/logo_nobg.jpg'



export function DefaultDrawerSidebar() {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(0);
    const navigate = useNavigate();

    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const handleOpen = (value) => {
        setAccordionOpen(accordionOpen === value ? 0 : value);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser && storedUser.token) {
                    const response = await axios.get('/api/auth', {
                        headers: {
                            Authorization: `Bearer ${storedUser.token}`
                        }
                    });
                    setUser(response.data);
                    setAdmin(response.data.role === 'admin');
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
                setUser(null);
                setAdmin(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('user');
            setUser(null);
            setAdmin(false);
            alert("Vous êtes bien déconnecté");
            navigate('/login');
        } catch (error) {
            console.error("Logout error: ", error);
        }
    };

    const handleLinkClick = (path) => {
        closeDrawer();
        navigate(path);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <IconButton size="lg" className="rounded-full bg-current shadow-none hover:shadow-current" onClick={openDrawer}>
                <Bars3Icon className="h-5 w-5 transition-transform group-hover:rotate-45" />
            </IconButton>
            <Drawer open={open} onClose={closeDrawer} className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <div onClick={() => handleLinkClick('/')}>
                        <div className="flex flex-col items-center justify-center gap-4 p-4">
                            <img src={logo} alt="brand" className="h-14" />
                        </div>
                    </div>
                    <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </IconButton>
                </div>
                <div className="w-full shadow-none">
                    <List>
                        <ListItem onClick={() => handleLinkClick('/dashboard')}>
                            <ListItemPrefix>
                                <PresentationChartBarIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            Dashboard
                        </ListItem>
                        <Accordion
                            open={accordionOpen === 2}
                            icon={
                                <ChevronDownIcon
                                    strokeWidth={2.5}
                                    className={`mx-auto h-4 w-4 transition-transform ${accordionOpen === 2 ? "rotate-180" : ""}`}
                                />
                            }
                        >
                            <ListItem className="p-0" selected={accordionOpen === 2}>
                                <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
                                    <ListItemPrefix>
                                        <TableCellsIcon className="h-5 w-5" />
                                    </ListItemPrefix>
                                    <Typography color="blue-gray" className="mr-auto font-normal">
                                        Registre
                                    </Typography>
                                </AccordionHeader>
                            </ListItem>
                            <AccordionBody className="py-1">
                                <List className="p-0">
                                    <ListItem onClick={() => handleLinkClick('/register/questions')}>
                                        <ListItemPrefix>
                                        </ListItemPrefix>
                                        Questions
                                    </ListItem>
                                    <ListItem onClick={() => handleLinkClick('/register/tests')}>
                                        <ListItemPrefix>
                                        </ListItemPrefix>
                                        Tests
                                    </ListItem>
                                </List>
                            </AccordionBody>
                        </Accordion>
                        <Accordion
                            open={accordionOpen === 1}
                            icon={
                                <ChevronDownIcon
                                    strokeWidth={2.5}
                                    className={`mx-auto h-4 w-4 transition-transform ${accordionOpen === 1 ? "rotate-180" : ""}`}
                                />
                            }
                        >
                            <ListItem className="p-0" selected={accordionOpen === 1}>
                                <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
                                    <ListItemPrefix>
                                        <Cog6ToothIcon className="h-5 w-5" />
                                    </ListItemPrefix>
                                    <Typography color="blue-gray" className="mr-auto font-normal">
                                        Paramètres
                                    </Typography>
                                </AccordionHeader>
                            </ListItem>
                            <AccordionBody className="py-1">
                                <List className="p-0">
                                    <ListItem onClick={() => handleLinkClick('/settings/account')}>
                                        <ListItemPrefix>
                                        </ListItemPrefix>
                                        Mon compte
                                    </ListItem>
                                    <ListItem onClick={() => handleLinkClick('/settings/conf')}>
                                        <ListItemPrefix>
                                        </ListItemPrefix>
                                        Configuration
                                    </ListItem>
                                    <ListItem onClick={() => handleLinkClick('/settings/users')}>
                                        <ListItemPrefix>
                                        </ListItemPrefix>
                                        Utilisateurs
                                    </ListItem>
                                </List>
                            </AccordionBody>
                        </Accordion>
                        <ListItem onClick={handleLogout} className="text-red-500">
                            <ListItemPrefix>
                                <PowerIcon className="h-5 w-5 text-red-500" />
                            </ListItemPrefix>
                            Se déconnecter
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </div>
    );
}
