import React from "react";
import NavBar from "../components/NavBar.jsx";
import "../../dist/output.css";
import "../components/grid.css";
import { useLocation } from "react-router-dom";

export default function DashboardPage() {
  const firstname = useLocation().state.firstname;
  const lastname = useLocation().state.lastname;

  return (
    <div>
      <div>
        <NavBar />
      </div>

      <div className="prose text-white ps-32 pt-32 pb-16">
        <h1 className="text-white mb-3">
          {" "}
          {firstname} {lastname}'s Dashboard
        </h1>
        <pre>Take a look at your activity</pre>
      </div>

      <div className="column ps-48 text-white text-lg">
        <pre>Favorite Location</pre>

        <pre>Reputation</pre>
      </div>

      <div className="column text-white text-lg">
        <pre>Your reviews</pre>
        <pre className="text-sm">Sort by:</pre>
      </div>
    </div>
  );
}
