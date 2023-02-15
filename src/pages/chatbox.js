/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
import { useEffect, useContext, useState } from "react";
import PropTypes from "prop-types";
import { ColorRing } from "react-loader-spinner";
import Header from "../components/header";
import useUser from "../hooks/use-user";
import LoggedInUserContext from "../context/logged-in-user";
import ChatBox from "../components/chatbox";
// import UserContext from "../context/user";

export default function ChatBoxScreen({ user: loggedInUser }) {
  const { user } = useUser(loggedInUser.uid);
  const [loader, setLoader] = useState(true);
  //   const { currentUser: loggedIn } = useContext(UserContext);
  useEffect(() => {
    document.title = "Instagram";
    if(user) setLoader(false);
  }, [user]);

  return (
    <LoggedInUserContext.Provider value={{ user }}>
      <div className="bg-gray-background flex">
      <div className='w-1/6'>
        <Header />
        </div>
      <div className='w-5/6'>
        <div className="grid grid-cols-1 gap-4 justify-between mx-auto max-w-screen-lg px-2 m-2 lg:p-4">
        {user ?  (
            <ChatBox following={user.following} user={user}/>
        ): <div className="w-full flex items-center justify-center"><ColorRing visible={loader}/></div>
        }
        </div>
      </div>
      </div>
    </LoggedInUserContext.Provider>
  );
}

ChatBoxScreen.propTypes = {
  user: PropTypes.object,
};
