import React from "react";
import { CheckExpectArea } from "../components/CheckExpectArea"
import { shallow, mount } from 'enzyme';
import "../setupTest.js"

describe("test import button", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(<CheckExpectArea text={""} error={undefined} importCheckExpects={(string) => null} />);
        jest.clearAllMocks();
    });
    it("renders the import button", () => {
        expect(wrapper.find('button').text()).toEqual('Import');
    });
});