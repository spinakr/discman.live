import React from "react";

export default ({
  title,
  value,
  small,
}: {
  title: string;
  value: string | number | undefined | React.ReactNode;
  small?: boolean;
}) => (
  <>
    {value && (
      <>
        <span className="is-size-7 is-italic">{title} </span>
        <span
          className={`${
            small ? "is-size-6" : "is-size-5"
          } has-text-weight-semibold`}
        >
          {value}
        </span>
      </>
    )}
  </>
);
