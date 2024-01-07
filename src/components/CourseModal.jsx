import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  ListItemText,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { TokenRequest, publicRequest } from "../RequestMethod/Request";
import { DatePicker } from "@mui/x-date-pickers";

const CourseModal = ({
  open,
  handleClose,
  modalBackgroundColor,
  VisuallyHiddenInput,
}) => {
  const [newCourseData, setNewCourseData] = useState({
    courseName: "",
    coursePrice: "",
    courseImage: "",
    courseVideo: "",
    courseIntroduction: "",
    courseDescription: "",
    courseRequirement: "",
    courseTarget: "",
    courseObjective: "",
    courseStructure: "",
    courseService: "",
    courseRegister: null,
    courseExpire: null,
    courseTotalRegister: "",
    courseAchievement: "",
    categorySecondId: "",
  });

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await publicRequest.get("/categorys");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchCategory();
    const fetchCourse = async () => {
      try {
        const response = await TokenRequest.get("/courses/course/teacher");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourse();
  }, []);

  const handleChange = (field, value) => {
    setNewCourseData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleCreateCourse = async () => {
    try {
      const formData = new FormData();
      formData.append("courseImage", newCourseData.courseImage);
      const response = await TokenRequest.post(
        "/courses/create",
        {
          ...newCourseData,
          formData,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data) {
        window.alert(`You create course successfully `);
        setCourses((prevCourses) => [...prevCourses, response.data.course]);

        setNewCourseData({
          courseName: "",
          coursePrice: "",
          courseImage: "",
          courseVideo: "",
          courseIntroduction: "",
          courseDescription: "",
          courseRequirement: "",
          courseTarget: "",
          courseObjective: "",
          courseStructure: "",
          courseService: "",
          courseRegister: null,
          courseExpire: null,
          courseTotalRegister: "",
          categorySecondId: "",
          courseAchievement: "",
        });
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };
  const categorySeconds = [];
  for (const category of categories) {
    for (const categoryFirst of category.categoryFirsts) {
      for (const categorySecond of categoryFirst.categorySeconds) {
        categorySeconds.push(categorySecond);
      }
    }
  }
  const handleRemoveCourse = async (courseId) => {
    try {
      const response = await TokenRequest.delete(`/courses/delete/${courseId}`);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== courseId)
      );
    } catch (error) {
      console.error("Error removing course:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      hideBackdrop
      sx={{ backgroundColor: modalBackgroundColor }}
    >
      <Box className="p-4" sx={{ overflowY: "auto", maxHeight: "100vh" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <div className="flex flex-col items-center gap-3">
              <Button
                component="label"
                variant="contained"
                sx={{ padding: 2, width: "30%", height: "10%" }}
              >
                Upload Image
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) =>
                    handleChange("courseImage", e.target.files[0])
                  }
                />
              </Button>
              <div className="max-w-[500px] h-[200px] ">
                <img
                  src={
                    newCourseData.courseImage
                      ? URL.createObjectURL(newCourseData.courseImage)
                      : ""
                  }
                  alt="Image"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="courseName"
              variant="outlined"
              sx={{ mb: 1 }}
              value={newCourseData.courseName}
              onChange={(e) => handleChange("courseName", e.target.value)}
            />
            <TextField
              fullWidth
              label="coursePrice"
              variant="outlined"
              sx={{ mb: 1 }}
              value={newCourseData.coursePrice}
              onChange={(e) => handleChange("coursePrice", e.target.value)}
            />
            <DatePicker
              label="CourseRegister"
              value={newCourseData.courseRegister}
              sx={{ mb: 1, width: "100%" }}
              onChange={(date) => handleChange("courseRegister", date)}
              format="MM/DD/YYYY"
            />
            <DatePicker
              label="CourseExpire"
              fullWidth
              value={newCourseData.courseExpire}
              sx={{ mb: 1, width: "100%" }}
              onChange={(date) => handleChange("courseExpire", date)}
              format="MM/DD/YYYY"
            />
            <FormControl fullWidth variant="outlined" sx={{ mb: 1 }}>
              <InputLabel htmlFor="Catetory">Category</InputLabel>
              <Select
                label="Category"
                id="Category"
                value={newCourseData.categorySecondId}
                onChange={(e) =>
                  handleChange("categorySecondId", e.target.value)
                }
                MenuProps={{ style: { maxHeight: 200 } }}
              >
                {categorySeconds.map((categorySecond) => (
                  <MenuItem key={categorySecond.id} value={categorySecond.id}>
                    {categorySecond.categorySecondName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <div style={{ maxHeight: "320px", overflowY: "auto" }}>
              <List>
                <Typography component="h1" variant="h6" color="ButtonText">
                  Course
                </Typography>
                {Array.isArray(courses) &&
                  courses
                    .slice()
                    .reverse()
                    .map((course) => (
                      <React.Fragment key={course.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <img
                                src={course.courseImage}
                                alt=""
                                className="w-full h-full object-cover"
                              />
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
                                  Instructor: {course.user?.username}
                                </Typography>
                                <br />
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Price: {course.coursePrice}
                                </Typography>
                              </>
                            }
                          />
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleRemoveCourse(course.id)}
                          >
                            Remove
                          </Button>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
              </List>
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={3} justifyContent="space-around">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="CourseIntroduction"
              multiline
              rows={2}
              variant="outlined"
              sx={{ mb: 1 }}
              value={newCourseData.courseIntroduction}
              onChange={(e) =>
                handleChange("courseIntroduction", e.target.value)
              }
            />
            <TextField
              fullWidth
              label="CourseDescription"
              multiline
              rows={2}
              variant="outlined"
              sx={{ mb: 1 }}
              value={newCourseData.courseDescription}
              onChange={(e) =>
                handleChange("courseDescription", e.target.value)
              }
            />
            <TextField
              fullWidth
              label="CourseRequirement"
              multiline
              rows={2}
              variant="outlined"
              sx={{ mb: 1 }}
              value={newCourseData.courseRequirement}
              onChange={(e) =>
                handleChange("courseRequirement", e.target.value)
              }
            />
            <TextField
              fullWidth
              label="CourseAchievement"
              multiline
              rows={2}
              variant="outlined"
              sx={{ mb: 1 }}
              value={newCourseData.courseAchievement}
              onChange={(e) =>
                handleChange("courseAchievement", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="CourseObjective"
              multiline
              rows={2}
              variant="outlined"
              sx={{ mb: 1 }}
              value={newCourseData.courseObjective}
              onChange={(e) => handleChange("courseObjective", e.target.value)}
            />
            <TextField
              fullWidth
              label="CourseStructure"
              multiline
              rows={2}
              variant="outlined"
              sx={{ mb: 1 }}
              value={newCourseData.courseStructure}
              onChange={(e) => handleChange("courseStructure", e.target.value)}
            />
            <TextField
              fullWidth
              label="CourseService"
              multiline
              rows={2}
              variant="outlined"
              sx={{ mb: 1 }}
              value={newCourseData.courseService}
              onChange={(e) => handleChange("courseService", e.target.value)}
            />
            <TextField
              fullWidth
              label="CourseTarget"
              multiline
              rows={2}
              variant="outlined"
              sx={{
                mb: 1,
              }}
              value={newCourseData.courseTarget}
              onChange={(e) => handleChange("courseTarget", e.target.value)}
            />
          </Grid>
        </Grid>
        <Button onClick={handleClose} variant="contained" sx={{ mt: 2 }}>
          Close
        </Button>
        <Button
          onClick={handleCreateCourse}
          color="secondary"
          variant="contained"
          sx={{ mt: 2, ml: 2 }}
        >
          Create
        </Button>
      </Box>
    </Modal>
  );
};

export default CourseModal;
