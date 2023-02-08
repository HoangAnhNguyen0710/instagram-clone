/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable quotes */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/media-has-caption */
import { Box, Modal, Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import GridOnIcon from "@mui/icons-material/GridOn";
import { useState } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PostDetail from "./post-detail";
import Post from "../post";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
const postStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Photos({ photos }) {
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => setOpenModal(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleOpenModal = (photo) => {
    setCurrentPhoto(photo);
    setOpenModal(true);
  };
  return (
    <div className="h-16 border-t border-gray-primary mt-12 px-4 lg:px-0 flex flex-col items-center">
      <Box
        className="px-6 flex justify-center items-center"
        sx={{ width: "100%" }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          aria-label="basic tabs example"
        >
          <Tab
            label={
              <span
                className="flex justify-center items-center"
                {...a11yProps(0)}
              >
                <GridOnIcon /> <span className="px-2">Bài viết</span>
              </span>
            }
          />
          <Tab
            label={
              <span
                className="flex justify-center items-center"
                {...a11yProps(1)}
              >
                <BookmarkBorderIcon /> <span className="px-2">Danh sách</span>
              </span>
            }
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 mb-12">
          {!photos ? (
            <>
              <Skeleton count={12} width={320} height={400} />
            </>
          ) : photos.length > 0 ? (
            photos.map((photo) => (
              <>
                <div key={photo.docId} className="relative group">
                  {photo.fileType === "video/mp4" ? (
                    <video autoPlay={true} muted={false}>
                      <source src={photo.imageSrc} type="video/mp4" />
                      <track label="" />
                    </video>
                  ) : (
                    <img src={photo.imageSrc} alt={photo.caption} />
                  )}

                  <div
                    className="absolute bottom-0 left-0 bg-gray-200 z-10 w-full justify-evenly items-center h-full bg-black-faded group-hover:flex hidden"
                    onClick={() => handleOpenModal(photo)}
                  >
                    <p className="flex items-center text-white font-bold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-8 mr-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {photo.likes.length}
                    </p>

                    <p className="flex items-center text-white font-bold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-8 mr-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {photo.comments.length}
                    </p>
                  </div>
                </div>
              </>
            ))
          ) : null}
        </div>
        {!photos ||
          (photos.length === 0 && (
            <p className="text-center text-2xl">No Posts Yet</p>
          ))}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <div className="col-span-2 lg:col-span-1 mt-6 mb-12">
          {!photos ? (
            <Skeleton count={4} width={640} height={500} className="mb-5" />
          ) : (
            photos.map((content) => (
              <Post key={content.docId} content={content} />
            ))
          )}
        </div>
        {!photos ||
          (photos.length === 0 && (
            <p className="text-center text-2xl">No Posts Yet</p>
          ))}
      </TabPanel>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={postStyle}
          className="bg-white h-4/5 w-4/5 overflow-y-scroll"
        >
          <PostDetail content={currentPhoto} />
        </div>
      </Modal>
    </div>
  );
}

Photos.propTypes = {
  photos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
};
