import React from "react";
import Layout from "../Layout";

const Help = () => {
  return (
    <Layout>
      <div>
        <h2>Help</h2>
        <p>
          Welcome to the Help Center! If you have any questions or need
          assistance, feel free to reach out to our support team.
        </p>
        <ul>
          <li>
            <strong>FAQs:</strong> Check our frequently asked questions for
            quick answers.
          </li>
          <li>
            <strong>Contact Support:</strong> Submit a support ticket for
            personalized assistance.
          </li>
          <li>
            <strong>User Guides:</strong> Explore our user guides for in-depth
            information.
          </li>
        </ul>
      </div>
    </Layout>
  );
};

export default Help;
