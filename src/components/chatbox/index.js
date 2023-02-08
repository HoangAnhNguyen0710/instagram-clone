/* eslint-disable prettier/prettier */
/* eslint-disable prefer-template */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable prefer-const */
/* eslint-disable import/order */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-typos */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import { firebase } from "../../lib/firebase";
import { getUserByUsername, getUsersByUserId } from "../../services/firebase";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import SendIcon from "@mui/icons-material/Send";
import PropTypes from "prop-types";
import moment from "moment";
import { v4 } from "uuid";
import { Alert, Button, Snackbar } from "@mui/material";
import { formatDistance } from "date-fns";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "80vh",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },
});

export default function ChatBox({ following, user }) {
  const classes = useStyles();
  const [followInfor, setFollowInfor] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [recvMessages, setRecvMessage] = useState([]);
  const [totalList, setTotalList] = useState([]);
  const [formInput, setFormInput] = useState("");
  const [findUser, setFindhUser] = useState(null);
  const [msg, setMSG] = useState("");

  useEffect(() => {
    async function getFollowing() {

      const follow = await getUsersByUserId(following);
      setSelectedUser(following[0]);
      setFollowInfor(follow);

    }
    if(following !== []) {
      getFollowing();
    }
  }, [following]);

  useEffect(() => {
    let totalList = messages.concat(recvMessages);
    const sortList = totalList.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated));
    setTotalList(sortList);
  }, [messages, recvMessages]);

  useEffect(() => {
    async function getMessageList() {
      await firebase
        .firestore()
        .collection("messages")
        .where("receive_Id", "==", selectedUser)
        .where("sender_Id", "==", user.userId)
        .onSnapshot((doc) =>
          setMessages(doc.docs.map((document) => document.data()))
        );

      await firebase
        .firestore()
        .collection("messages")
        .where("receive_Id", "==", user.userId)
        .where("sender_Id", "==", selectedUser)
        .onSnapshot((doc) =>
          setRecvMessage(doc.docs.map((document) => document.data()))
        );
    }
      if(selectedUser != null) {
         getMessageList();
      }
  }, [selectedUser]);

  const HandleSearchUser = (e) => {
    setFormInput(e.target.value);
    setFindhUser(null);
  }
  const searchUser = async (e) => {
    e.preventDefault();
    const searchUser = await getUserByUsername(formInput);
    if(searchUser.length > 0) {
      setFindhUser(searchUser); 
    } 
    else {
      setMSG("Cannot find user with name " + formInput);
    }

  }
  const sendMessage = async (e) => {
    e.preventDefault();
    const messageData = {
      sender_Id: user.userId,
      receive_Id: selectedUser,
      content: inputValue,
      dateCreated: moment().format("LLLL"),
      comments: [],
      likes: [],
      docId: v4(),
    };

    firebase
      .firestore()
      .collection("messages")
      .doc(messageData.docId)
      .set(messageData)
      .then(() => {
        setInputValue("");
      });
  };

  const changeReceive = (receive) => {
    setSelectedUser(receive);
    setInputValue("");
  };

  const handleCloseSnackBar = () => {
    setMSG("");
  };

  return (
    <div>
      <Grid container className="overflow-y-hidden">
        <Grid item xs={12}>
          <Typography variant="h5" className="header-message py-3">
            Inbox
          </Typography>
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <Divider />
          <Grid item xs={12} style={{ padding: "10px" }}>
            <form onSubmit={searchUser}>
            <TextField
              id="outlined-basic-email"
              placeholder="Search"
              variant="outlined"
              size="small"
              value={formInput}
              onChange={HandleSearchUser}
              fullWidth
            />
            </form>
          </Grid>
          <Divider />
          <List>
          {findUser != null && findUser.map((infor) => (
          followInfor ? !followInfor.includes(infor) &&
                  <ListItem
                    key={infor.docId}
                    selected={selectedUser === infor.userId}
                    onClick={() => changeReceive(infor.userId)}
                  >
                    <ListItemIcon>
                      <Avatar
                        alt={infor.username}
                        src={
                          infor.imageSrc
                            ? infor.imageSrc
                            : "/images/avatars/default.png"
                        }
                      />
                    </ListItemIcon>
                    <ListItemText primary={infor.username}></ListItemText>
                  </ListItem>
                :
                 <ListItem
                   key={infor.docId}
                   selected={selectedUser === infor.userId}
                   onClick={() => changeReceive(infor.userId)}
                 >
                   <ListItemIcon>
                     <Avatar
                       alt={infor.username}
                       src={
                         infor.imageSrc
                           ? infor.imageSrc
                           : "/images/avatars/default.png"
                       }
                     />
                   </ListItemIcon>
                   <ListItemText primary={infor.username}></ListItemText>
                 </ListItem>
                )
                )}
          <Divider />
            {followInfor && (
              <>
                {followInfor.map((infor) => (
                  <ListItem
                    key={infor.docId}
                    selected={selectedUser === infor.userId}
                    onClick={() => changeReceive(infor.userId)}
                  >
                    <ListItemIcon>
                      <Avatar
                        alt={infor.username}
                        src={
                          infor.imageSrc
                            ? infor.imageSrc
                            : "/images/avatars/default.png"
                        }
                      />
                    </ListItemIcon>
                    <ListItemText primary={infor.username}></ListItemText>
                  </ListItem>
                ))}
              </>
            )}
          </List>
        </Grid>
        <Grid item xs={9}>
          <List className={classes.messageArea}>
            {totalList.map((message) => (
              message.sender_Id === user.userId ?
              <ListItem key={message.docId}>
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText
                      align="right"
                      primary={message.content}
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText
                      align="right"
                      secondary={
                        typeof message.dateCreated === "number"
                          ? formatDistance(message.dateCreated, new Date())
                          : formatDistance(
                              new Date(message.dateCreated),
                              new Date()
                            )
                      }
                    ></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
              : 
              <ListItem key={message.docId}>
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText
                      align="left"
                      primary={message.content}
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText
                      align="right"
                      secondary={
                        typeof message.dateCreated === "number"
                          ? formatDistance(message.dateCreated, new Date())
                          : formatDistance(
                              new Date(message.dateCreated),
                              new Date()
                            )
                      }
                    ></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Divider />
          <form onSubmit={sendMessage}>
            <Grid container style={{ padding: "20px" }}>
              <Grid item xs={11}>
                <TextField
                  id="outlined-basic-email"
                  label="Type Something"
                  fullWidth
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </Grid>
              <Grid xs={1} align="right">
                <Button color="primary" aria-label="add" type="submit">
                  <SendIcon />
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
      <Snackbar
          open={msg === "" ? false : true}
          autoHideDuration={1500}
          onClose={handleCloseSnackBar}
        >
          <Alert
            onClose={handleCloseSnackBar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {msg}
          </Alert>
        </Snackbar>
    </div>
  );
}

ChatBox.PropTypes = {
  following: PropTypes.array,
  user: PropTypes.object,
};
