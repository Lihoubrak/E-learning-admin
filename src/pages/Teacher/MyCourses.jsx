import React, { useEffect, useState } from "react";
import { FaBook, FaPeopleCarry, FaStar } from "react-icons/fa";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Typography,
} from "@mui/material";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import Layout from "../Layout";
import { TokenRequest } from "../../RequestMethod/Request";
const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await TokenRequest.get("/courses/course/teacher");
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Loading state check
  if (loading) {
    return <Layout>Loading...</Layout>;
  }

  // No courses available UI
  if (courses.length === 0) {
    return (
      <Layout>
        <div className="p-6 space-y-4 pt-20">
          <p>No courses available. Create a course to get started.</p>
          <Link to={"/create"}>
            <button className="py-3 px-10 text-white font-bold bg-green-400 rounded-lg shadow-md">
              Create
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Calculate statistics and most popular course
  const totalStudents = courses.reduce(
    (acc, course) => acc + parseInt(course.courseTotalRegister),
    0
  );
  const totalCourses = courses.length;
  const averageStudentsPerCourse = totalStudents / totalCourses;
  const mostPopularCourse = courses.reduce((prev, current) =>
    prev.courseTotalRegister > current.courseTotalRegister ? prev : current
  );
  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchInput.toLowerCase())
  );
  return (
    <Layout>
      <div className="p-6 space-y-4 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 bg-orange-300 rounded-md text-center">
            <FaBook size={30} className="text-blue-600 mb-2" />
            <h3 className="text-lg font-semibold">{totalCourses} Courses</h3>
          </div>
          <div className="p-5 bg-orange-300 rounded-md text-center">
            <FaPeopleCarry size={30} className="text-green-600 mb-2" />
            <h3 className="text-lg font-semibold">{totalStudents} Students</h3>
          </div>
          <div className="p-5 bg-orange-300 rounded-md text-center">
            <span className="text-yellow-600 mb-2 text-4xl">
              {averageStudentsPerCourse.toFixed(1)}
            </span>
            <p className="text-sm text-gray-600">Average Students per Course</p>
          </div>
          <div className="p-5 bg-orange-300 rounded-md text-center">
            <FaStar size={30} className="text-yellow-600 mb-2" />
            <h3 className="text-lg font-semibold">
              {mostPopularCourse.courseName}
            </h3>
            <p className="text-sm text-gray-600">
              Most Popular Course ({mostPopularCourse.students} Students)
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center ">
          <div className="px-4 ">
            <Link to={"/create"}>
              <button className="py-3 px-10  text-white font-bold bg-green-400 rounded-lg shadow-md">
                Create
              </button>
            </Link>
          </div>
          <div className="px-4 py-3 bg-gray-200 rounded-lg shadow-md">
            <div className="flex items-center">
              <CiSearch className="text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-2 focus:outline-none rounded-md bg-transparent font-bold focus:text-blue-500"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>

          <div className="px-4 ">
            <select
              name=""
              id=""
              className="py-3 px-10 rounded-lg shadow-md text-white font-bold bg-green-400 focus:border-none focus:outline-none"
            >
              <option value="" disabled selected hidden>
                Fliter
              </option>
              <option value="last">Last</option>
              <option value="old">Old</option>
            </select>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto mt-4 ">
          <List>
            {filteredCourses.map((course) => (
              <React.Fragment key={course.id}>
                <Link to={`/courseDetail/${course.id}`}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <FaBook />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={course.courseName}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            Instructor: {course.user.username}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                          >
                            Students: {course.coursePrice}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </Link>

                <Divider />
              </React.Fragment>
            ))}
          </List>
        </div>
      </div>
    </Layout>
  );
};

export default MyCourses;
