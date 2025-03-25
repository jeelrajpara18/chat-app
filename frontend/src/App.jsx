/* eslint-disable no-unused-vars */
import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
function App() {
  let users = false;
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
