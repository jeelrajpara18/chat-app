/* eslint-disable no-unused-vars */
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import Chat from "./pages/chat/Chat";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { useAppStore } from "./store/index";
import { axiosInstance } from "./lib/axios";
import { GET_USER_INFO } from "./utils/constants";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};
function App() {
  const {userInfo, setUserInfo} = useAppStore();
  const [loading, setLoading] = useState();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axiosInstance.get(GET_USER_INFO);
        if(response.status === 200 && response.data._id){
          setUserInfo(response.data)
        }
        else{
          setUserInfo(undefined)
        }
        console.log({response})
      } catch (error) {
        setUserInfo(undefined)
        console.log({ error });
      }
      finally{
        setLoading(false)
      }
    };
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <>
    <div className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900 text-neutral-600 dark:text-white">

      <Routes>
        <Route path="*" element={<Navigate to="/auth" />} />
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/chat/"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        {/* <Route path="/groups" element={<Groups />} /> */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
      </div>
    </>
  );
}

export default App;
