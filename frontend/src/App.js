import React from "react";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Dashboard from "./components/Dashboard";

import Reviews from "./components/Reviews/Reviews";

import "./App.css";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Dashboard />
          }
        />

        <Route
          path="/reviews"
          element={
            <Reviews />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;