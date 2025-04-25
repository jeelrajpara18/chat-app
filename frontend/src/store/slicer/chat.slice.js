export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessageContacts: [],
  isUploading : false,
  isDownloading : false , 
  fileUploadedProgress : 0,
  fileDownloadProgress : 0,
  setIsUploading : (isUploading) => set({isUploading}),
  setIsDownloading : (isDownloading) => set({isDownloading}),
  setFileUploadedProgress : (fileUploadedProgress) => set({fileUploadedProgress}),
  setFileDownloadedProgress : (fileDownloadProgress) => set({fileDownloadProgress}),
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setDirectMessageContacts: (directMessageContacts) =>
    set({ directMessageContacts }),
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          receiverId:
            selectedChatType === "channel"
              ? message.receiverId
              : message.receiverId._id,
          senderId:
            selectedChatType === "channel"
              ? message.senderId
              : message.senderId._id,
        },
      ],
    });
  },
});
