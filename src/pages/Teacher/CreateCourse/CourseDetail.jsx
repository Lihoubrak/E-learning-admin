import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../Layout";
import { publicRequest } from "../../../RequestMethod/Request";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const CourseDetail = () => {
  // Lay thong tin courseId tu params
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [openLessons, setOpenLessons] = useState([]);
  const [comments, setComments] = useState({});
  const token = Cookies.get("tokenTeacher");
  const user = token && jwtDecode(token);

  // Su dung useEffect de fetch thong tin khoa hoc khi component duoc mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await publicRequest.get(`/courses/${courseId}`);
        setCourse(response.data);
        setOpenLessons(Array(response.data.lessions.length).fill(false));
        initializeComments(response.data.lessions);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Khoi tao cac comments theo subLessons
  const initializeComments = (lessons) => {
    const initialComments = {};
    lessons.forEach((lesson) => {
      if (lesson.subLessions) {
        lesson.subLessions.forEach((subLesson) => {
          initialComments[subLesson.id] = [];
        });
      }
    });
    setComments(initialComments);
  };

  // Ham xu ly khi click mo/đong bai hoc con
  const toggleLesson = (index) => {
    setOpenLessons((prevOpenLessons) => {
      const newOpenLessons = [...prevOpenLessons];
      newOpenLessons[index] = !newOpenLessons[index];
      return newOpenLessons;
    });
  };

  // Xu ly khi nguoi dung reply mot comment
  const handleReplyComment = async (subLessonId, commentId, comment) => {
    try {
      const response = await publicRequest.post("/replys/create", {
        parentReplyId: null,
        userId: user && user.id,
        commentId: commentId,
        replyText: comment,
      });
      if (response.status === 201) {
        // Cap nhat state comments
        setComments((prevComments) => ({
          ...prevComments,
          [subLessonId]: [...prevComments[subLessonId], response.data.reply],
        }));
      } else {
        console.error("Error creating reply comment:", response.data.error);
      }
    } catch (error) {
      console.error("Error creating reply comment:", error);
    }
  };

  // Render cac subLessons
  const renderSubLessons = (subLessons) => (
    <div className="space-y-4">
      {subLessons.map((subLesson, index) => (
        <div key={subLesson.id} className="bg-white p-4 rounded shadow-md">
          <h4 className="text-xl font-bold mb-2 text-blue-600">
            {subLesson.subLessionTitle}
          </h4>

          {subLesson.comments && subLesson.comments.length > 0 && (
            <div className="mt-4 overflow-y-auto max-h-80">
              {subLesson.comments.map((comment, commentIndex) => (
                // Render cac comment cua tung subLesson
                <div
                  key={commentIndex}
                  className="bg-gray-100 p-2 rounded flex flex-col"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8">
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.username}
                        className="rounded-full mr-2 object-cover w-full h-full"
                      />
                    </div>
                    <span className="font-bold">{comment.user.username}</span>
                  </div>

                  <span className="ml-5 py-3">{comment.commentText}</span>

                  {comment.replies && comment.replies.length > 0 && (
                    // Neu co replies, render cac replies
                    <div className="ml-5 mt-2">
                      <h6 className="font-bold mb-1">Replies:</h6>
                      {comment.replies.map((reply, replyIndex) => (
                        <div
                          key={replyIndex}
                          className="bg-gray-200 p-2 rounded flex flex-col  gap-3 mb-3"
                        >
                          <div className="flex gap-3 items-center">
                            <div className="h-6 w-6">
                              <img
                                src={reply.user.avatar}
                                alt={reply.user.username}
                                className="rounded-full object-cover w-full h-full"
                              />
                            </div>
                            <span className="font-bold">
                              {reply.user.username}
                            </span>
                          </div>
                          <span>{reply.replyText}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Textarea va button de nguoi dung reply comment */}
                  <textarea
                    id={`reply-${subLesson.id}-${commentIndex}`}
                    placeholder="Reply to this comment..."
                    className="ml-2 p-2 rounded border outline-none"
                  />

                  <button
                    onClick={() => {
                      const replyInput = document.getElementById(
                        `reply-${subLesson.id}-${commentIndex}`
                      );
                      const replyComment = replyInput.value;
                      handleReplyComment(
                        subLesson.id,
                        comment.id,
                        replyComment
                      );
                      replyInput.value = "";
                    }}
                    className="ml-2 bg-blue-500 text-white p-2 rounded"
                  >
                    Reply
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Neu co comments cua user */}
          {comments[subLesson.id] && comments[subLesson.id].length > 0 && (
            <div className="mt-4 overflow-y-auto max-h-64">
              <h5 className="text-lg font-bold mb-2">Your Comments</h5>
              {comments[subLesson.id].map((userComment, commentIndex) => (
                <div key={commentIndex} className="bg-gray-100 p-2 rounded">
                  {userComment.commentText} {/* Use the appropriate property */}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Layout>
      {course ? (
        <div className="h-full overflow-y-auto pt-20 pl-5">
          <div className="flex flex-col items-center">
            <div className="w-[400px] h-[400px] bg-red-300">
              <img
                src={course.courseImage}
                alt={course.courseName}
                className="rounded-md w-full object-contain h-full"
              />
            </div>
            <h2 className="text-3xl font-bold mb-4">{course.courseName}</h2>
            <p className="text-gray-600 mb-6">{course.courseIntroduction}</p>
          </div>
          {course.lessions && course.lessions.length > 0 ? (
            <div className="h-full overflow-y-auto">
              {course.lessions.map((lesson, index) => (
                <div key={lesson.id} className="mb-8">
                  <h3
                    className="text-2xl font-bold mb-4 text-red-600 cursor-pointer"
                    onClick={() => toggleLesson(index)}
                  >
                    {lesson.lessionTilte} -{" "}
                    {openLessons[index] ? "Close" : "Open"}
                  </h3>
                  {openLessons[index] &&
                  lesson.subLessions &&
                  lesson.subLessions.length > 0 ? (
                    renderSubLessons(lesson.subLessions, index)
                  ) : (
                    <div>No sub-lessons available</div>
                  )}
                  {lesson.quizzes && lesson.quizzes.length > 0 ? (
                    <div className="mt-4">
                      <h4 className="text-xl font-bold mb-2 text-blue-600">
                        Quizzes
                      </h4>
                      <ul>
                        {lesson.quizzes.map((quiz) => (
                          <li key={quiz.id}>
                            {quiz.quizName} - Date: {quiz.quizDate}, Duration:{" "}
                            {quiz.quizDuration} minutes
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div>No quizzes available</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>No lessons available</div>
          )}
        </div>
      ) : (
        <div className="text-center">Loading...</div>
      )}
    </Layout>
  );
};

export default CourseDetail;
