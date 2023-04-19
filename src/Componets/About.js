import React from "react";
import { useContext } from "react";
import noteContext from "../context/noteContext";

function About() {
  const a = useContext(noteContext);

  return <div>About {a.name}</div>;
}

export default About;
