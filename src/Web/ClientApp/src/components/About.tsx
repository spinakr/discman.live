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
        introduces some competion aspects as well.
        <br />
        <br />
        <div className="columns is-mobile">
          <div className="column is-half">
            <img width="128" height="260" src="screenshot1.png" />
          </div>
          <div className="column is-half">
            Scores are registered on each player's own phone, and synced live to
            all players in the round.
          </div>
        </div>
        <br />
        <div className="columns is-mobile">
          <div className="column is-half">
            discman is also a social platform. Rounds and scores are shared with
            your friends in each user's live feed.
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
            As scores are registered with details (fairway, rough, green),
            players get detailed stats about their game
          </div>
        </div>
        <div className="columns is-mobile">
          <div className="column is-half">
            Leader boards both among friends and globally, as well as
            achievements makes playing practice rounds more fun.
          </div>
          <div className="column is-half">
            <img width="128" height="260" src="screenshot3.png" />
          </div>
        </div>
        <p>
          Tournaments in discman is a set of courses from which the best round
          on each course count towards the tournament leaderbaord. A fun and
          simple way to compete against your friends.
        </p>
        <div className="columns is-mobile">
          <div className="column is-half">
            <img width="128" height="260" src="screenshot4.png" />
          </div>
          <div className="column is-half">
            <img width="128" height="260" src="screenshot5.png" />
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
