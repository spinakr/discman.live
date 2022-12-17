import React from "react";

const About = () => {
  return (
    <>
      <div className="container pt-0">
        <p>
          Welcome to <strong>discman.live</strong>, the discgolf app that makes
          playing with your friends even more fun!
        </p>
        <br />
        <p></p>
        <br />
        <div className="columns is-mobile px-0">
          <div className="column is-half px-0">
            <img
              className="bordered"
              width="128"
              height="260"
              src="screenshot-live.jpeg"
            />
          </div>
          <div className="column is-half px-0">
            Everyone registers their own scores, no more arguing at the first
            tee.
          </div>
        </div>
        <br />
        <div className="columns is-mobile">
          <div className="column is-half px-0">
            Follow your friends and get updates on their rounds in the feed.
          </div>
          <div className="column is-half px-0">
            <img
              className="bordered"
              width="128"
              height="260"
              src="screenshot-feed.jpeg"
            />
          </div>
        </div>
        <div className="columns is-mobile">
          <div className="column is-half px-0">
            <img
              className="bordered"
              width="128"
              height="260"
              src="screenshot-lb.jpeg"
            />
          </div>
          <div className="column is-half px-0">
            The leaderboard keeps track of who is playing the best throught the
            season.
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
