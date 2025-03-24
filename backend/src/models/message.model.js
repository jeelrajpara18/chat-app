const messageSchema = new mongoose.Schema(
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
      },
      image: {
        type: String,
      },
      messageType: {
        type: String,
        enum: ["text", "image", "video", "file"],
        default: "text",
      },
      status: {
        type: String,
        enum: ["sent", "delivered", "read"],
        default: "sent",
      },
      reactions: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          reaction: {
            type: String,
            enum: ["like", "love", "laugh", "angry", "sad"],
          },
        },
      ],
      deletedBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    },
    { timestamps: true }
  );