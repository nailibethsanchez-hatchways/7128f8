import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import { makeStyles } from '@material-ui/core/styles';
import SeenBadge from './SeenBadge';
import axios from 'axios';

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
}));

const Chat = ({
  conversation,
  setActiveChat,
  activeConversation,
  setConversations,
}) => {
  const classes = useStyles();

  const { otherUser, messages } = conversation;

  const messagesToSee = messages.filter((m) => {
      return !m.isSeen && otherUser.id === m.senderId;
  }).length;

  const conversationMessageSeen = messagesToSee === 0;

  const handleClick = async (conversation) => {
    await setActiveChat(conversation.otherUser.username);
  };

  useEffect(() => {
    const readMessages = async () => {
      if (
        activeConversation === conversation.otherUser.username &&
        messagesToSee > 0
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
  }, [activeConversation, conversation, otherUser, messagesToSee, setConversations]);

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      <SeenBadge
        isSeen={conversationMessageSeen}
        messagesToSee={messagesToSee}
      />
    </Box>
  );
};

export default Chat;
