import React, { useEffect, useContext } from 'react';
import { Box, Badge } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { SocketContext } from '../../context/socket';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: '0 2px 10px 0 rgba(88,133,196,0.05)',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'grab',
    },
  },
  customBadge: {
    backgroundColor: '#3F92FF',
    color: 'white',
    right: 30,
  },
}));

const Chat = ({
  conversation,
  setActiveChat,
  activeConversation,
  setConversations,
}) => {
  const classes = useStyles();

  const socket = useContext(SocketContext);

  const { otherUser, totalUnreadMessages } = conversation;

  const conversationMessageSeen = totalUnreadMessages === 0;

  const handleClick = async (conversation) => {
    await setActiveChat(conversation.otherUser.username);
  };

  useEffect(() => {
    if (activeConversation === otherUser.username && conversation.messages[conversation.messages.length - 1]?.senderId === otherUser.id) {
      socket.emit('read-message', {
        conversationId: conversation.id,
      });
    }
  }, [activeConversation, otherUser, socket, conversation])

  useEffect(() => {
    const readMessages = async () => {
      if (
        activeConversation === otherUser.username &&
        totalUnreadMessages > 0
      ) {
        try {
          setConversations((prev) => {
            const allConversations = [...prev];
            allConversations.forEach((convo, idx) => {
              if (convo.id === conversation.id) {
                const convoCopy = { ...convo };
                const messagesCopy = convoCopy.messages.map((m) => {
                  return { ...m, isSeen: true };
                });
                convoCopy.messages = messagesCopy;
                convoCopy.totalUnreadMessages = 0;
                allConversations[idx] = convoCopy;
              }
            });
            return allConversations;
          });
          await axios.put('/api/messages', {
            read: true,
            otherUserId: otherUser.id,
            conversationId: conversation.id,
          });
        } catch (error) {
          console.error(error);
        }
      }
    };
    readMessages();
  }, [
    activeConversation,
    conversation,
    otherUser,
    totalUnreadMessages,
    setConversations,
    socket,
  ]);

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent
        conversation={conversation}
        isSeen={conversationMessageSeen}
      />
      <Badge
        classes={{ badge: classes.customBadge }}
        badgeContent={totalUnreadMessages}
      ></Badge>
    </Box>
  );
};

export default Chat;
