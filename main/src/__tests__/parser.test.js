import { parsePrefix } from '../parser.js';

// Check-expect parsing tests

// test function with simple input and with simple output
it('parses \'(check-expect (add1 5) 10)\'', () => {
    const expectedOutput = [
        {
            name: 'add1',
            inputs: [
                {
                    raw: '5',
                    validated: { value: 5, type: 3 }
                }
            ],
            want: {
                raw: '10',
                validated: { value: 10, type: 3 }
            }
        }
    ];
    expect(
        parsePrefix("(check-expect (add1 5) 10)", true)
    ).toEqual(expectedOutput);
});

// test function with simple input and with function output
it('parses \'(check-expect (sub1 10) (- 10 1))\'', () => {
    const expectedProgramOutput = {
        raw: "(- 10 1)",
        validated: {
            value: {
                args: [
                    { value: 10, type: 3 },
                    { value: 1, type: 3 }
                ],
                funct: { value: "-", type: 0 }
            },
            type: 1
        }
    };
    const expectedProgramInput = [{ raw: "10", validated: { value: 10, type: 3 } }];
    const expectedOutput = [{ name: 'sub1', inputs: expectedProgramInput, want: expectedProgramOutput }];
    expect(
        parsePrefix("(check-expect (sub1 10) (- 10 1))", true)
    ).toEqual(expectedOutput);
});

// test function with function input and with simple output
it('parses \'(check-expect (sub1 (* 2 10)) 19)\'', () => {
    const expectedPorgramInput = [{
        raw: "(* 2 10)",
        validated: {
            value: {
                args: [
                    { value: 2, type: 3 },
                    { value: 10, type: 3 }
                ],
                funct: { value: "*", type: 0 }
            },
            type: 1
        }
    }];
    const expectedPorgramOutput = {
        raw: "19",
        validated: { value: 19, type: 3 }
    };
    const expectedOutput = [{ name: 'sub1', inputs: expectedPorgramInput, want: expectedPorgramOutput }];
    expect(
        parsePrefix("(check-expect (sub1 (* 2 10)) 19)", true)
    ).toEqual(expectedOutput);
});

// test function with function input and with function output
it('parses \'(check-expect (sub1 (* 2 10)) (- (* 2 10) 1))\'', () => {
    const expectedPorgramInput = [{
        raw: "(* 2 10)",
        validated: {
            value: {
                args: [
                    { value: 2, type: 3 },
                    { value: 10, type: 3 }
                ],
                funct: { value: "*", type: 0 }
            },
            type: 1
        }
    }];
    const expectedProgramOutput = {
        raw: "(- (* 2 10) 1)",
        validated: {
            value: {
                args: [
                    {
                        value: {
                            args: [
                                { value: 2, type: 3 },
                                { value: 10, type: 3 }
                            ],
                            funct: { value: "*", type: 0 }
                        },
                        type: 1
                    },
                    { value: 1, type: 3 }
                ],
                funct: { value: "-", type: 0 }
            },
            type: 1
        }
    }
    const expectedOutput = [{ name: 'sub1', inputs: expectedPorgramInput, want: expectedProgramOutput }];
    expect(
        parsePrefix("(check-expect (sub1 (* 2 10)) (- (* 2 10) 1))", true)
    ).toEqual(expectedOutput);
});

// test function with string input with parenthesis in it
it('parses \'(check-expect (string-func \'(word\' \'word)\' \'(wordword)\')', () => {
    const expectedProgramInput = [
        {
            raw: '"(word"',
            validated: { value: '(word', type: 5 }
        },
        {
            raw: '"word)"',
            validated: { value: 'word)', type: 5 }
        }
    ];
    const expectedPorgramOutput = {
        raw: '"(wordword)"',
        validated: { value: '(wordword)', type: 5 }
    };

    const expectedOutput = [{ name: 'string-func', inputs: expectedProgramInput, want: expectedPorgramOutput }];
    expect(
        parsePrefix('(check-expect (string-func "(word" "word)") "(wordword)")', true)
    ).toEqual(expectedOutput);
});

// test multiline/tabbed check-expects
it('parses \'(check-expect (funct 3 5) 9) \n \t(check-expect (sub1 5) 4)\'', () => {
    const firstExpectedProgramInput = [
        {
            raw: "3",
            validated: { value: 3, type: 3 }
        },
        {
            raw: "5",
            validated: { value: 5, type: 3 }
        }
    ];
    const firstExpectedProgramOutput = {
        raw: "9",
        validated: { value: 9, type: 3 }
    };
    const secondExpectedProgramInput = [{
        raw: "5",
        validated: { value: 5, type: 3 }
    }];
    const secondExpectedProgramOutput = {
        raw: "4",
        validated: { value: 4, type: 3 }
    };
    const expectedOutput = [
        { name: 'funct', inputs: firstExpectedProgramInput, want: firstExpectedProgramOutput },
        { name: 'sub1', inputs: secondExpectedProgramInput, want: secondExpectedProgramOutput }
    ];
    expect(
        parsePrefix("(check-expect (funct 3 5) 9) \n \t(check-expect (sub1 5) 4)", true)
    ).toEqual(expectedOutput);
});

// test check-expects with no whitespace
it('parses \'(check-expect(sub1 5)4)(check-expect(add1 5)6)\'', () => {
    const expectedProgramInput = [{
        raw: "5",
        validated: { value: 5, type: 3 }
    }];
    const firstExpectedProgramOutput = {
        raw: "4",
        validated: { value: 4, type: 3 }
    };
    const secondExpectedProgramOutput = {
        raw: "6",
        validated: { value: 6, type: 3 }
    };
    const expectedOutput = [
        { name: 'sub1', inputs: expectedProgramInput, want: firstExpectedProgramOutput },
        { name: 'add1', inputs: expectedProgramInput, want: secondExpectedProgramOutput }
    ];
    expect(
        parsePrefix("(check-expect(sub1 5)4)(check-expect(add1 5)6)", true)
    ).toEqual(expectedOutput);
});

// test check-expect with random stuff at start
it('parse \'(rand 10) (funct 1 1) (more-junk) (check-expect (f 5) 6)\'', () => {
    const expectedProgramInput = [{
        raw: "5",
        validated: { value: 5, type: 3 }
    }];
    const expectedProgramOutput = {
        raw: "6",
        validated: { value: 6, type: 3 }
    };
    const expectedOutput = [{ name: 'f', inputs: expectedProgramInput, want: expectedProgramOutput }];
    expect(
        parsePrefix("(rand 10) (funct 1 1) (more-junk) (check-expect (f 5) 6)", true)
    ).toEqual(expectedOutput);
});

// test check-expect with random stuff in middle
it('parse \'(check-expect (f 5) 6) (random-stuff 12) ; \t \n (stuff)(check-expect(function 10) 10)\'', () => {
    const firstExpectedProgramInput = [{
        raw: "5",
        validated: { value: 5, type: 3 }
    }];
    const firstExpectedProgramOutput = {
        raw: "6",
        validated: { value: 6, type: 3 }
    };
    const secondExpectedProgramInput = [{
        raw: "10",
        validated: { value: 10, type: 3 }
    }];
    const secondExpectedProgramOutput = {
        raw: "10",
        validated: { value: 10, type: 3 }
    };
    const expectedOuput = [
        { name: 'func', inputs: firstExpectedProgramInput, want: firstExpectedProgramOutput },
        { name: 'func', inputs: secondExpectedProgramInput, want: secondExpectedProgramOutput }
    ];
    expect(
        parsePrefix("(check-expect (func 5) 6) (random-stuff 12) ; \t \n (stuff)(check-expect(func 10) 10)", true)
    ).toEqual(expectedOuput);
});

// test check-expect with random stuff at end
it('parse \'(check-expect(func 10) 10) (random-stuff 12) ; \t \n (stuff)\'', () => {
    const expectedProgramInput = [{
        raw: "10",
        validated: { value: 10, type: 3 }
    }];
    const expectedProgramOutput = {
        raw: "10",
        validated: { value: 10, type: 3 }
    };
    const expectedOuput = [{ name: 'func', inputs: expectedProgramInput, want: expectedProgramOutput }];
    expect(
        parsePrefix("(check-expect(func 10) 10) (random-stuff 12) ; \t \n (stuff)", true)
    ).toEqual(expectedOuput);
});

// test for error when input is incorrect
it('throws error for \'(check-expect (5 7) 6)\'', () => {
    expect(() => {
        parsePrefix("(check-expect (5 7) 6)")
    }).toThrow('check-expect must call a function!');
});

// test for error when no output is provided
it('throws error for \'(check-expect (funct 1))\'', () => {
    expect(() => {
        parsePrefix("(check-expect (funct 1))")
    }).toThrow("check-expect must have an output!");
});

// test check-expect regex
it('matches \'(check-expect (function 10) 15))\'', () => {
    const checkExpectRE = /(?<ce>\(\s*check-expect)(?=$|[\s",'`()[\]{}|;#])/;
    expect('(check-expect (function 10) 15))').toMatch(checkExpectRE);
});

// only matches the first check-expect
it('matches \'(check-expect (function 10)) 15)\n(check-expect (add 2 3) 5))\'', () => {
    const checkExpectRE = /(?<ce>\(\s*check-expect)(?=$|[\s",'`()[\]{}|;#])/;
    expect('(check-expect (function 10)) 15)\n(check-expect (add 2 3) 5))').toMatch(checkExpectRE);
});

// matches with no space
it('matches \'(check-expect(function 10) 10))\'', () => {
    const checkExpectRE = /(?<ce>\(\s*check-expect)(?=$|[\s",'`()[\]{}|;#])/;
    expect('(check-expect(function 10) 10)').toMatch(checkExpectRE);
});

// matches with white space
it('matches \'( check-expect(function 10) 10))\'', () => {
    const checkExpectRE = /(?<ce>\(\s*check-expect)(?=$|[\s",'`()[\]{}|;#])/;
    expect('( check-expect(function 10) 10)').toMatch(checkExpectRE);
});

// matches with junk infront of check-expect
it('matches \'(random-stuff 12) ; \t \n (stuff)(check-expect(function 10) 10))\'', () => {
    const checkExpectRE = /(?<ce>\(\s*check-expect)(?=$|[\s",'`()[\]{}|;#])/;
    expect('( check-expect(function 10) 10)').toMatch(checkExpectRE);
});

// doesn't match with added characters
it('does not match \'(check-expect! (function 10) 10))\'', () => {
    const checkExpectRE = /(?<ce>\(\s*check-expect)(?=$|[\s",'`()[\]{}|;#])/;
    expect('(check-expect! (function 10) 10))').not.toMatch(checkExpectRE);
});


// wrong syntax tests
it('does not parse \'(check-expect)add 1 2) 3)\'', () => {
    expect(() => {
        parsePrefix("(check-expect)add 1 2) 3)", true)
    }).toThrow("syntax error");
});
it('does not parse \'(check-expect 3add 1 2) 3)\'', () => {
    expect(() => {
        parsePrefix("(check-expect 3add 1 2) 3)", true)
    }).toThrow("syntax error");
});