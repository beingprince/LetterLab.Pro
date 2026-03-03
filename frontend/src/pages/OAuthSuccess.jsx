import React, { useEffect } from "react";

export default function OAuthSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');         // must match backend redirect param
    const provider = params.get('provider');   // should be 'outlook'

    if (token && provider === 'outlook') {
      localStorage.setItem('letterlab_outlook_token', token);
      localStorage.setItem('letterlab_provider', 'outlook');
      window.location.href = '/'; // redirect to homepage
    } else {
      console.error('No valid token found in OAuthSuccess redirect');
    }
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.2rem",
      }}
    >
      Redirecting to LetterLab...
    </div>
  );
}
