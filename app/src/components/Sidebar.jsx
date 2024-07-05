import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { Card, Typography, List, ListItem, ListItemPrefix, Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { Cog6ToothIcon, PowerIcon, PresentationChartBarIcon, ChevronDownIcon, TableCellsIcon } from "@heroicons/react/24/outline";

import axios from 'axios';

import logo from '../assets/logo_nobg.jpg'



export function SidebarWithLogo() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
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
      window.location.reload();
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  return (
    <Card className="fixed h-[calc(100vh)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <Link to='/'>
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <img src={logo} alt="brand" className="h-14" />
        </div>
      </Link>
      <List>
        <Link to="/dashboard">
          <ListItem>
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard
          </ListItem>
        </Link>
        <Accordion
          open={open === 2}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 2}>
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
              <Link to="/register/questions">
                <ListItem>
                  <ListItemPrefix>
                  </ListItemPrefix>
                  Questions
                </ListItem>
              </Link>
              <Link to="/register/tests">
                <ListItem>
                  <ListItemPrefix>
                  </ListItemPrefix>
                  Tests
                </ListItem>
              </Link>
            </List>
          </AccordionBody>
        </Accordion>
        {admin ? (
          <Accordion
            open={open === 1}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
              />
            }
          >
            <ListItem className="p-0" selected={open === 1}>
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
                <Link to="/settings/account">
                  <ListItem>
                    <ListItemPrefix>
                    </ListItemPrefix>
                    Mon compte
                  </ListItem>
                </Link>
                <Link to="/settings/conf">
                  <ListItem>
                    <ListItemPrefix>
                    </ListItemPrefix>
                    Configuration
                  </ListItem>
                </Link>
                <Link to="/settings/users">
                  <ListItem>
                    <ListItemPrefix>
                    </ListItemPrefix>
                    Utilisateurs
                  </ListItem>
                </Link>
              </List>
            </AccordionBody>
          </Accordion>
        ) : (
          <Link to="/settings/account">
            <ListItem>
              <ListItemPrefix>
                <Cog6ToothIcon className="h-5 w-5" />
              </ListItemPrefix>
              Mon compte
            </ListItem>
          </Link>
        )}
        <ListItem onClick={handleLogout} className="text-red-500">
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5 text-red-500" />
          </ListItemPrefix>
          Se déconnecter
        </ListItem>
      </List>
    </Card>
  );
}
