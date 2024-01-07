import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import { Button, Select, MenuItem } from "@mui/material";
import { TokenRequest, publicRequest } from "../RequestMethod/Request";
import { DatePicker } from "@mui/x-date-pickers";

const QuizModal = ({ open, handleClose, modalBackgroundColor }) => {
  const [quizData, setQuizData] = useState({
    quizName: "",
    quizDate: null,
    quizDuration: "",
    lessionId: "",
  });

  const [questionData, setQuestionData] = useState({
    questionText: "",
    questionPoint: "",
    quizId: "",
  });

  const [optionData, setOptionData] = useState({
    questionOptionText: "",
    isCorrect: false,
    questionId: "",
  });
  const [sublession, setSublession] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [question, setQuestions] = useState([]);
  const [questionOption, setquestionOption] = useState([]);
  const [lessonData, setLessonData] = useState([]);
  const [expandedQuizzes, setExpandedQuizzes] = useState([]);

  const toggleQuizExpansion = (quizId) => {
    setExpandedQuizzes((prevExpandedQuizzes) => {
      const isExpanded = prevExpandedQuizzes.includes(quizId);
      return isExpanded
        ? prevExpandedQuizzes.filter((id) => id !== quizId)
        : [...prevExpandedQuizzes, quizId];
    });
  };
  const fetchQuiz = async (selectedLessionId) => {
    try {
      const res = await TokenRequest.get(
        `/lessions/quizzes/${selectedLessionId}`
      );
      setLessonData(res.data);
    } catch (error) {
      console.error("Error fetching sublessions:", error);
    }
  };
  const handleAddQuiz = async () => {
    const { quizName, quizDate, quizDuration, lessionId } = quizData;
    try {
      const res = await publicRequest.post("quizs/create", {
        quizName,
        quizDate,
        quizDuration,
        lessionId,
      });
      setQuizzes((prevQuizzes) => [...prevQuizzes, res.data.Quiz]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddQuestion = async () => {
    const { questionText, questionPoint, quizId } = questionData;
    try {
      const res = await publicRequest.post("questions/create", {
        questionText,
        questionPoint,
        quizId,
      });
      setQuestions((prevQuestion) => [...prevQuestion, res.data.Question]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddOption = async () => {
    try {
      const { questionOptionText, isCorrect, questionId } = optionData;
      const res = await publicRequest.post("questionoptions/create", {
        questionOptionText,
        isCorrect,
        questionId,
      });
      setquestionOption((prevquestionOption) => [
        ...prevquestionOption,
        res.data.QuestionOption,
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCreate = () => {
    const selectedLessionId = quizData.lessionId;
    if (selectedLessionId) {
      fetchQuiz(selectedLessionId);
    } else {
      console.error("Please select a valid lesson before creating the quiz.");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await publicRequest.delete(`questions/delete/${questionId}`);
      fetchQuiz(quizData.lessionId);
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.id !== questionId)
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchSublession = async () => {
      try {
        const res = await TokenRequest.get("/sublessions/sublessons/user");
        setSublession(res.data);
      } catch (error) {
        console.error("Error fetching sublessions:", error);
      }
    };
    fetchSublession();
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="quiz-modal"
      aria-describedby="quiz-modal-description"
      hideBackdrop
    >
      <div
        style={{
          backgroundColor: modalBackgroundColor,
          padding: "16px",
          overflowY: "auto",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Left Side */}
        <div
          style={{
            backgroundColor: "#475569",
            padding: "16px",
            overflowY: "auto",
            maxHeight: "calc(100vh - 32px)",
            height: "100%",
          }}
        >
          <h2
            style={{ color: "#fff", fontWeight: "bold", marginBottom: "16px" }}
          >
            Question
          </h2>
          <ul
            style={{
              listStyleType: "none",
              padding: 0,
              marginLeft: 0,
              backgroundColor: "#4CAF50",
              color: "#fff",
              padding: "8px",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          >
            {/* ... (previous code) */}
            {lessonData.quizzes?.map((quiz) => (
              <li key={quiz.id}>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleQuizExpansion(quiz.id)}
                >
                  {quiz.quizName}
                </div>
                {expandedQuizzes.includes(quiz.id) && (
                  <ol
                    style={{ listStyleType: "none", padding: 0, marginLeft: 0 }}
                  >
                    {quiz.questions?.map((question, questionIndex) => (
                      <li key={question.id}>
                        {`${questionIndex + 1}. ${question.questionText}`}
                        <Button
                          onClick={() => handleDeleteQuestion(question.id)}
                          variant="contained"
                          style={{
                            ...buttonStyles,
                            backgroundColor: "#d32f2f",
                            marginLeft: "8px",
                            padding: "8px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </Button>
                        <ol
                          style={{
                            listStyleType: "lower-alpha",
                            padding: 0,
                            marginLeft: 20,
                          }}
                        >
                          {/* ... (previous code) */}
                        </ol>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side */}
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <div>
              <label htmlFor="Lession">Lession</label>
              <select
                id="Lession"
                style={quizItemStyles}
                onChange={(e) => {
                  const selectedLessionId = e.target.value;
                  setQuizData({
                    ...quizData,
                    lessionId: selectedLessionId,
                  });
                  fetchQuiz(selectedLessionId);
                }}
              >
                <option value="">Select Lession</option>
                {sublession.map((sub, index) => (
                  <option key={index} value={sub.lession.id}>
                    {sub.lession.lessionTilte}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="QuizName"
              style={quizItemStyles}
              value={quizData.quizName}
              onChange={(e) =>
                setQuizData({ ...quizData, quizName: e.target.value })
              }
            />
            <DatePicker
              label="QuizDate"
              value={quizData.quizDate}
              sx={{ mb: 1, width: "100%" }}
              style={quizItemStyles}
              onChange={(value) =>
                setQuizData({ ...quizData, quizDate: value })
              }
              format="MM/DD/YYYY"
            />

            <input
              type="text"
              placeholder="QuizDuration with minutes"
              style={quizItemStyles}
              value={quizData.quizDuration}
              onChange={(e) =>
                setQuizData({ ...quizData, quizDuration: e.target.value })
              }
            />
            <Button
              onClick={handleAddQuiz}
              variant="contained"
              style={{
                ...buttonStyles,
                backgroundColor: "#3f51b5",
                display: "block",
                padding: "8px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add Quiz
            </Button>
          </div>

          <div style={{ flex: 1 }}>
            <div>
              <label htmlFor="questionQuiz">QuestionQuiz</label>
              <select
                id="questionQuiz"
                style={quizItemStyles}
                disabled={quizzes.length === 0 && true}
                onChange={(e) =>
                  setQuestionData({
                    ...questionData,
                    quizId: e.target.value,
                  })
                }
              >
                <option value="">Select QuestionQuiz</option>
                {quizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.quizName}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="QuestionText"
              disabled={quizzes.length === 0 && true}
              style={quizItemStyles}
              value={questionData.questionText}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  questionText: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="QuestionPoint"
              style={quizItemStyles}
              value={questionData.questionPoint}
              disabled={quizzes.length === 0 && true}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  questionPoint: e.target.value,
                })
              }
            />
            <Button
              onClick={handleAddQuestion}
              variant="contained"
              disabled={quizzes.length === 0 && true}
              style={{
                ...buttonStyles,
                backgroundColor: "#3f51b5",
                display: "block",
                padding: "8px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add Question
            </Button>
          </div>

          {/* Option Input Section */}
          <div style={{ flex: 1 }}>
            <div>
              <label htmlFor="optionQuestion">Option Question</label>
              <select
                id="optionQuestion"
                style={quizItemStyles}
                disabled={question.length === 0 && true}
                onChange={(e) =>
                  setOptionData({
                    ...optionData,
                    questionId: e.target.value,
                  })
                }
              >
                <option value="">Select Question</option>
                {question.map((quest) => (
                  <option key={quest.id} value={quest.id}>
                    {quest.questionText}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="QuestionOptionText"
              style={quizItemStyles}
              value={optionData.questionOptionText}
              disabled={question.length === 0 && true}
              onChange={(e) =>
                setOptionData({
                  ...optionData,
                  questionOptionText: e.target.value,
                })
              }
            />
            <div>
              <label htmlFor="isCorrect">Answer</label>
              <select
                disabled={question.length === 0 && true}
                id="isCorrect"
                style={quizItemStyles}
                onChange={(e) =>
                  setOptionData({
                    ...optionData,
                    isCorrect: e.target.value === "true",
                  })
                }
              >
                <option value="">Select Answer</option>
                <option value="true">Correct</option>
                <option value="false">Incorrect</option>
              </select>
            </div>
            <Button
              onClick={handleAddOption}
              variant="contained"
              disabled={question.length === 0 && true}
              style={{
                ...buttonStyles,
                backgroundColor: "#3f51b5",
                display: "block",
                padding: "8px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add Option
            </Button>
          </div>
        </div>

        {/* Button Section */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            paddingTop: "16px",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handleClose}
            variant="contained"
            style={{
              ...buttonStyles,
              backgroundColor: "#757575",
              flex: "0 0 30%",
            }}
          >
            Close
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            style={{
              ...buttonStyles,
              backgroundColor: "#d32f2f",
              marginLeft: "8px",
              flex: "0 0 30%",
            }}
          >
            Create
          </Button>
        </div>
      </div>
    </Modal>
  );
};
const quizItemStyles = {
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
export default QuizModal;
