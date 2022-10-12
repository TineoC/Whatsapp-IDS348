import React from "react";
import { Route, Routes } from "react-router-dom";
import Application from "../application";

function ChatRoutes() {
  return (
    <>
      <Routes>
        <Route index element={<Application />} />
        <Route path=":id" element={<Application />} />
      </Routes>
    </>
  );
}

export default ChatRoutes;
