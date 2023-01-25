/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable arrow-body-style */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable quotes */
import {
  Alert,
  Button,
  Divider,
  Modal,
  Snackbar,
  Step,
  Stepper,
} from "@mui/material";
import React, { useCallback, useContext, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { v4 } from "uuid";
import moment from "moment/moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import JoditEditor from "jodit-react";
import dragAndDropIcon from "../../assets/img/icons/dragNdrop.png";
import { FirebaseStorage } from "../../lib/firebase";
import FirebaseContext from "../../context/firebase";

export default function CreatePostPopup(props) {
  const open = props.open;
  const user = props.user;
  const handleCloseModal = props.handleCloseModal;
  const steps = ["Create new post", "Settings", "Create new post"];
  const [activeStep, setActiveStep] = React.useState(1);
  const [currentFile, setCurrentFile] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [msg, setMSG] = React.useState("");
  const [messageType, setMessageType] = React.useState(null);
  const { firebase } = useContext(FirebaseContext);

  const editorConfig = {
    placeholder: "Thêm chú thích...",
    colors: ["#ff0000", "#00ff00", "#0000ff"],
    buttonsXS: ["italic", "Underline", "Table", "Font"],
  };
  const editorRef = React.useRef(null);

  const createPost = (e) => {
    e.preventDefault();
    const upload =FirebaseStorage.ref(`/posts/${currentFile.file.name}`).put(currentFile.file);
    upload.on(
    "state_changed",
    snapshot => {},
    error => {console.log(error)},
    () => {
      FirebaseStorage
      .ref("posts")
      .child(currentFile.file.name)
      .getDownloadURL()
      .then((url) => {
        console.log(url)
        const postData = {
          userId: user.userId,
          caption: inputValue,
          imageSrc: url,
          dateCreated: moment().format('LLLL'),
          comments: [],
          likes: [],
          docId: v4(),
          fileType: currentFile.file.type,
        };
      firebase
      .firestore()
      .collection('photos').doc(postData.docId) 
      .set(postData).then(() => {
        setMSG(
          "Uploaded post successfully"
        );
        setMessageType("success");
      });
      });
    }
   )
  };

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    // console.log(acceptedFiles[0]);
    if (
      acceptedFiles[0].type.includes("image/") ||
      (acceptedFiles[0].type.includes("video/") &&
        acceptedFiles[0].size < 1028 * 1028 * 15)
    ) {
      setCurrentFile({
        ...currentFile,
        file: acceptedFiles[0],
        filepreview: URL.createObjectURL(acceptedFiles[0]),
      });
      // console.log(acceptedFiles[0].type);
    } else {
      setMSG(
        "Invalid input file type (not video or image) or file size is bigger than 15MB"
      );
      setMessageType("error");
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    if (activeStep === 1 && currentFile !== null) setActiveStep(2);
  }, [currentFile]);

  const handleCloseSnackBar = () => {
    setMSG("");
    if(messageType === "success")  handleCloseModal(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex items-center justify-center"
    >
      <div className="w-fit bg-white m-3 rounded-lg h-2/3 flex flex-col">
        <Snackbar
          open={msg === "" ? false : true}
          autoHideDuration={3000}
          onClose={handleCloseSnackBar}
        >
          <Alert
            onClose={handleCloseSnackBar}
            severity={messageType !== null ? messageType : "info"}
            sx={{ width: "100%" }}
          >
            {msg}
          </Alert>
        </Snackbar>
        <Stepper activeStep={activeStep} className="h-12 w-full">
          <div className="flex justify-center w-full">
            {activeStep !== 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-2 justify-self-start w-1/6"
              >
                <ArrowBackIcon />
              </button>
            ) : (
              <div className="px-2 invisible w-1/6">
                <ArrowBackIcon />
              </div>
            )}
            <span className="p-3 font-medium w-4/6 flex justify-center">
              {steps[activeStep - 1]}
            </span>
            {activeStep !== 3 && currentFile !== null ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-2 justify-self-end w-1/6"
              >
                Next
              </button>
            ) : (
              <div className="px-2 invisible w-1/6">Next</div>
            )}
            {activeStep === 3 && currentFile !== null ? (
              <button
                type="button"
                onClick={createPost}
                className="px-2 justify-self-end w-1/6"
              >
                Post
              </button>
            ) : (
              <div className="px-2 invisible w-1/6">Next</div>
            )}
          </div>
        </Stepper>
        <Divider />
        <div className="flex justify-center overflow-hidden h-full rounded-b-lg">
          <div className="py-6 flex items-center justify-center h-full bg-white w-96">
            <Step key={activeStep}>
              <div className="flex items-center justify-center">
                {activeStep === 1 && (
                  <>
                    <div
                      className="flex flex-col justify-center items-center px-4"
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <img src={dragAndDropIcon} alt="" className="w-1/2 m-3" />
                      {isDragActive ? (
                        <p className="p-3">Drop the files here ...</p>
                      ) : (
                        <p className="p-3 text-lg">Kéo ảnh và video vào đây</p>
                      )}
                      <Button
                        variant="contained"
                        component="label"
                        size="small"
                      >
                        <span className="text-sm">Chọn từ máy tính</span>
                        {/* <input hidden accept="image/*" type="file" /> */}
                      </Button>
                    </div>
                  </>
                )}
                {activeStep >= 2 && (
                  <div className="w-full h-full overflow-hidden">
                    {currentFile !== null &&
                      currentFile.file.type.includes("image/") && (
                        <img
                          src={currentFile.filepreview}
                          alt=""
                          className="h-full w-full"
                        ></img>
                      )}
                    {currentFile !== null &&
                      currentFile.file.type.includes("video/") && (
                        <video className="h-full w-full" autoPlay>
                          <source
                            src={currentFile.filepreview}
                            type="video/mp4"
                          />
                          <track label="" />
                        </video>
                      )}
                  </div>
                )}
              </div>
            </Step>
          </div>
          <Step>
            {activeStep === 3 && (
              <div className="w-96 h-full p-3 overflow-y-scroll flex flex-col">
                <div className=" items-center cursor-pointer pb-6">
                  <div className="flex items-center">
                    <img
                      className="rounded-full h-8 w-8 flex"
                      src={
                        user.imageSrc ? user.imageSrc : "/images/avatars/default.png"
                      }
                      alt={`${user?.username} profile`}
                    />
                    <span className="px-3 font-medium">{user?.username}</span>
                  </div>
                </div>
                <form onSubmit={createPost}>
                  <JoditEditor
                    config={editorConfig}
                    ref={editorRef}
                    value={inputValue}
                    tabIndex={1} // tabIndex of textarea
                    onBlur={(newContent) => setInputValue(newContent)} // preferred to use only this option to update the content for performance reasons
                    onChange={(newContent) => {}}
                  />
                </form>
              </div>
            )}
          </Step>
        </div>
      </div>
    </Modal>
  );
}
