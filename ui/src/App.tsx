import "@marshians/bootstrap/scss/marshians.scss";
import "./App.css";

import keycloak from "./keycloak";
import Content from "./app/components/Content";

function App() {
  // const admins = ["01a368bd-be7e-4eb5-92ae-7d9d1df8995c"];

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <div className="container-fluid">
          <div className="navbar-brand">
            <img
              style={{ height: "1rem" }}
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
            <ul className="navbar-nav me-auto mb-3 mb-lg-0">
              <li className="nav-item">
                <div className="nav-link active">Marshians Bank</div>
              </li>
            </ul>
            <div className="d-flex">
              {keycloak.authenticated && (
                <button
                  className="btn btn-warning me-2"
                  onClick={() => {
                    keycloak.logout();
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="container">
        <Content />
      </div>
    </>
  );
}

export default App;
