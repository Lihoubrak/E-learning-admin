import React from "react";
import Layout from "../Layout";

const Statistics = () => {
  // Dummy statistical data for illustration purposes
  const statisticsData = {
    totalUsers: 1000,
    activeUsers: 750,
    coursesCompleted: 500,
    averageCompletionRate: 50, // in percentage
  };

  return (
    <Layout>
      <div>
        <h2>Statistics</h2>
        <ul>
          <li>
            <strong>Total Users:</strong> {statisticsData.totalUsers}
          </li>
          <li>
            <strong>Active Users:</strong> {statisticsData.activeUsers}
          </li>
          <li>
            <strong>Courses Completed:</strong>{" "}
            {statisticsData.coursesCompleted}
          </li>
          <li>
            <strong>Average Completion Rate:</strong>{" "}
            {statisticsData.averageCompletionRate}%
          </li>
        </ul>
        {/* Additional content or features related to displaying statistics */}
        <p>
          Explore detailed statistics to track user engagement, course
          completion rates, and overall platform activity.
        </p>
      </div>
    </Layout>
  );
};

export default Statistics;
