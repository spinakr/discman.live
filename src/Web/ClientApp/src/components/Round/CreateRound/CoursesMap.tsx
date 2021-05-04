import React, { useEffect, useState } from "react";
import { Map, Marker, Point } from "pigeon-maps";
import { Coordinates, Course } from "../../../store/Courses";

export interface CoursesMapProps {
  selectedCourse: Course | undefined;
  currentPosition: Coordinates | undefined;
  coursesAvailable: Course[] | undefined;
}

const CoursesMap = ({
  selectedCourse,
  currentPosition,
  coursesAvailable,
}: CoursesMapProps) => {
  const [mapAvailable, setMapAvailable] = useState(true);
  const [center, setCenter] = useState([
    59.91614272103729,
    10.746863315787369,
  ] as Point);
  const [course, setCourse] = useState([
    59.91614272103729,
    10.746863315787369,
  ] as Point);
  const [zoom, setZoom] = useState(12);
  useEffect(() => {
    if (selectedCourse?.coordinates) {
      setCenter([
        selectedCourse.coordinates.latitude,
        selectedCourse.coordinates.longitude,
      ]);
      setCourse([
        selectedCourse.coordinates.latitude,
        selectedCourse.coordinates.longitude,
      ]);
      setMapAvailable(true);
    } else if (currentPosition && currentPosition?.latitude !== 0) {
      setCenter([currentPosition.latitude, currentPosition.longitude]);
      setMapAvailable(true);
    } else {
      setMapAvailable(false);
    }
  }, [selectedCourse, currentPosition]);

  if (!mapAvailable) return null;
  return (
    <Map
      height={selectedCourse ? 100 : 200}
      zoom={zoom}
      center={center}
      onBoundsChanged={({ center, zoom }) => {
        setCenter(center);
        setZoom(zoom);
      }}
    >
      <Marker width={40} color="black" anchor={center} />
      {coursesAvailable &&
        coursesAvailable.map((c) => (
          <Marker
            key={c.id}
            width={30}
            anchor={[c.coordinates.latitude, c.coordinates.longitude] as Point}
          />
        ))}
    </Map>
  );
};

export default CoursesMap;
