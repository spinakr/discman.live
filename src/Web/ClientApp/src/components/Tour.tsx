import React from "react";
import JoyRide, { STATUS } from "react-joyride";

// Tour steps
const TOUR_STEPS = [
  {
    target: ".tour-holeScores",
    content:
      "Scores will update when players enter their score, and go to the next hole when all players have submitted",
  },
  {
    target: ".tour-stats",
    content:
      "Average score is based on all rounds played on the course. Holes are rated with 1 being the most difficult hole (highest average score)",
  },
  {
    target: ".tour-scores",
    content:
      "The score selector allows recording each individual stroke efficiently. Clicking the basket will register your score for the hole",
  },
  {
    target: ".tour-score-fairway",
    content: "Use this symbol if your throw landed in the faiway",
  },
  {
    target: ".tour-score-rough",
    content:
      "Use this symbol if your throw landed in the rough (i.e. not where you intended it to land)",
  },
  {
    target: ".tour-score-circle2",
    content:
      "Use this symbol if your throw landed in circle 2 (inside 20 meters of the basket)",
  },
  {
    target: ".tour-score-circle1",
    content:
      "Use this symbol if your throw landed in circle 1 (inside 10 meters of the basket)",
  },
  {
    target: ".tour-score-basket",
    content: "Use this symbol if your throw landed in the basket",
  },
  {
    target: ".tour-score-ob",
    content: "Use this symbole if your landed out of bounds",
  },
  {
    target: ".tour-scorecard",
    content:
      "To see scores for previous holes, open the score card. Select a previous hole to update your score",
  },
  {
    target: ".tour-score-mode",
    content:
      "The player who created the round can change the scoring mode in the options menu. Use detailed scoring to track each stroke, or change to simple to only register hole scores",
  },
];

let tourCompleted = localStorage.getItem("completedTour") === "7";
const tourCallback = ({ status }: any) => {
  if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
    localStorage.setItem("completedTour", "7");
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
      showSkipButton={true}
    />
  );
};

export default Tour;
