import React from "react";
import Layout from "../Layout";

const MyLectures = () => {
  const lectures = [
    { id: 1, title: "Introduction to React Hooks", instructor: "John Doe" },
    { id: 2, title: "State Management in Redux", instructor: "Jane Smith" },
    { id: 3, title: "Advanced JavaScript Concepts", instructor: "Bob Johnson" },
  ];

  return (
    <Layout>
      <div>
        <h2>My Lectures</h2>
        <ul>
          {lectures.map((lecture) => (
            <li key={lecture.id}>
              <strong>{lecture.title}</strong> - {lecture.instructor}
            </li>
          ))}
        </ul>

        <p>
          View and manage your lectures here. Access video content, review
          materials, and stay up-to-date with your course curriculum.
        </p>
      </div>
    </Layout>
  );
};

export default MyLectures;
