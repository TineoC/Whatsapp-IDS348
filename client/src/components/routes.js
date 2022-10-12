import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App";
import ErrorPage from "./ErrorPage";
import ChatRoutes from "./ChatRoutes";

function routes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/chat/*" element={<ChatRoutes />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default routes;
