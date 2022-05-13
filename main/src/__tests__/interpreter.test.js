import { initEnv, interp, ltsign } from '../interpreter.js';

/**
 * Tests for the primitive functions inside inerpreter.js
 * 
 * When a new function is added to interpreter.js , tests for it should be added here
 */


// plus adds together all numbers given
describe("plus function tests", () => {
    it('interprets the addition of 3 and 4', () => {
        const expectedOutput = {
            value : 7,
            type: 3
        };
        const inputArgs = [
            { value: 3, type: 3 },
            { value: 4, type: 3 }
        ];
        // plus takes two or more numbers
        const addProg = {
            value: {
                funct: {
                    value: "+",
                    type: 0
                },
                args: inputArgs
            },
            type: 1
        };
    
        expect(
            interp(addProg, initEnv)
        ).toEqual(expectedOutput);
    });
    
    it("plus correctly adds more than two numbers", () => {
        const expectedOutput = { value: 22, type: 3 };
        const inputArgs = [
            { value: 5, type: 3 },
            { value: 10, type: 3 },
            { value: 7, type: 3 }
        ];
        // plus takes two or more numbers
        const addProg = {
            value: {
                funct: {
                    value: "+",
                    type: 0
                },
                args: inputArgs
            },
            type: 1
        };
    
        expect(
            interp(addProg, initEnv)
        ).toEqual(expectedOutput);
    });
});


// minus subtracts all numbers
describe("minus function tests", () => {
    it("minus correctly subtracts more than two numbers", () => {
        const expectedOutput = { value: 10, type: 3 };
        const inputArgs = [
            { value: 22, type: 3 },
            { value: 10, type: 3 },
            { value: 2, type: 3 }
        ];
        // minus takes two or more numbers
        const addProg = {
            value: {
                funct: {
                    value: "-",
                    type: 0
                },
                args: inputArgs
            },
            type: 1
        };
    
        expect(
            interp(addProg, initEnv)
        ).toEqual(expectedOutput);
    });
});

// < is true if preceding numbers are smaller
describe("ltsign function tests", () => {
    it("ltsign correctly returns true (< 2 4 6)", () => {
        const expectedOutput = { value: true, type: 4 };
        const inputArgs = [
            { value: 2, type: 3 },
            { value: 4, type: 3 },
            { value: 6, type: 3 }
        ];
        // < takes two or more numbers as arguments
        const ltProg = {
            value: {
                funct: {
                    value: "<",
                    type: 0
                },
                args: inputArgs
            },
            type: 1
        };
        expect(
            interp(ltProg, initEnv)
        ).toEqual(expectedOutput);
    });
    
    it("ltsign correctly returns false for (< 2 8 6)", () => {
        const expectedOutput = { value: false, type: 4 };
        const inputArgs = [
            { value: 2, type: 3 },
            { value: 8, type: 3 },
            { value: 6, type: 3 }
        ];
        // < takes two or more numbers as arguments
        const ltProg = {
            value: {
                funct: {
                    value: "<",
                    type: 0
                },
                args: inputArgs
            },
            type: 1
        };
        expect(
            interp(ltProg, initEnv)
        ).toEqual(expectedOutput);
    });
});


// <= is true if preceding numbers are smaller or equal
describe("lesign function tests", () => {
    it("lesign correctly returns true for (<= 3 5 5)", () => {
        const expectedOutput = { value: true, type: 4 };
        const inputArgs = [
            { value: 3, type: 3 },
            { value: 5, type: 3 },
            { value: 5, type: 3 }
        ];
        // <= takes two or more numbers as arguments
        const leProg = {
            value: { 
                funct: { 
                    value: "<=",
                    type: 0
                },
                args: inputArgs
            },
            type: 1
        };
        expect(
            interp(leProg, initEnv)
        ).toEqual(expectedOutput);
    });
});

// > is true if preceding numbers are greater
describe("gtsign function tests", () => {
    it("gtsign correctly returns true for (> 9 5 2)", () => {
        const expectedOutput = { value: true, type: 4 };
        const inputArgs = [
            { value: 9, type: 3 },
            { value: 5, type: 3 },
            { value: 2, type: 3 }
        ];
        // > takes two or more numbers as arguments
        const gtProg = {
            value: { 
                funct: { 
                    value: ">",
                    type: 0
                },
                args: inputArgs
            },
            type: 1
        };
        expect(
            interp(gtProg, initEnv)
        ).toEqual(expectedOutput);
    });
    
    it("gtsign correctly returns false for (> 3 5 2)", () => {
        const expectedOutput = { value: false, type: 4 };
        const inputArgs = [
            { value: 3, type: 3 },
            { value: 5, type: 3 },
            { value: 2, type: 3 }
        ];
        // > takes two or more numbers as arguments
        const gtProg = {
            value: { 
                funct: { 
                    value: ">",
                    type: 0
                },
                args: inputArgs
            },
            type: 1
        };
        expect(
            interp(gtProg, initEnv)
        ).toEqual(expectedOutput);
    });
});


// >= is true if preceding numbers are greater or equal
describe("gtsign function tests", () => {
    it("gtsign correctly returns true for (>= 9 9 2)", () => {
        const expectedOutput = { value: true, type: 4 };
        const inputArgs = [
            { value: 9, type: 3 },
            { value: 9, type: 3 },
            { value: 2, type: 3 }
        ];
        // >= takes 2 or more numbers as arguments
        const gtProg = {
            value: { 
                funct: { 
                    value: ">=",
                    type: 0
                },
                args: inputArgs
            },
            type: 1
        };
        expect(
            interp(gtProg, initEnv)
        ).toEqual(expectedOutput);
    });
    
    it("gtsign correctly returns false for (>= 6 9 2)", () => {
        const expectedOutput = { value: false, type: 4 };
        const inputArgs = [
            { value: 6, type: 3 },
            { value: 9, type: 3 },
            { value: 2, type: 3 }
        ];
        // >= takes 2 or more numbers as arguments
        const gtProg = {
            value: { 
                funct: { 
                    value: ">=",
                    type: 0
                },
                args: inputArgs
            },
            type: 1
        };
        expect(
            interp(gtProg, initEnv)
        ).toEqual(expectedOutput);
    });
});

// max finds the largest number of the given arguments
describe("max function tests", () => {
    it("max correctly returns 9 for (max 9 3 5)", () => {
        const expectedOutput = { value: 9, type: 3 };
        // arguments for max
        const inputArgs = [
            { value: 9, type: 3 },
            { value: 3, type: 3 },
            { value: 5, type: 3 }
        ];
        // max takes 1 or more numbers as arguments
        const maxProg = {
            value: {
                funct: { 
                    value: "max",
                    type: 0
                },
                args: inputArgs
            },
            type: 1
        };
        expect(
            interp(maxProg, initEnv)
        ).toEqual(expectedOutput);
    });
    
    it("max correctly returns for (max 9 9)", () => {
        const expectedOutput = { value: 9, type: 3 };
        // arguments for max
        const inputArgs = [
            { value: 9, type: 3 },
            { value: 9, type: 3 },
        ];
        // max takes 2 or more numbers as arguments
        const maxProg = {
            value: {
                funct: { 
                    value: "max",
                    type: 0
                },
                args: inputArgs
            },
            type: 1
        };
        expect(
            interp(maxProg, initEnv)
        ).toEqual(expectedOutput);
    });
});

// eqv? is true when the two given arguments are the equivalent
describe("eqv? function tests", () => {
    it("eqv? correctly returns true for (eqv? 5 5)", () => {
        const expectedOutput = { value: true, type: 4 };
        const inputArgs = [
            { value: 5, type: 3 },
            { value: 5, type: 3 }
        ];
        // eqv? takes two arguments of any type
        const iseqvProg = {
            value: {
                funct: {
                    value: "eqv?",
                    type: 0
                },
                args: inputArgs
            },
            type: 1
        };
        expect(
            interp(iseqvProg, initEnv)
        ).toEqual(expectedOutput);
    });
    
    it("(eqv? correctly returns true for (eqv? (circle 150 \"solid\" \"red\") (circle 150 \"solid\" \"red\"))", () => {
        const expectedOutput = { value: true, type: 4 };
        const inputArgs = [ 
            {
            value: { 
                args: [
                    { value: 150, type: 3 },
                    { value: "solid", type: 5 },
                    {value: "red", type: 5 }
                ], 
                funct: { value: "circle", type: 0 }
            },
            type: 1
            },
            {
            value: { 
                args: [
                    { value: 150, type: 3 },
                    { value: "solid", type: 5 },
                    {value: "red", type: 5 }
                ], 
                funct: { value: "circle", type: 0 }
            },
            type: 1
            }
        ];
        // eqv? takes two arguments of any type
        const iseqvProg = {
            value: {
                funct: {
                    value: "eqv?",
                    type: 0
                },
                args: inputArgs
            },
            type: 1
        };
        expect(
            interp(iseqvProg, initEnv)
        ).toEqual(expectedOutput);
    });    
});