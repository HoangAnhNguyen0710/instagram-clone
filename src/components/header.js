/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
/* eslint-disable quotes */
/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FirebaseContext from "../context/firebase";
import UserContext from "../context/user";
import * as ROUTES from "../constants/routes";
import useUser from "../hooks/use-user";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CreatePostPopup from "./create-post-popup/create-post";
import { Button, Fade, SwipeableDrawer, Tooltip } from "@mui/material";
import Search from "./search";
import { Popper } from "@material-ui/core";

const drawerBleeding = 56;

export default function Header() {
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [openPopper, setOpenPopper] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);
  const [searchDrawer, toggleDrawer] = React.useState(false);

  const handleOpenPopper = (e) => {
    setOpenPopper(!openPopper);
    setAnchorEl(e.currentTarget);
  }
  return (
    <>
      <CreatePostPopup
        open={open}
        handleCloseModal={handleCloseModal}
        user={user}
      />
      <div className="h-screen bg-white border-b border-gray-primary mb-8 px-2 lg:px-0 fixed w-1/6 border-r-2">
        <div className="container mx-auto max-w-screen-lg h-full">
          <div className="flex justify-between h-full flex-col">
            <div className="text-gray-700 flex flex-col pb-8">
              {user ? (
                <>
                  <div className="text-gray-700 text-center flex items-center align-items cursor-pointer">
                    <h4 className="md:m-2 flex justify-center items-center w-full py-3">
                      <Link to={ROUTES.DASHBOARD} aria-label="Instagram logo">
                        <img
                          src="/images/logo.png"
                          alt="Instagram"
                          className="mt-2 md:w-1/2 w-full"
                        />
                      </Link>
                    </h4>
                  </div>
                  <div className="my-2 hover:bg-gray-background">
                    <Link
                      to={ROUTES.DASHBOARD}
                      aria-label="Dashboard"
                      className="m-2 flex items-center rounded-md"
                    >
                      <svg
                        className="w-8 text-black-light cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>{" "}
                      <span className="px-2 hidden md:block font-medium">Home</span>
                    </Link>
                  </div>
                  <div className="my-2 flex items-center rounded-md hover:bg-gray-background text-black-light">
                    <Button
                      type="button"
                      color="inherit"
                      onClick={() => toggleDrawer(true)}
                    >
                      <SearchIcon fontSize="large" />{" "}
                      <span className="md:px-2 hidden md:block text-black-light capitalize">
                        Search
                      </span>
                    </Button>
                  </div>
                  <div className="my-1 hover:bg-gray-background">
                    <Link
                      to={ROUTES.MESSAGES}
                      aria-label="Messages"
                      className="m-2 flex items-center rounded-md"
                    >
                      <ChatBubbleOutlineIcon fontSize="large" />{" "}
                      <span className="px-2 hidden md:block font-medium">Messages</span>
                    </Link>
                  </div>
                  <div className="my-2 hover:bg-gray-background">
                    <Tooltip title="Post an article">
                      <button
                        type="button"
                        className="m-2 flex items-center rounded-md"
                        onClick={handleOpenModal}
                      >
                        <AddCircleOutlineIcon fontSize="large" />{" "}
                        <span className="px-2 hidden md:block font-medium">Post</span>
                      </button>
                    </Tooltip>
                  </div>
                  <div className="my-2 hover:bg-gray-background">
                    <Link
                      to={`/p/${user?.username}`}
                      className="hidden lg:flex items-center cursor-pointer m-2 rounded-md"
                    >
                      <img
                        className="rounded-full h-8 w-8 flex border"
                        // src={`/images/avatars/${user?.username}.jpg`}
                        src={
                          user.imageSrc
                            ? user.imageSrc
                            : "/images/avatars/default.png"
                        }
                        alt={`${user?.username} profile`}
                      />
                      <span className="px-2 hidden md:block font-medium">
                        {user?.username}
                      </span>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="my-2">
                    <Link to={ROUTES.LOGIN}>
                      <button
                        type="button"
                        className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
                      >
                        <span className="px-2 hidden md:block">Login</span>
                      </button>
                    </Link>
                  </div>
                  <div className="my-2">
                    <Link to={ROUTES.SIGN_UP}>
                      <button
                        type="button"
                        className="font-bold text-sm rounded text-blue-medium w-20 h-8"
                      >
                        <span className="px-2 hidden md:block">Sign Up</span>
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </div>
            <div>
            <div className="my-2 hover:bg-gray-primary">
            <Button type="button" onClick={(e)=>handleOpenPopper(e)} color="inherit">
                <MenuIcon fontSize="large" /> <span className="capitalize md:px-2 hidden md:block">More</span>
              </Button>
            </div>
              <Popper open={openPopper} placement="top-start" anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <div className="my-2 hover:bg-gray-background">
                    <button
                      type="button"
                      data-testid="sign-out"
                      title="Sign Out"
                      className="flex m-2 items-center rounded-md"
                      onClick={() => {
                        firebase.auth().signOut();
                        history.push(ROUTES.LOGIN);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          firebase.auth().signOut();
                          history.push(ROUTES.LOGIN);
                        }
                      }}
                    >
                      <svg
                        className="w-8 text-black-light cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>{" "}
                      <span className="px-2 hidden md:block">Logout</span>
                    </button>
                  </div>
                  </Fade>
                )}
              </Popper>
            </div>
          </div>
        </div>
      </div>
      <SwipeableDrawer
        anchor="top"
        open={searchDrawer}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Search />
      </SwipeableDrawer>
    </>
  );
}
