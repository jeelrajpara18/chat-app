export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "auth";
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/signup`
export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`
export const LOGOUT_ROUTES = `${AUTH_ROUTES}/logout`
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`
export const UPDATE_USER_PROFILE = `${AUTH_ROUTES}/update-profile`
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/add-profile-image`
export const DELETE_PROFILE_IMAGE = `${AUTH_ROUTES}/remove-profile-image`

export const CONTACT_ROUTES = "api/contacts";
export const SEARCH_CONTACTS = `${CONTACT_ROUTES}/search-contact`;
export const GET_DM_LIST = `${CONTACT_ROUTES}/get-contacts`
export const GET_ALL_CONTACT = `${CONTACT_ROUTES}/get-all-contacts`

export const MESSAGE_ROUTES = "api/messages";
export const GET_ALL_MESSAGE = `${MESSAGE_ROUTES}/get-messages`
export const UPLOAD_FILES = `${MESSAGE_ROUTES}/upload-file`

export const GROUP_ROUTES = "api/groups";
export const CREATE_GROUP = `${GROUP_ROUTES}/create-group`;
export const GET_GROUP = `${GROUP_ROUTES}/get-group-users`