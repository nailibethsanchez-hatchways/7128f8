const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const ConversationUser = require("./conversationUser")

// associations

User.hasMany(ConversationUser);
User.belongsToMany(Conversation, {through: 'ConversationUser', as: 'userConversation'})
Conversation.hasMany(ConversationUser);
Conversation.belongsToMany(User, { through: 'ConversationUser', as: 'conversationUser' })
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
Conversation.hasMany(Message, { as: "unreadMessages" });

// This links a MessageId to a ConversationUser to specify the last message read by a user in a conversation.
ConversationUser.belongsTo(Message, { as: "lastReadMessage" });


module.exports = {
  User,
  Conversation,
  Message,
  ConversationUser
};
