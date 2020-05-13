/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { Course } from "../../store/Courses";
import { Hole } from "../../store/Rounds";
import { useState } from "react";

interface CourseDetailsProps {
  course: Course;
  updateCourse: (course: Course) => void;
}

const tableComps = (
  hole: Hole,
  setActive: React.Dispatch<React.SetStateAction<Hole | null>>
) => {
  const header = (
    <th
      onClick={() => {
        setActive(hole);
      }}
      key={hole.number}
      className=""
    >
      {hole.number} <br />
    </th>
  );
  const par = (
    <td
      onClick={() => {
        setActive(hole);
      }}
      key={hole.number}
      className=""
    >
      <i>{hole.par}</i>
    </td>
  );
  const distance = (
    <td
      onClick={() => {
        setActive(hole);
      }}
      key={hole.number}
      className=""
    >
      <i>{hole.distance}</i>
    </td>
  );
  const rating = (
    <td key={hole.number} className="">
      <i>{hole.rating}</i>
    </td>
  );
  return { hole: hole, header, par, distance, rating };
};

const chunkArray = (
  holes: Hole[],
  chunk_size: number,
  setActive: React.Dispatch<React.SetStateAction<Hole | null>>
) => {
  var index = 0;
  var arrayLength = holes.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    const myChunk = holes.slice(index, index + chunk_size);
    const tableChunk = myChunk.map((c) => tableComps(c, setActive));
    tempArray.push(tableChunk);
  }

  return tempArray;
};

export default ({ course, updateCourse }: CourseDetailsProps) => {
  const currentCourse = course;
  const [editHole, setEditHole] = useState<Hole | null>(null);
  var chunks = chunkArray(currentCourse.holes, 6, setEditHole);
  return (
    <>
      <div>
        <h1 className="title">{currentCourse.name}</h1>

        <div className="table-container tour-scorecard">
          {chunks.map((c, i) => {
            return (
              <table
                key={i}
                className="table is-fullwidth is-narrow is-bordered"
              >
                <thead>
                  <tr>
                    <th>Hole</th>
                    {c.map((t) => t.header)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Par</th>
                    {c.map((t) => t.par)}
                  </tr>
                  <tr>
                    <th data-tooltip="Distance/length of hole">Dist.</th>
                    {c.map((t) => t.distance)}
                  </tr>
                  <tr>
                    <th data-tooltip="Hole rating, from 1 is most dificult">
                      Rat.
                    </th>
                    {c.map((t) => t.rating)}
                  </tr>
                </tbody>
              </table>
            );
          })}
        </div>
      </div>
      <div className={editHole !== null ? "modal is-active" : "modal"}>
        <div onClick={() => setEditHole(null)}>
          {" "}
          <div className="modal-background"></div>{" "}
        </div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Edit hole</p>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">Par</label>
              <div className="control">
                {editHole && (
                  <input
                    className="input"
                    type="text"
                    value={editHole.par}
                    onChange={(e) =>
                      setEditHole({
                        ...editHole,
                        par: +e.target.value,
                      })
                    }
                  ></input>
                )}
              </div>
            </div>
            <div className="field">
              <label className="label">Distance</label>
              <div className="control">
                {editHole && (
                  <input
                    className="input"
                    type="text"
                    value={editHole.distance}
                    onChange={(e) =>
                      setEditHole({
                        ...editHole,
                        distance: +e.target.value,
                      })
                    }
                  ></input>
                )}
              </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-success"
              onClick={() => {
                editHole &&
                  updateCourse({
                    ...course,
                    holes: [
                      ...course.holes.filter(
                        (h) => h.number !== editHole?.number
                      ),
                      editHole,
                    ].sort((a, b) => a.number - b.number),
                  });
                setEditHole(null);
              }}
            >
              Start
            </button>
            <button className="button" onClick={() => setEditHole(null)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
    </>
  );
};
