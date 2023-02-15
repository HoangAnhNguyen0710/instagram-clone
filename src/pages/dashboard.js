/* eslint-disable prettier/prettier */
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/header';
import Timeline from '../components/timeline';
import Sidebar from '../components/sidebar';
import useUser from '../hooks/use-user';
import LoggedInUserContext from '../context/logged-in-user';

export default function Dashboard({ user: loggedInUser }) {
  const { user } = useUser(loggedInUser.uid);

  useEffect(() => {
    document.title = 'Instagram';
  }, []);

  return (
    <LoggedInUserContext.Provider value={{ user }}>
      <div className="bg-gray-background flex">
        <div className='w-1/6'>
        <Header />
        </div>
        <div className='w-5/6'>
        <div className="flex flex-col md:flex-row justify-between mx-auto max-w-screen-lg md:px-2 m-2 lg:p-4">
          <div className='w-full md:w-1/2 flex justify-end md:p-4 p-2 lg:pl-8'>
          <Timeline />
          </div>
          <div className='w-full md:w-1/2 flex justify-start md:p-4 lg:pl-8'>
          <Sidebar />
          </div>
        </div>
        </div>
      </div>
    </LoggedInUserContext.Provider>
  );
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired
};
