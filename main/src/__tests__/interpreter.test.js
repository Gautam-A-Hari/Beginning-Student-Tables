import { Types } from '../global-definitions';
import { initEnv, interp } from '../interpreter.js';

it('interprets the addition of 3 and 4', () => {
    const expectedOutput = {
        value : 7,
        type: 3
    };

    const addProg = {
        value: {
            funct: {
                value: "+",
                type: 0
            },
            args: [
                {
                    value: 3,
                    type: 3
                },
                {
                    value: 4,
                    type: 3
                }
            ]
        },
        type: 1
    };

    expect(
        interp(addProg, initEnv)
    ).toEqual(expectedOutput);
});