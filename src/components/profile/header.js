/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable quotes */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { Button, Popover} from "@mui/material";
import useUser from "../../hooks/use-user";
import {
  getUsersByUserId,
  isUserFollowingProfile,
  toggleFollow,
  updateLoggedInUserAvatar,
} from "../../services/firebase";
import UserContext from "../../context/user";
import { FirebaseStorage } from "../../lib/firebase";

export default function Header({
  photosCount,
  followerCount,
  setFollowerCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName,
    followers,
    following,
    username: profileUsername,
  },
  userInfor,
}) {
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);
  const activeBtnFollow = user?.username && user?.username !== profileUsername;
  const [confirmChange, setConfirmChange] = useState(false);
  const [changeAva, setChangeAva] = useState(null);
  const [popoverAnchorEl, setAnchorEl] = useState(null);
  const [followInfor, setFollowInfor] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    async function getFollowing() {
      const follow = await getUsersByUserId(following);
      console.log(follow);
      setFollowInfor(follow);
    }
    getFollowing();
  }, [following]);
  const openPopover = Boolean(popoverAnchorEl);
  const popoverId = openPopover ? "simple-popover" : undefined;
  const handleToggleFollow = async () => {
    setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
    setFollowerCount({
      followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1,
    });
    await toggleFollow(
      isFollowingProfile,
      user.docId,
      profileDocId,
      profileUserId,
      user.userId
    );
  };
  const handleChangeAvatar = (e) => {
    setChangeAva(e.target.files[0]);
    setConfirmChange(true);
  };
  const cancelChangeAva = () => {
    setChangeAva(null);
    setConfirmChange(false);
  };
  const saveChangeAva = (e) => {
    e.preventDefault();
    const upload = FirebaseStorage.ref(
      `/users/${user.userId}/avatars/${changeAva.name}`
    ).put(changeAva);
    upload.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        FirebaseStorage.ref(`/users/${user.userId}/avatars`)
          .child(changeAva.name)
          .getDownloadURL()
          .then((url) => {
            // console.log(url);
            alert("Thay đổi ảnh đại diện thành công!");
            updateLoggedInUserAvatar(user.docId, url);
            setChangeAva(null);
            setConfirmChange(false);
          });
      }
    );
  };
  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(
        user.username,
        profileUserId
      );
      setIsFollowingProfile(!!isFollowing);
    };

    if (user?.username && profileUserId) {
      isLoggedInUserFollowingProfile();
    }
  }, [user?.username, profileUserId]);

  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <div className="container flex justify-center items-center">
        {profileUsername ? (
          <div className="relative flex items-center justify-center h-fit">
            {changeAva !== null ? (
              <img
                className="rounded-full h-16 w-16 md:h-20 lg:h-40 md:w-20 lg:w-40 flex"
                alt={`${user?.username} profile picture`}
                // src={`/images/avatars/${profileUsername}.jpg`}
                src={URL.createObjectURL(changeAva)}
              />
            ) : (
              <img
                className="rounded-full h-16 w-16 md:h-20 lg:h-40 md:w-20 lg:w-40 flex"
                alt={`${user?.username} profile picture`}
                // src={`/images/avatars/${profileUsername}.jpg`}
                src={
                  userInfor.imageSrc
                    ? userInfor.imageSrc
                    : "/images/avatars/default.png"
                }
              />
            )}
            {
            // !user.imageSrc &&
              confirmChange === false &&
              profileUserId === user.userId && (
                <div className="absolute">
                  <Button
                    variant="contained"
                    component="label"
                    className="absolute rounded-lg"
                    size="small"
                  >
                    Upload Avatar
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleChangeAvatar}
                    />
                  </Button>
                </div>
              )}
            {
            // !user.imageSrc &&
              confirmChange === true &&
              profileUserId === user.userId && (
                <div className="absolute flex items-center">
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    color="error"
                    onClick={saveChangeAva}
                  >
                    Ok
                  </Button>
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    color="error"
                    onClick={cancelChangeAva}
                  >
                    Cancel
                  </Button>
                </div>
              )}
          </div>
        ) : (
          <img
            className="rounded-full h-16 w-16 md:h-20 lg:h-40 md:w-20 lg:w-40 flex"
            alt={`user's profile default picture`}
            src="/images/avatars/default.png"
          />
        )}
      </div>
      <div className="flex items-center justify-center flex-col col-span-2">
        <div className="container flex items-center">
          <p className="text-2xl mr-4">{profileUsername}</p>
          {activeBtnFollow && (
            <button
              className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
              type="button"
              onClick={handleToggleFollow}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleToggleFollow();
                }
              }}
            >
              {isFollowingProfile ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
        <div className="container flex mt-4 flex-col lg:flex-row">
          {!followers || !following ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              <p className="mr-10">
                <span className="font-bold">{photosCount}</span> photos
              </p>
              <p className="mr-10">
                <span className="font-bold">{followerCount}</span>
                {` `}
                {followerCount === 1 ? `follower` : `followers`}
              </p>
              <p className="mr-10">
                <span
                  className="font-bold cursor-pointer"
                  onClick={handleClick}
                >
                  {followInfor != null ? followInfor.length : 0} following
                </span>
                <Popover
                  id={popoverId}
                  open={openPopover}
                  anchorEl={popoverAnchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <div className="h-fit flex flex-col h-60 overflow-y-scroll">
                    {Array.isArray(followInfor) &&
                      followInfor.length > 0 &&
                      followInfor.map((follow) => (
                        <Link
                          key={follow.docId}
                          to={`/p/${follow.username}`}
                          className="cursor-pointer flex items-center justify-content-center p-3"
                          onClick={handleClose}
                        >
                          <img
                            className="rounded-full flex w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8"
                            alt={`${follow.username} profile picture`}
                            // src={`/images/avatars/${profileUsername}.jpg`}
                            src={
                              follow.imageSrc
                                ? follow.imageSrc
                                : "/images/avatars/default.png"
                            }
                          />
                          <span className="px-2">{follow.username}</span>
                        </Link>
                      ))}
                  </div>
                </Popover>
              </p>
            </>
          )}
        </div>
        <div className="container mt-4">
          <p className="font-medium">
            {!fullName ? <Skeleton count={1} height={24} /> : fullName}
          </p>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  photosCount: PropTypes.number.isRequired,
  followerCount: PropTypes.number.isRequired,
  setFollowerCount: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    docId: PropTypes.string,
    userId: PropTypes.string,
    fullName: PropTypes.string,
    username: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array,
  }).isRequired,
  userInfor: PropTypes.object,
};
