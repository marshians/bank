import React from "react";

import Content from "./components/Content.js";

import "./App.css";

import { AuthContext, Auth } from "./components/Auth.js";

let App = () => {
  let [user, setUser] = React.useState(null);

  return (
    <AuthContext.Provider value={user}>
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <div className="container-fluid">
          <div className="navbar-brand" href="#">
            <img
              style={{ height: "2rem" }}
              src="/images/logo.svg"
              alt="marshians alien"
            />
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <div className="nav-link active">Marshians Bank</div>
              </li>
            </ul>
            <div className="d-flex">
              <Auth onUserUpdate={setUser} />
            </div>
          </div>
        </div>
      </nav>
      <div className="container">
        <Content />
      </div>
    </AuthContext.Provider>
  );
};

export default App;
