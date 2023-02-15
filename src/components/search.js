/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable arrow-body-style */
import { IconButton, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useContext } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import UserContext from "../context/user";
import { getAllOtherUsers } from "../services/firebase";
import useUser from "../hooks/use-user";
import SuggestedProfile from "./sidebar/suggested-profile";


export default function Search ({ userId }) {
  const [inputValue, setInputValue] = React.useState("");
//   const { user } = useContext(UserContext);
const { user: loggedInUser } = useContext(UserContext);
const { user } = useUser(loggedInUser?.uid);
  const [fullList, setFullList] = React.useState([]);
  const [sortList, setSortList] = React.useState([]);
  useEffect(() => {
     async function getAllOtherUser() {
     
        const result = await getAllOtherUsers(user.userId);
        setFullList(result);
        
     }
     if(user) {
     getAllOtherUser();
     }
     
  }, [user]);
  useEffect(()=> {
    if(inputValue !== ""){
     const findList = fullList.filter((search) => search.username.includes(inputValue))
    //  console.log(findList);
     setSortList(findList);
    }
    else setSortList([]);
  }, [inputValue])
  return (
    <>
      <div className="flex justify-center items-center h-fit flex-col">
        <form className="w-1/2 flex justify-center">
          <InputBase
            sx={{ m: 1, flex: 1, border: 1 }}
            placeholder="Search user ..."
            inputProps={{ "aria-label": "Search user ..." }}
            size="small"
            className="rounded-lg px-2 py-1"
            value={inputValue}
            onChange={(e)=>setInputValue(e.target.value)}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </form>
        <div className="w-1/2 flex justify-center flex-col">
           {sortList !== [] ? 
           <>
           <div className="p-2 max-h-72 overflow-y-auto">
            {sortList.map((profile) =>
            <div className="flex items-center p-2 hover:bg-gray-primary">
            <img
              className="rounded-full border w-8 h-8 flex mr-3"
              src=
                {profile.imageSrc !== undefined ? profile.imageSrc : "/images/avatars/default.png"}
              alt=""
            />
            <Link to={`/p/${profile.username}`}>
              <p className="font-bold text-sm">{profile.username}</p>
            </Link>
          </div>
            )}
            </div>
           </>: <></>}
        </div>
      </div>
    </>
  );
};

Search.propTypes = {
   userId: PropTypes.string,
}

