export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessageContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadedProgress: 0,
  fileDownloadProgress: 0,
  groups: [],
  setGroups: (groups) => set({ groups }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  setFileUploadedProgress: (fileUploadedProgress) =>
    set({ fileUploadedProgress }),
  setFileDownloadedProgress: (fileDownloadProgress) =>
    set({ fileDownloadProgress }),
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
  addGroups: (group) => {
    const groups = get().groups;
    set({
      groups: [group, ...groups],
    });
  },
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          receiverId:
            selectedChatType === "group"
              ? message.receiverId
              : message.receiverId._id,
          senderId:
            selectedChatType === "group"
              ? message.senderId
              : message.senderId._id,
        },
      ],
    });
  },
});
