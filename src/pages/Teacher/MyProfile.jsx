import React from "react";
import Layout from "../Layout";

const MyProfile = () => {
  // Dummy user profile data for illustration purposes
  const userProfile = {
    username: "john_doe",
    fullName: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://example.com/avatar.jpg",
  };

  return (
    <Layout>
      <div>
        <h2>My Profile</h2>
        <div>
          <img
            src={userProfile.avatarUrl}
            alt={`${userProfile.username}'s avatar`}
            style={{ borderRadius: "50%", width: "100px", height: "100px" }}
          />
          <p>
            <strong>Username:</strong> {userProfile.username}
          </p>
          <p>
            <strong>Full Name:</strong> {userProfile.fullName}
          </p>
          <p>
            <strong>Email:</strong> {userProfile.email}
          </p>
        </div>
        <p>
          Edit your profile information, change your password, and manage other
          account settings.
        </p>
      </div>
    </Layout>
  );
};

export default MyProfile;
