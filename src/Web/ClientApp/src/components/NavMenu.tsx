import * as React from "react";
import NewRound from "./NewRound";

export default () => (
  <nav
    className="navbar is-fixed-bottom is-light"
    role="navigation"
    aria-label="main navigation"
  >
    <div className="navbar-menu is-active">
      <div className="navbar-item">
        <NewRound />
      </div>
    </div>
  </nav>
);
