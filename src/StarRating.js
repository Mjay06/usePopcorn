import { useState } from "react";
import PropTypes from "prop-types";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

StarRating.propTypes = {
  maxRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.string,
  messages: PropTypes.string,
  defaultRating: PropTypes.number,
  onSetRating: PropTypes.func,
};

export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = "48",
  messages = [],
  defaultRating = 0,
  onSetRating,
}) {
  const [rate, SetRate] = useState(defaultRating);
  const [tempRating, setTempRating] = useState("");

  function handleRating(i) {
    SetRate(i);
    onSetRating(i);
  }

  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size / 1.5}px`,
  };

  const starContainerStyle = {
    display: "flex",
    gap: "4px",
  };
  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            condition={tempRating ? tempRating >= i + 1 : rate >= i + 1}
            key={i}
            onRate={() => handleRating(i + 1)}
            onTempRate={() => setTempRating(i + 1)}
            setTempRating={setTempRating}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rate - 1]
          : tempRating
          ? tempRating
          : rate || ''}
      </p>
    </div>
  );
}

function Star({
  onRate,
  key,
  condition,
  onTempRate,
  setTempRating,
  color,
  size,
}) {
  const starStyle = {
    display: "block",
    width: `${size}px`,
    height: `${size}px`,
    cursor: "pointer",
  };
  console.log(key);
  return (
    <span
      style={starStyle}
      onMouseLeave={() => {
        setTempRating(null);
      }}
      onMouseEnter={() => {
        onTempRate();
      }}
      onClick={onRate}
      role="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill={condition ? `${color}` : "none"}
        stroke={color}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </span>
  );
}

/*

TEXT EXPANDER INDEPENDENT COMPONENT

import "./styles.css";
import {useState} from 'react'
export default function App() {
  return (
    <div>
      <TextExpander>
        Space travel is the ultimate adventure! Imagine soaring past the stars
        and exploring new worlds. It's the stuff of dreams and science fiction,
        but believe it or not, space travel is a real thing. Humans and robots
        are constantly venturing out into the cosmos to uncover its secrets and
        push the boundaries of what's possible.
      </TextExpander>

      <TextExpander
        collapsedNumWords={20}
        expandButtonText="Show text"
        collapseButtonText="Collapse text"
        buttonColor="#ff6622"
      >
        Space travel requires some seriously amazing technology and
        collaboration between countries, private companies, and international
        space organizations. And while it's not always easy (or cheap), the
        results are out of this world. Think about the first time humans stepped
        foot on the moon or when rovers were sent to roam around on Mars.
      </TextExpander>

      <TextExpander expanded={true} className="box">
        Space missions have given us incredible insights into our universe and
        have inspired future generations to keep reaching for the stars. Space
        travel is a pretty cool thing to think about. Who knows what we'll
        discover next!
      </TextExpander>
    </div>
  );
}

function TextExpander({
  collapsedNumWords = 10,
  expandButtonText = "more",
  collapseButtonText = "less",
  buttonColor = "red",
  expanded = false,
  className= '',
  children
}) {
  const collapsedList = children.split(" ").splice(0, collapsedNumWords);
  const collapsedListEditted = [
    ...collapsedList.splice(0, collapsedList.length - 1),
    collapsedList[collapsedList.length - 1] + "...."
  ];
  const collapsedText = collapsedListEditted.join(" ");
  const buttonStyle = { color: buttonColor, marginLeft: '10px' };
  const [expandText, setExpandText] = useState(expanded)
  function handleClick(){
    setExpandText(s=> !s)
  }

  return (
    <div className={className}>
      <p>
        {expandText ? children : collapsedText}
        <span  role="button" onClick={handleClick} style={buttonStyle}>
          {expandText ? `${collapseButtonText}` : `${expandButtonText}`}
        </span>
      </p>
    </div>
  );
}

*/
