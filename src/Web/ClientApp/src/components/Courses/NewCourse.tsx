/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as CoursesStore from "../../store/Courses";
import { useHistory } from "react-router";
import { Draggable, Map, Marker, Point } from "pigeon-maps";
import colors from "../../colors";
import { Coordinates } from "../../store/Courses";

const mapState = (state: ApplicationState) => {
  return {
    courses: state.courses?.courses || [],
  };
};

const connector = connect(mapState, CoursesStore.actionCreators);

interface NewCourseProps {
  currentCourseName: string | undefined;
}

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & NewCourseProps;

const NewCourse = (props: Props) => {
  const { createCourse, currentCourseName } = props;
  const [showDialog, setShowDialog] = useState(false);
  const [layoutName, setLayoutName] = useState<string>("");
  const [courseName, setCourseName] = useState<string>(currentCourseName || "");
  const [numberOfHoles, setNumberOfHoles] = useState<number>(18);
  const [par4s, setPar4s] = useState<number[]>([]);
  const [par5s, setPar5s] = useState<number[]>([]);

  const [mapAvailable, setMapAvailable] = useState(true);
  const [center, setCenter] = useState([
    59.91614272103729,
    10.746863315787369,
  ] as Point);
  const [zoom, setZoom] = useState(13);
  const [courseLocation, setCourseLocation] = useState([
    59.91614272103729,
    10.746863315787369,
  ] as Point);

  useEffect(() => {
    if (!navigator.geolocation) {
      setMapAvailable(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (r) => {
        setCenter([r.coords.latitude, r.coords.longitude]);
        setCourseLocation([r.coords.latitude, r.coords.longitude]);
      },
      (err) => console.log(err)
    );
  }, []);

  return (
    <>
      <div className={showDialog ? "modal is-active" : "modal"}>
        <div onClick={() => setShowDialog(false)}>
          {" "}
          <div className="modal-background"></div>{" "}
        </div>
        <div className="modal-card">
          <section
            className="modal-card-body"
            style={{ backgroundColor: colors.background }}
          >
            {mapAvailable && (
              <Map
                height={200}
                center={center}
                zoom={zoom}
                onBoundsChanged={({ center, zoom }) => {
                  setCenter(center);
                  setZoom(zoom);
                }}
              >
                <Draggable
                  offset={[60, 87]}
                  anchor={courseLocation}
                  onDragEnd={setCourseLocation}
                >
                  <img
                    src="discgolfbasket.svg"
                    height={60}
                    width={60}
                    alt="Basket"
                  />
                </Draggable>
              </Map>
            )}
            <div className="is-flex is-flex-direction-row">
              <div className="is-flex mr-1 is-flex-direction-column">
                <div className="field">
                  <label className="label">Course name</label>
                  <input
                    className="input"
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    disabled={!!currentCourseName}
                    style={{ backgroundColor: colors.field }}
                  ></input>
                </div>
                {props.currentCourseName && (
                  <div className="field">
                    <input
                      className="input"
                      placeholder={"Layout name"}
                      type="text"
                      value={layoutName}
                      onChange={(e) => setLayoutName(e.target.value)}
                      style={{ backgroundColor: colors.field }}
                    ></input>
                    <div className="control"></div>
                  </div>
                )}
              </div>
              <div className="is-flex">
                <div className="select">
                  <label className="label">Hole count</label>
                  <select
                    onChange={(e) => setNumberOfHoles(+e.target.value)}
                    style={{ backgroundColor: colors.field }}
                    value={numberOfHoles}
                  >
                    <option>{""}</option>
                    {new Array(25).fill(null).map((x, i) => (
                      <option key={i}>{i + 5}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="field mt-1">
              <label className="label">Par 4?</label>
              <div className="scrollable">
                {new Array(numberOfHoles).fill(null).map((x, i) => {
                  if (par5s.some((x) => x === i + 1)) return null;
                  return (
                    <button
                      key={i}
                      className={`button is-small is-success mr-1 mt-1 ${
                        par4s.some((p) => p === i + 1) ? "" : "is-inverted"
                      }`}
                      onClick={() => {
                        if (par4s.some((p) => p === i + 1)) {
                          setPar4s(par4s.filter((y) => y !== i + 1));
                        } else {
                          setPar4s([...par4s, i + 1]);
                        }
                      }}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="control"></div>
            </div>
            <div className="field mt-1">
              <label className="label">Par 5?</label>
              <div className="scrollable">
                {new Array(numberOfHoles).fill(null).map((x, i) => {
                  if (par4s.some((x) => x === i + 1)) return null;
                  return (
                    <button
                      key={i}
                      className={`button is-small is-success mr-1 mt-1 ${
                        par5s.some((p) => p === i + 1) ? "" : "is-inverted"
                      }`}
                      onClick={() => {
                        if (par5s.some((p) => p === i + 1)) {
                          setPar5s(par5s.filter((y) => y !== i + 1));
                        } else {
                          setPar5s([...par5s, i + 1]);
                        }
                      }}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="control"></div>
            </div>
          </section>
          <footer
            className="modal-card-foot"
            style={{ backgroundColor: colors.background }}
          >
            <button className="button" onClick={() => setShowDialog(false)}>
              Cancel
            </button>
            <button
              className="button is-success is-light is-outlined"
              onClick={() => {
                createCourse(
                  courseName,
                  layoutName,
                  courseLocation,
                  numberOfHoles,
                  par4s,
                  par5s
                );
                setShowDialog(false);
                // history.push(`/courses/${courseName}/${layoutName}`);
              }}
              disabled={!courseName || !numberOfHoles}
            >
              Save
            </button>
          </footer>
        </div>
      </div>
      <button
        className=" button px-1"
        onClick={() => setShowDialog(true)}
        style={{ backgroundColor: colors.button }}
      >
        <strong>{currentCourseName ? "New Layout" : "New Course"}</strong>
      </button>
    </>
  );
};

export default connector(NewCourse);
