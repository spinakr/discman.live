/* eslint-disable jsx-a11y/alt-text */
import React from "react";

const About = () => {
  return (
    <>
      <h3 className="title is-3 has-text-centered">About</h3>
      <div className="section pt-0">
        <strong>discman.live</strong> is an app for keeping score and tracking
        stats when playing disc golf with your friends. The app is not supposed
        to replace the other more "professional" apps often used at PDGA
        tournaments, but more as an alternative when playing and practicing with
        friends. discman makes playing casual rounds with friends more fun, and
        introduces some interesting competition aspects.
        <br />
        <br />
        <div className="columns is-mobile">
          <div className="column is-half">
            <img width="128" height="260" src="screenshot1.png" />
          </div>
          <div className="column is-half">
            Scores are registered on each player's own phone, and synced live to
            players in the round.
          </div>
        </div>
        <br />
        <div className="columns is-mobile">
          <div className="column is-half">
            discman is also a social platform. Rounds and scores are shared with
            your friends in each user's feed.
          </div>
          <div className="column is-half">
            <img width="128" height="260" src="screenshot2.png" />
          </div>
        </div>
        <div className="columns is-mobile">
          <div className="column is-half">
            <img width="128" height="260" src="screenshot6.png" />
          </div>
          <div className="column is-half">
            Scores are registered with details (fairway, rough, green), allowing
            for detailed stats about a players game.
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
