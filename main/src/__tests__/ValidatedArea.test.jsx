import React from "react";
import { ValidatedArea } from "../components/ValidatedArea";
import { shallow, mount, render } from "enzyme";
import "../setupTest.js"

describe("", () => {
    it("renders with text", () => {
        const wrapper = mount(<ValidatedArea placeholder={"text"}
            text={undefined}
            rawText={"testing text"}
            disabled={false}
            isValid={() => { }}
            onValid={() => { }}
            onEmpty={() => { }}
        />);
        const value = wrapper.find("textarea").text();
        expect(value).toEqual("testing text");

    });
});
