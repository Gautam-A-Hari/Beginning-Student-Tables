import React from "react";
import { App } from "../App";
import { shallow, mount, render } from "enzyme";
import "../setupTest.js"

it("renders without crashing", () => {
    shallow(<App />);
});

// TODO: test check-expect imports
describe("test check-expect import", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<App />);
        jest.clearAllMocks();
    });
    it("tables are empty on initialization", () => {
        const emptyTables = [{
            examples: [{ inputs: [{ prog: { raw: '', validated: { yellow: 'yellow' } }, key: expect.any(Number) }], want: { raw: '', validated: { yellow: 'yellow' } }, wantInputRef: React.createRef(), key: expect.any(Number) }],
            formulas: [{ prog: { raw: '', validated: { yellow: 'yellow' } }, outputs: [{ yellow: 'yellow' }], key: expect.any(Number) }],
            params: [{ name: { yellow: 'yellow' }, key: expect.any(Number) }],
            name: { yellow: 'yellow' },
            signature: { yellow: 'yellow' },
            purpose: { yellow: 'yellow' },
            key: expect.any(Number)
        }];
        expect(wrapper.state('tables')).toEqual(emptyTables);
    });

    /**
     * Tests whether the method called by the 'import' button in the CheckExpectArea component correctly imports a check-expect
     * expression into an empty table
     * 
     * The CheckExpectArea component's 'import' button is tested separatley inside CheckExpectArea.test.jsx
     */
    it("imports (check-expect (f 2) 5) to an empty table correctly", () => {
        const modifiedTables = [{
            examples: [
                {
                    inputs: [{ prog: { raw: '2', validated: { value: 2, type: 3 } }, key: expect.any(Number) }],
                    want: { raw: '5', validated: { value: 5, type: 3 } }, wantInputRef: React.createRef(), key: expect.any(Number)
                }
            ],
            formulas: [{ prog: { raw: '', validated: { yellow: 'yellow' } }, outputs: [{ yellow: 'yellow' }], key: expect.any(Number) }],
            params: [{ name: { yellow: 'yellow' }, key: expect.any(Number) }],
            name: 'f',
            signature: { yellow: 'yellow' },
            purpose: { yellow: 'yellow' },
            key: expect.any(Number)
        }];
        wrapper.instance().importCheckExpects("(check-expect (f 2) 5)");
        expect(wrapper.state('tables')).toEqual(modifiedTables);

    });

    it("imports (check-expect (f 2 5) 10) to a table with one paramter field correctly", () => {
        const baseTables = [{
            examples: [
                {
                    inputs: [{ prog: { raw: '2', validated: { value: 2, type: 3 } }, key: expect.any(Number) }],
                    want: { raw: '5', validated: { value: 5, type: 3 } }, wantInputRef: React.createRef(), key: expect.any(Number)
                }
            ],
            formulas: [{ prog: { raw: '', validated: { yellow: 'yellow' } }, outputs: [{ yellow: 'yellow' }], key: expect.any(Number) }],
            params: [{ name: { yellow: 'yellow' }, key: expect.any(Number) }],
            name: 'f',
            signature: { yellow: 'yellow' },
            purpose: { yellow: 'yellow' },
            key: expect.any(Number)
        }];
        const modifiedTables = [{
            examples: [
                {
                    inputs: [
                        { prog: { raw: '2', validated: { value: 2, type: 3 } }, key: expect.any(Number) },
                        { prog: { raw: '', validated: { yellow: 'yellow' } }, key: expect.any(Number) }
                    ],
                    want: { raw: '5', validated: { value: 5, type: 3 } }, wantInputRef: React.createRef(), key: expect.any(Number)
                },
                {
                    inputs: [
                        { prog: { raw: '2', validated: { value: 2, type: 3 } }, key: expect.any(Number) },
                        { prog: { raw: '5', validated: { value: 5, type: 3 } }, key: expect.any(Number) }
                    ],
                    want: { raw: '10', validated: { value: 10, type: 3 } }, wantInputRef: React.createRef(), key: expect.any(Number)
                }
            ],
            formulas: [
                {
                    prog: { raw: '', validated: { yellow: 'yellow' } },
                    outputs:
                        [{ yellow: 'yellow' }, { yellow: 'yellow' }],
                    key: expect.any(Number)
                },
            ],
            params: [
                { name: { yellow: 'yellow' }, key: expect.any(Number) },
                { name: { yellow: 'yellow' }, key: expect.any(Number) }
            ],
            name: 'f',
            signature: { yellow: 'yellow' },
            purpose: { yellow: 'yellow' },
            key: expect.any(Number)
        }];
        wrapper.setState({ tables: baseTables });
        wrapper.instance().importCheckExpects("(check-expect (f 2 5) 10)");
        expect(wrapper.state('tables')).toEqual(modifiedTables);
    });

});