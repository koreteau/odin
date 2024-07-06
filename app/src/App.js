import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Spinner } from "@material-tailwind/react";
import axios from 'axios';

import { Login } from './components/Login';
import { SidebarWithLogo } from "./components/Sidebar";
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminSinglePageUser } from './components/admin/AdminSinglePageUser';
import { DefaultDrawerSidebar } from './components/DrawerSideBar';
import { AdminHome } from './components/admin/AdminHome';
import { AdminTests } from './components/admin/AdminTests';
import { AdminSinglePageTest } from './components/admin/AdminSinglePageTest';
import { AdminQuestions } from './components/admin/AdminQuestions';
import { AdminCreateQuestion } from './components/admin/AdminCreateQuestion';
import { AdminSinglePageQuestion } from './components/admin/AdminSinglePageQuestion';

function PageTitle({ title }) {
  useEffect(() => {
    document.title = 'ODIN - ' + title;
  }, [title]);

  return null;
}

function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowWidth;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const windowWidth = useWindowWidth();

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

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <Spinner className="h-20 w-20" color='purple'/>
      </div>
    );
  }

  return (
    <Router>
      {user ? (
        <div style={{ display: 'flex' }}>
          {windowWidth > 1000 && <SidebarWithLogo />}
          <div className={`w-full ${windowWidth > 1000 ? 'pl-[20rem]' : ''}`}>
            <Routes>
              {user.role === 'admin' ? (
                <>
                  <Route path="/" element={<><PageTitle title="Accueil" /><AdminHome /></>} />

                  <Route path="/register/questions" element={<><PageTitle title="Questions" /><AdminQuestions /> </>} />
                  <Route path="/register/questions/:id" element={<><PageTitle title="Questions" /><AdminSinglePageQuestion /> </>} />
                  <Route path="/register/questions/new" element={<><PageTitle title="Questions" /><AdminCreateQuestion /> </>} />

                  <Route path="/register/tests" element={<><PageTitle title="Tests" /><AdminTests /> </>} />
                  <Route path="/register/tests/:id" element={<><PageTitle title="Tests" /><AdminSinglePageTest /> </>} />

                  <Route path="/settings/users" element={<><PageTitle title="Membres" /><AdminUsers /></>} />
                  <Route path="/settings/users/:id" element={<><PageTitle title="Membres" /><AdminSinglePageUser /></>} />
                </>
              ) : (
                <Route path="/" element={<><PageTitle title="Accueil" />Home</>} />
              )}
              <Route path="*" element={<><PageTitle title="Page non trouvée" />NotFound</>} />
            </Routes>
          </div>
          {windowWidth <= 1000 && <DefaultDrawerSidebar />}
        </div>
      ) : (
        <Login />
      )}
    </Router>
  );
}