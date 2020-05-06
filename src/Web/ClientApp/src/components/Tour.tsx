import React from "react";
import JoyRide, { STATUS } from "react-joyride";

// Tour steps
const TOUR_STEPS = [
  {
    target: ".tour-scorecard",
    content:
      "Score card will update when other players enter their scores, and go to the next hole when all players have entered their score",
  },
  {
    target: ".tour-scores",
    content:
      "The score selector allows recording each individual stroke efficiently. The icons represent fairway, rough, circle 2 / inside 20 meters, circle 1 / inside 10 meters, in basket and OB. Clicking the basket will register your score for the hole ",
  },
];

let tourCompleted = localStorage.getItem("completedTour") === "1";
const tourCallback = ({ status }: any) => {
  if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
    localStorage.setItem("completedTour", "1");
    tourCompleted = true;
  }
};

// Tour component
const Tour = ({ start }: any) => {
  if (tourCompleted) return null;
  return (
    <JoyRide
      steps={TOUR_STEPS}
      continuous={true}
      callback={tourCallback}
      run={start}
    />
  );
};

export default Tour;
