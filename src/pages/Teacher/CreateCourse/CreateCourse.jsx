import React, { useEffect, useState } from "react";
import Layout from "../../Layout";
import { FaBook } from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";
import CourseModal from "../../../components/CourseModal";
import LessonModal from "../../../components/LessonModal";
import QuizModal from "../../../components/QuizModal";
import { styled } from "@mui/system";
import { TokenRequest } from "../../../RequestMethod/Request";
const CreateCourse = () => {
  const [open, setOpen] = useState(false);
  const [modalBackgroundColor, setModalBackgroundColor] = useState("#f0f0f0");
  const [selectedModal, setSelectedModal] = useState(null);
  const [courses, setCourses] = useState([]);
  const handleOpen = (modalType) => {
    setOpen(true);
    setSelectedModal(modalType);
  };

  const handleClose = () => {
    setOpen(false);
    setModalBackgroundColor("white");
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const renderModal = () => {
    switch (selectedModal) {
      case "course":
        return (
          <CourseModal
            open={open}
            handleClose={handleClose}
            modalBackgroundColor={modalBackgroundColor}
            VisuallyHiddenInput={VisuallyHiddenInput}
          />
        );
      case "lesson":
        return (
          <LessonModal
            open={open}
            handleClose={handleClose}
            modalBackgroundColor={modalBackgroundColor}
            VisuallyHiddenInput={VisuallyHiddenInput}
          />
        );
      case "quiz":
        return (
          <QuizModal
            open={open}
            handleClose={handleClose}
            modalBackgroundColor={modalBackgroundColor}
            courses={courses}
            VisuallyHiddenInput={VisuallyHiddenInput}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="translate-y-[100%]">
        <div className="flex justify-around">
          {[
            {
              icon: <FaBook size={50} />,
              text: "Course",
              color: "bg-blue-500",
              type: "course",
            },
            {
              icon: <MdOutlineQuiz size={50} />,
              text: "Lesson",
              color: "bg-green-500",
              type: "lesson",
            },
            {
              icon: <FaBookReader size={50} />,
              text: "Quiz",
              color: "bg-yellow-500",
              type: "quiz",
            },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => handleOpen(item.type)}
              className={`w-60 h-40 hover:bg-red-600 hover:duration-100 ${item.color} text-white rounded mb-4 flex flex-col justify-center items-center`}
            >
              {item.icon}
              <span className="text-white text-xl font-bold">{item.text}</span>
            </button>
          ))}
        </div>
      </div>
      {renderModal()}
    </Layout>
  );
};

export default CreateCourse;
