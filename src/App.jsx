import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MyCourses from "./pages/Teacher/MyCourses";
import MyLectures from "./pages/Teacher/MyLectures";
import MyProfile from "./pages/Teacher/MyProfile";
import Statistics from "./pages/Teacher/Statistics";
import Help from "./pages/Teacher/ Help";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import CreateCourse from "./pages/Teacher/CreateCourse/CreateCourse";
import CourseDetail from "./pages/Teacher/CreateCourse/CourseDetail";
import Login from "./pages/Teacher/Login";
import Cookies from "js-cookie";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = Cookies.get("tokenTeacher");
      const userIsLoggedIn = !!token;
      setIsLoggedIn(userIsLoggedIn);
    };

    checkLoginStatus();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        {isLoggedIn && (
          <>
            <Route path="/dashboard" element={<TeacherDashboard />} />
            <Route path="/create" element={<CreateCourse />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/my-lectures" element={<MyLectures />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/help" element={<Help />} />
            <Route path="/courseDetail/:courseId" element={<CourseDetail />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
