import React from "react";
import { App } from "../App";
import { shallow, mount, render } from "enzyme";
import "../setupTest.js"

it("renders without crashing", () => {
    shallow(<App />);
});