export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/signup`
export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`
export const LOGOUT_ROUTES = `${AUTH_ROUTES}/logout`
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`
export const UPDATE_USER_PROFILE = `${AUTH_ROUTES}/update-profile`

export const CONTACT_ROUTES = "api/contacts";
export const SEARCH_CONTACTS = `${CONTACT_ROUTES}/search-contact`