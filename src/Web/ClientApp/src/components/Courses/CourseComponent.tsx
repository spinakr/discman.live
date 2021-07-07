import * as React from "react";
import { Course } from "../../store/Courses";
import CourseDetails from "./CourseDetails";
import { useParams, useHistory } from "react-router";
import NewCourse from "./NewCourse";
import colors from "../../colors";

interface CourseProps {
  layouts: Course[];
  updateCourse: (course: Course) => void;
}

const CourseComponent = ({ layouts, updateCourse }: CourseProps) => {
  let { courseName, courseLayout } = useParams<{
    courseName: string;
    courseLayout: string;
  }>();
  const history = useHistory();
  if (!layouts || layouts.length === 0) return null;
  const selectedLayout = courseLayout
    ? layouts.find((c) => c.layout === courseLayout)
    : layouts[0];

  return (
    <>
      {selectedLayout && (
        <>
          <h1 className="title">{courseName}</h1>
          <div className="field is-grouped">
            <div className="control">
              <div className="select">
                <select
                  value={selectedLayout.layout || ""}
                  onChange={(e) =>
                    history.push(`/courses/${courseName}/${e.target.value}`)
                  }
                  style={{ backgroundColor: colors.field }}
                >
                  {layouts.map((l) => (
                    <option key={l.id} value={l.layout}>
                      {l.layout}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <NewCourse currentCourse={selectedLayout} />
          </div>

          <CourseDetails course={selectedLayout} updateCourse={updateCourse} />
        </>
      )}
    </>
  );
};

export default CourseComponent;
