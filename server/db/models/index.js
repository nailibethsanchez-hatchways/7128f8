const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
Conversation.hasMany(Message, { as: "readMessages" });
Conversation.hasMany(Message, { as: "unreadMessages" });

module.exports = {
  User,
  Conversation,
  Message
};
