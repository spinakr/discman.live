import React from "react";

export default ({
  activeStep,
  setActiveStep,
}: {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}) => (
  <ul className="steps is-medium has-content-centered is-horizontal">
    <li className={"steps-segment" + (activeStep === 1 ? " is-active" : "")}>
      <span className="has-text-dark">
        <span className="steps-marker" onClick={() => setActiveStep(1)}>
          <span className="icon">
            <i className="fa fa-cloud-sun"></i>
          </span>
        </span>
        <div className="steps-content">
          <p className="heading">Course</p>
        </div>
      </span>
    </li>
    <li className={"steps-segment" + (activeStep === 2 ? " is-active" : "")}>
      <span className="has-text-dark">
        <span className="steps-marker" onClick={() => setActiveStep(2)}>
          <span className="icon">
            <i className="fa fa-user-friends"></i>
          </span>
        </span>
        <div className="steps-content">
          <p className="heading">Players</p>
        </div>
      </span>
    </li>
    {/* <li className={"steps-segment" + (activeStep === 3 ? " is-active" : "")}>
      <span className="has-text-dark">
        <span className="steps-marker" onClick={() => setActiveStep(3)}>
          <span className="icon">
            <i className="fa fa-cog"></i>
          </span>
        </span>
        <div className="steps-content">
          <p className="heading">Settings</p>
        </div>
      </span>
    </li> */}
    <li className="steps-segment">
      <span className="has-text-dark">
        <span className="steps-marker">
          <span className="icon">
            <i className="fa fa-check"></i>
          </span>
        </span>
        <div className="steps-content">
          <p className="heading">Start</p>
        </div>
      </span>
    </li>
  </ul>
);
