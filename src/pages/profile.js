/* eslint-disable prettier/prettier */
import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserByUsername } from '../services/firebase';
import * as ROUTES from '../constants/routes';
import Header from '../components/header';
import UserProfile from '../components/profile';

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    async function checkUserExists() {
      const [user] = await getUserByUsername(username);
      if (user?.userId) {
        setUser(user);
      } else {
        history.push(ROUTES.NOT_FOUND);
      }
    }

    checkUserExists();
  }, [username, history]);

  return user?.username ? (
    <div className="bg-gray-background flex">
      <div className='w-1/6'>
        <Header />
        </div>
        <div className='w-5/6'>
      <div className="mx-auto max-w-screen-lg">
        <UserProfile user={user} />
      </div>
      </div>
    </div>
  ) : null;
}
