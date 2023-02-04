/* eslint-disable prettier/prettier */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable quotes */
/* eslint-disable jsx-a11y/img-redundant-alt */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserByUserId } from '../../services/firebase';


export default function Header({ username, userId }) {
  const [user, setUser] = useState([]);
  useEffect(() => {
    async function getUserObjByUserId(userId) {
      const [user] = await getUserByUserId(userId);
      setUser(user || {});
    }

    if (userId) {
      getUserObjByUserId(userId);
    }
  }, [userId]);
  return (
    <div className="flex h-4 p-4 py-8">
      <div className="flex items-center">
        <Link to={`/p/${username}`} className="flex items-center">
          <img
            className="rounded-full h-8 w-8 flex mr-3"
            src=
            {user.imageSrc !== undefined ? user.imageSrc : "/images/avatars/default.png"}
            alt={`${username} profile picture`}
          />
          <p className="font-bold">{username}</p>
        </Link>
      </div>
    </div>
  );
}

Header.propTypes = {
  username: PropTypes.string.isRequired,
  userId: PropTypes.string
};
