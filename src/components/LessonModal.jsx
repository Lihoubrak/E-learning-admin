import React, { useEffect, useState } from "react";
import { TokenRequest, publicRequest } from "../RequestMethod/Request";

const LessonModal = ({
  open,
  handleClose,
  modalBackgroundColor,
  VisuallyHiddenInput,
}) => {
  const [selectedFiles, setSelectedFiles] = useState({
    sublessonFile: null,
    sublessonExerciseFile: null,
    sublessonVideo: null,
  });
  const [lessonOptions, setLessonOptions] = useState([]);
  const [CourseOptions, setCourseOptions] = useState([]);
  const [listLession, setListLession] = useState({
    lessionTilte: "",
    subLessionTitle: "",
    subLessionFree: "",
    lessionId: "",
    courseId: "",
  });
  const fetchDataAllCourse = async () => {
    try {
      const response = await TokenRequest.get("/courses/course/teacher");
      setCourseOptions(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  useEffect(() => {
    fetchDataAllCourse();
  }, []);

  useEffect(() => {
    if (CourseOptions.length > 0) {
      setListLession((prevList) => ({
        ...prevList,
        courseId: CourseOptions[0].id,
      }));
    }
    if (lessonOptions.length > 0) {
      setListLession((prevList) => ({
        ...prevList,
        lessionId: lessonOptions[0].id,
      }));
    }
  }, [CourseOptions, lessonOptions]);
  const fetchData = async () => {
    try {
      const response = await publicRequest.get("/lessions", {
        params: { courseId: listLession.courseId || "" },
      });
      setLessonOptions(response.data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };
  useEffect(() => {
    if (listLession.courseId) {
      fetchData();
    }
  }, [listLession.courseId]);

  const handleFileChange = (field, event) => {
    const file = event.target.files[0];
    setSelectedFiles((prevFiles) => ({ ...prevFiles, [field]: file }));
  };

  const renderFileUploadButton = (label, field) => (
    <div style={{ marginBottom: "10px" }}>
      <label
        style={{
          display: "block",
          padding: "8px",
          backgroundColor: "#3f51b5",
          color: "#fff",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {label}
        <VisuallyHiddenInput
          type="file"
          onChange={(event) => handleFileChange(field, event)}
          disabled={!lessonOptions || lessonOptions.length === 0}
          style={{ display: "none" }}
        />
      </label>
      {selectedFiles[field] && (
        <p style={{ fontSize: "14px", margin: "0" }}>
          Selected File: {selectedFiles[field].name}
        </p>
      )}
    </div>
  );
  const handleAddLession = async () => {
    try {
      const { lessionTilte, courseId } = listLession;
      const AddLession = await publicRequest.post("/lessions/create", {
        courseId: courseId,
        lessionTilte,
      });

      // Assuming the response contains the newly created lesson, update the state accordingly
      setLessonOptions((prevOptions) => [...prevOptions, AddLession.data]);
      // Reset the input field
      setListLession((prevList) => ({ ...prevList, lessionTilte: "" }));
      fetchData();
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  const hanleChangeLession = (field, value) => {
    setListLession((prevList) => ({
      ...prevList,
      [field]: value,
    }));
  };
  const handleCreateSublession = async () => {
    try {
      const { subLessionTitle, lessionId } = listLession;
      const formData = new FormData();
      formData.append(
        "sublessonExerciseFile",
        selectedFiles.sublessonExerciseFile
      );
      formData.append("sublessonFile", selectedFiles.sublessonFile);
      formData.append("sublessonVideo", selectedFiles.sublessonVideo);
      formData.append("subLessionTitle", subLessionTitle);
      formData.append("lessionId", parseInt(lessionId));
      const AddSublession = await publicRequest.post(
        "/sublessions/create",
        formData
      );
      fetchData();
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };
  const handleRemoveLesson = async (lessonId) => {
    try {
      await publicRequest.delete(`/lessions/${lessonId}`);
      setLessonOptions((prevOptions) =>
        prevOptions.filter((lesson) => lesson.id !== lessonId)
      );
    } catch (error) {
      console.error("Error removing lesson:", error);
    }
  };

  const handleRemoveSublesson = async (sublessonId) => {
    try {
      await publicRequest.delete(`/sublessions/sublessons/${sublessonId}`);
      setLessonOptions((prevOptions) => {
        return prevOptions.map((lesson) => {
          if (lesson.subLessions) {
            lesson.subLessions = lesson.subLessions.filter(
              (sublesson) => sublesson.id !== sublessonId
            );
          }
          return lesson;
        });
      });
    } catch (error) {
      console.error("Error removing sublesson:", error);
    }
  };

  return (
    <div
      style={{
        display: open ? "flex" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: modalBackgroundColor,
        padding: "16px",
        overflowY: "auto",
        maxHeight: "100vh",
      }}
    >
      <div style={{ display: "flex", width: "100%" }}>
        {/* Left Side */}
        <div style={{ flex: 1, marginRight: "16px", height: "100%" }}>
          <div>
            <label htmlFor="lessionId">Course Title</label>
            {CourseOptions && CourseOptions.length > 0 ? (
              <select
                id="courseId"
                style={lessonTitleSelectStyles}
                onChange={(e) => hanleChangeLession("courseId", e.target.value)}
              >
                <option value="">Select Course</option>
                {CourseOptions.map((cos) => (
                  <option key={cos.id} value={cos.id}>
                    {cos.courseName}
                  </option>
                ))}
              </select>
            ) : (
              <p>Loading Course...</p>
            )}
          </div>

          <div>
            <label htmlFor="lessionId">Lesson Title</label>
            {lessonOptions || lessonOptions.length === 0 ? (
              <select
                id="lessionId"
                style={lessonTitleSelectStyles}
                onChange={(e) =>
                  hanleChangeLession("lessionId", e.target.value)
                }
              >
                <option value="">Select Lession</option>
                {lessonOptions.map((less, index) => (
                  <option key={index} value={less.id}>
                    {less.lessionTilte}
                  </option>
                ))}
              </select>
            ) : (
              <p>Loading lessons...</p>
            )}
          </div>
          <input
            type="text"
            placeholder="Lesson Title"
            style={lessonTitleSelectStyles}
            value={listLession.lessionTilte || ""}
            onChange={(e) => hanleChangeLession("lessionTilte", e.target.value)}
          />
          <button
            onClick={handleAddLession}
            style={{
              ...buttonStyles,
              backgroundColor: "gray",
              marginBottom: "16px",
            }}
          >
            Create
          </button>
          <input
            type="text"
            placeholder="Sublesson Title"
            style={lessonTitleSelectStyles}
            disabled={!lessonOptions || lessonOptions.length === 0}
            value={listLession.subLessionTitle || ""}
            onChange={(e) =>
              hanleChangeLession("subLessionTitle", e.target.value)
            }
          />

          {renderFileUploadButton("Upload Sublesson File", "sublessonFile")}
          {renderFileUploadButton(
            "Upload Sublesson Exercise File",
            "sublessonExerciseFile"
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {renderFileUploadButton("Upload Sublesson Video", "sublessonVideo")}
            {selectedFiles.sublessonVideo && (
              <video
                controls
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              >
                <source
                  src={URL.createObjectURL(selectedFiles.sublessonVideo)}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              paddingTop: "16px",
            }}
          >
            <button
              onClick={handleClose}
              style={{
                ...buttonStyles,
                backgroundColor: "#757575",
              }}
            >
              Close
            </button>
            <button
              disabled={!lessonOptions || lessonOptions.length === 0}
              style={{
                ...buttonStyles,
                backgroundColor: "#d32f2f",
                marginLeft: "8px",
              }}
              onClick={handleCreateSublession}
            >
              Create
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 2,
            backgroundColor: "#475569",
            padding: "16px",
            overflowY: "auto",
            maxHeight: "calc(100vh - 32px)",
            height: "100%",
          }}
        >
          <h2 style={{ ...headerStyles, marginBottom: "16px" }}>
            Created Lessons
          </h2>
          <ul
            style={{
              ...listStyles,
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
            }}
          >
            {lessonOptions.map((lesson, index) => (
              <li
                key={index}
                style={{ ...listItemStyles, marginBottom: "16px" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <strong style={strongStyles}>{`${index + 1}. ${
                    lesson.lessionTilte
                  }`}</strong>
                  <button
                    style={{
                      marginLeft: "8px",
                      backgroundColor: "#d32f2f",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleRemoveLesson(lesson.id)}
                  >
                    Remove Lesson
                  </button>
                </div>
                <ul style={{ ...listStyles, marginLeft: "16px" }}>
                  {lesson.subLessions?.map((sublesson, subIndex) => (
                    <li key={subIndex} style={listItemStyles}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {`${index + 1}.${subIndex + 1} ${
                          sublesson.subLessionTitle
                        }`}
                        <button
                          style={{
                            marginLeft: "8px",
                            backgroundColor: "#d32f2f",
                            marginTop: "8px",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleRemoveSublesson(sublesson.id)}
                        >
                          Remove Sublesson
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const headerStyles = {
  color: "#fff",
  fontWeight: "bold",
};

const listStyles = {
  listStyleType: "none",
  padding: 0,
  marginLeft: 0,
};

const listItemStyles = {
  marginLeft: 0,
};

const strongStyles = {
  color: "#fff",
};
const lessonTitleSelectStyles = {
  width: "100%",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  marginBottom: "16px",
};

const buttonStyles = {
  flex: 1,
  padding: "10px",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
export default LessonModal;
