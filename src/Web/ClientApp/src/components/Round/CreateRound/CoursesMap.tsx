import React, { useEffect, useState } from "react";
import { Map, Marker, Point } from "pigeon-maps";
import { Course } from "../../../store/Courses";

export interface CoursesMapProps {
  selectedCourse: Course | undefined;
}

const CoursesMap = ({ selectedCourse }: CoursesMapProps) => {
  const [mapAvailable, setMapAvailable] = useState(true);
  const [center, setCenter] = useState([
    59.91614272103729,
    10.746863315787369,
  ] as Point);
  const [course, setCourse] = useState([
    59.91614272103729,
    10.746863315787369,
  ] as Point);
  const [zoom, setZoom] = useState(10);
  useEffect(() => {
    if (!navigator.geolocation) {
      setMapAvailable(false);
      return;
    }
    if (selectedCourse?.coordinates) {
      setCenter([
        selectedCourse.coordinates.latitude,
        selectedCourse.coordinates.longitude,
      ]);
      setCourse([
        selectedCourse.coordinates.latitude,
        selectedCourse.coordinates.longitude,
      ]);
    } else {
      navigator.geolocation.getCurrentPosition(
        (r) => {
          setCenter([r.coords.latitude, r.coords.longitude]);
        },
        (err) => console.log(err)
      );
    }
  }, [selectedCourse]);

  if (!mapAvailable || !selectedCourse?.coordinates) return null;
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
      <Marker width={50} anchor={course} />
    </Map>
  );
};

export default CoursesMap;
