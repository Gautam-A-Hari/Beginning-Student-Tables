import {yellow, isBooleanFormula} from './header.js';
import {RVAR_T, RAPP_T, RFUNCT_T, RNUM_T, RBOOL_T, RSTRING_T, RLIST_T, RSYM_T} from './interpreter.js';

/*********************
    Pretty Printer
*********************/

/***
  Data Definitions
  
  A Doc is one of
    - Nil
    - Compose
    - Nest
    - Text
    - Line
    - Union
  
  A Nil is
    {type: 'nil'}
    
  A Compose is
    {type: 'compose',
     left: Doc,
     right: Doc}
     
  A Nest is
    {type:   'nest',
     indent: Integer,
     rest:   Doc}

  A Text is
     {type: 'text',
      text: String}
      
  A Line is
    {type: 'line'}
     
  A Union is
    {type:  'union',
     left:  Doc,
     right: Doc}
     
  A Pair is
    {doc:    Doc,
     indent: Integer}
***/

// Doc
const nil = {type: 'nil'};

// String -> Doc
function text (string) {
    if (string === '') {
        return nil;
    } else {
        return {type: 'text', text: String(string)};
    }
}

// String -> Doc -> Doc
function Text (string, doc) {
    return compose(text(string), doc);
}

// Doc
const line = {type: 'line'};

// Integer -> Doc -> Doc
function Line (i, doc) {
    return compose(nest(i, line), doc);
}

// Doc -> Doc -> Doc
function union (docL, docR) {
    return {type: 'union', left: docL, right: docR};
}

function Union (docL, docR) {
    return union(docL, docR);
}

// Doc -> Doc -> Doc
// in the paper this is written as <> and is sometimes called 'concatenate'
//   I prefer the name 'compose' so as to not confuse the term with
//   string concatenation
// however it may be confused with function composition...
function compose (docL, docR) {
    // switch(docR.type) {
    // case 'union':
    //     return union(compose(docL, docR.left), compose(docL, docR.right));
    // default:
    //     break;
    // }
    switch (docL.type) {
    case 'nil':
        return docR;
    case 'compose':
        return {type: 'compose', left: docL.left, right: compose(docL.right, docR)};
    case 'union':
        return union(compose(docL.left, docR), compose(docL.right, docR));
    default:
        return {type: 'compose', left: docL, right: docR};
    }
}

// Integer -> Doc -> Doc
function nest (i, doc) {
    switch (doc.type) {
    case 'nil':
        return nil;
    case 'compose':
        return compose(nest(i, doc.left), nest(i, doc.right));
    case 'nest':
        return {type: 'nest', indent: doc.indent + i, rest: doc.rest};
    case 'text':
        return doc;
    case 'line':
        return {type: 'nest', indent: i, rest: doc};
    case 'union':
        return union(nest(i, doc.left), nest(i, doc.right));
    default:
        throw Error(`unnexpected document type: ${doc.type}`);
    }
}

// Doc -> String
function layout (doc) {
    switch (doc.type) {
    case 'nil':
        return '';
    case 'compose':
        return layout(doc.left) + layout(doc.right);
    case 'nest':
        return layout(doc.rest) +  ' '.repeat(doc.indent); // doc.rest has to be a line
    case 'text':
        return doc.text;
    case 'line':
        return '\n';
    default:
        throw Error(`unnexpected document type: ${doc.type}`);
    }
}

// Doc -> Doc
function group (doc) {
    return union(flatten(doc), doc);
}

// Doc -> Doc
function flatten (doc) {
    switch (doc.type) {
    case 'nil':
        return nil;
    case 'compose':
        return compose(flatten(doc.left), flatten(doc.right));
    case 'nest':
        return flatten(doc.rest);
    case 'text':
        return doc;
    case 'line':
        return text(' ');
    case 'union':
        return flatten(doc.left);
    default:
        throw Error(`unnexpected document type: ${doc.type}`);
    }
}

// Integer -> Integer -> (Doc -> String)
function makePretty (width, ribbon) {

    // Integer -> Integer  -> [Pair] -> Doc
    // it's like best, but better!
    function be (r, k, pairs) {
        if (pairs.length === 0) {
            return nil;
        }

        let doc = pairs[0].doc;
        let indent = pairs[0].indent;
        let rest = pairs.splice(1);

        switch (doc.type) {
        case 'nil':
            return be(r, k, rest);
        case 'compose':
            return be(r, k, [{indent, doc: doc.left}, {indent, doc: doc.right}, ...rest]);
        case 'nest':
            return be(r, k, [{indent: indent + doc.indent, doc: doc.rest}, ...rest]);
        case 'text':
            return Text(doc.text, be(r, k + doc.text.length, rest));
        case 'line':
            return Line(indent, be(r + indent, indent, rest));
        case 'union':
            return better(r, k, be(r, k, [{indent, doc: doc.left}, ...rest]),
                                be(r, k, [{indent, doc: doc.right}, ...rest]));
        default:
            throw Error(`unnexpected document type: ${doc.type}`);
        }
    }

    // Integer -> Integer -> Doc -> Doc
    function best (thisRibbon, current, doc) {
        return be(thisRibbon, current, [{indent: 0, doc: doc}])
    }

    // Integer -> Integer -> Integer -> Doc -> Doc -> Doc
    function better (thisRibbon, current, docL, docR) {
        if (fits(width - current, thisRibbon - current, docL)) {
            return docL;
        } else {
            return docR;
        }
    }

    // Integer -> Integer -> Doc -> Boolean
    function fits(diffWidth, diffRibbon, doc) {
        if (diffWidth < 0 || diffRibbon < 0) {
            return false;
        }

        switch (doc.type) {
        case 'nil':
            return true;
        case 'compose':
            switch (doc.left.type) {
            case 'text':
                return fits(diffWidth - doc.left.text.length, diffRibbon - doc.left.text.length, doc.right);
            case 'nest': // TODO: not sure if this should be here
                return fits(diffWidth - doc.left.indent, diffRibbon - doc.left.indent, doc.right);
            case 'line':
                return true;
            default:
                throw Error(`unnexpected document type: ${doc.left.type}`);
            }
        default:
            throw Error(`unnexpected document type: ${doc.type}`);
        }
    }

    // Doc -> String
    function pretty (doc) {
        return layout(best(ribbon, 0, doc));
        //return layout(best(ribbon, 0, doc));
    }

    return pretty;
}

/***
   Utility Functions
                   ***/

// Doc -> Doc -> Doc
function putSpace (docL, docR) {
    return compose(docL, compose(text(' '), docR));
}

// Doc -> Doc -> Doc
function putLine (docL, docR) {
    return compose(docL, compose(line, docR));
}

// Doc -> Doc -> Doc
function spaceOrLine(docL, docR) {
    return union(putSpace(docL, docR), putLine(docL, docR));
}

// (Doc -> Doc -> Doc) -> [Doc] -> Doc
function folddoc (f, docs) {
    if (docs.length === 0) {
        return nil;
    } else if (docs.length === 1) {
        return docs[0];
    } else {
        return f(docs[0], folddoc(f, docs.splice(1)));
    }
}

// [☺String, Doc☹] -> Doc
// where [☺String, Doc☹] means an array of elements that are either a Doc or a String (disjunction or whatever)
function docify(stuff) {
    return stuff.map((elem) => typeof elem === 'string' ? text(elem) : elem);
}

// [Doc] -> Doc
// puts a space between docs
function spread (docs) {
    return folddoc(putSpace, docs);
}

// [Doc] -> Doc
// puts a line between docs
function stack (docs) {
    return folddoc(putLine, docs);
}

// [Doc] -> Doc
// puts more lines between docs
function superstack (docs) {
    return folddoc((docL, docR) => compose(docL, compose(line, compose(line, compose(line, docR)))), docs);
}

// [Doc] -> Doc
// fills available horizontal space
function fill(docs){
    return folddoc(spaceOrLine, docs);
}

// [Doc] -> Doc
// puts docs right next to eachother
function level (docs) {
    return folddoc(compose, docs);
}

// String -> Doc -> String -> Doc
// puts the given document between left and right
function bracket (left, doc, right) {
    return level([text(left), doc, text(right)]);
}


/**************************************
    Thing that Turns Tables Into BSL
**************************************/

// Program -> Doc
function progToDoc (program) {
    switch (program.type) {
    case RVAR_T:
        return text(program.value);
    case RAPP_T:
        return nest(1, bracket('(', group(stack([progToDoc(program.value.funct), ...program.value.args.map(progToDoc)])), ')'));
    case RFUNCT_T:
        return text('function');
    case RNUM_T:
        return text(program.value);
    case RBOOL_T:
        return text('#' + program.value);
    case RSTRING_T:
        return text(program.value);
    case RLIST_T: // this just does cons, not list
        if (program.value === null) {
            return text("'()");
        } else {
            return nest(1, bracket('(', group(stack([text('cons'), progToDoc(program.value.a), progToDoc(program.value.d)])), ')'));
        }
    case RSYM_T:
        return text("'" + program.value);
    default:
        throw new Error('unknown program type');
    }
}

// Program -> Doc
function progToDoc_list (program) {
    switch (program.type) {
    case RVAR_T:
        return text(program.value);
    case RAPP_T:
        return nest(1, bracket('(', group(stack([progToDoc(program.value.funct), ...program.value.args.map(progToDoc)])), ')'));
    case RFUNCT_T:
        return text('function');
    case RNUM_T:
        return text(program.value);
    case RBOOL_T:
        return text('#' + program.value);
    case RSTRING_T:
        return text(program.value);
    case RLIST_T:
        if (program.value === null) {
            return text("'()");
        }

        let list = program.value.d,
            elems = progToDoc_list(program.value.a);
        while (list.value !== null) {
            elems = stack([elems, progToDoc_list(list.value.a)]);
        }

        return bracket('(', spread([text('list'), group(elems)]), ')');
    case RSYM_T:
        return text("'" + program.value);
    default:
        throw new Error('unknown program type');
    }
}

// makes a Haskell document (as defined in projects/haskellPretty/prettier.hs)
// I'm too lazy to do this by hand
function toHaskDoc (doc) {
    switch (doc.type) {
    case 'nil':
        return 'nil';
    case 'compose':
        return `${toHaskDoc(doc.left)} :<> ${toHaskDoc(doc.right)}`;
    case 'nest':
        return `nest ${doc.indent} ${toHaskDoc(doc.rest)}`;
    case 'text':
        return `text "${doc.text}"`;
    case 'line':
        return 'line';
    case 'union':
        return `${toHaskDoc(doc.left)} :<|> ${toHaskDoc(doc.right)}`;
    default:
        throw Error('invalid doc type: '+doc.type);
    }
}

// [Table] -> String
function toBSL(tables, unparse, width, ribbon) {
    let pretty = makePretty(width, ribbon);
    let essaie = stack([...tables.map(tableToDoc), nil]);
    //return toHaskDoc(essaie);
    return pretty(essaie);
    //return `${pretty(essaie)}\n\n\n${toHaskDoc(essaie)}`;
    //return 'hi';

    // Table -> Doc
    function tableToDoc(table) {
        let name = fieldToDoc(table.name);
        let params = spread(table.params.map((param) => fieldToDoc(param.name)));

        let checkExpects = stack(table.examples.map((example) => {
            let inputs = stack(example.inputs.map((input) => fieldToDoc(input.prog)));
            let want = fieldToDoc(example.want);

            return nest(1, bracket('(', group(stack([text('check-expect'), bracket('(', nest(1, stack([name, inputs])), ')'), want])), ')'));
        }));

        let body = formulasToDoc(table.formulas);
        let funct = nest(2, bracket('(', spread([text('define'), group(stack([bracket('(', spread([name, params]), ')'), body]))]), ')'));
        return stack([funct, line, checkExpects]);
    }

    // [Formula] -> Doc
    function formulasToDoc(formulas) {
        // [Formula] -> {bools: [Formula], nonbools: [Formula]}
        function splitFormulas(formulas) {
            let bools = formulas.filter(isBooleanFormula);
            let nonbools = formulas.filter((formula) => !isBooleanFormula(formula));
            return {bools, nonbools};
        }

        let splitForms = splitFormulas(formulas);

        // this one's a doc
        let nonbools = stack(splitForms.nonbools.map((form) => fieldToDoc(form.prog))),
            bools;

        if (splitForms.bools.length !== 0) {
            // this is an array of documents
            let condRows = splitForms.bools.map((form) => (
                nest(1, bracket('[', stack([fieldToDoc(form.prog), formulasToDoc(form.thenChildren)]),']'))
            ));
            // this one is just a doc
            bools = nest(2, bracket('(', stack([text('cond'), ...condRows]),')'));
        }

        if (splitForms.bools.length !== 0 && splitForms.nonbools.length !== 0) {
            return stack([bools, nonbools]);
        } else if (splitForms.bools.length !== 0) {
            return bools;
        } else if (splitForms.nonbools.length !== 0) {
            return nonbools;
        } else {
            return nil;
        }
    }

    // Field (yellow or string or program) -> Doc
    function fieldToDoc(input) {
        if (input === yellow) {                 // empty
            return text('...');
        } else if (typeof input === 'string') { // name
            return text(input);
        } else {                                // program
            return progToDoc(input);
        }
    }
}

// Program -> Doc
function progToDoc_noGroup (program) {
    switch (program.type) {
    case RVAR_T:
        return text(program.value);
    case RAPP_T:
        return nest(1, bracket('(', stack([progToDoc_noGroup(program.value.funct), ...program.value.args.map(progToDoc_noGroup)]), ')'));
    case RFUNCT_T:
        return text('function');
    case RNUM_T:
        return text(program.value);
    case RBOOL_T:
        return text('#' + program.value);
    case RSTRING_T:
        return text(program.value);
    case RLIST_T:
        if (program.value === null) {
            return text("'()");
        } else {
            return nest(1, bracket('(', stack([text('cons'), progToDoc_noGroup(program.value.a), progToDoc_noGroup(program.value.d)]), ')'));
        }
    case RSYM_T:
        return text("'" + program.value);
    default:
        throw new Error('unknown program type');
    }
}

// [Table] -> String
function toBSL_noGroup(tables, unparse, width, ribbon) {
    let pretty = makePretty(width, ribbon);
    let essaie = stack([...tables.map(tableToDoc), nil]);
    //return toHaskDoc(essaie);
    return pretty(essaie);
    //return `${pretty(essaie)}\n\n\n${toHaskDoc(essaie)}`;
    //return 'hi';

    // Table -> Doc
    function tableToDoc(table) {
        let name = fieldToDoc(table.name);
        let params = spread(table.params.map((param) => fieldToDoc(param.name)));

        let checkExpects = stack(table.examples.map((example) => {
            let inputs = stack(example.inputs.map((input) => fieldToDoc(input.prog)));
            let want = fieldToDoc(example.want);

            return nest(1, bracket('(', stack([text('check-expect'), bracket('(', nest(1, stack([name, inputs])), ')'), want]), ')'));
        }));

        let body = formulasToDoc(table.formulas);
        let funct = nest(2, bracket('(', spread([text('define'), stack([bracket('(', spread([name, params]), ')'), body])]), ')'));
        return stack([funct, line, checkExpects]);
    }

    // [Formula] -> Doc
    function formulasToDoc(formulas) {
        // [Formula] -> {bools: [Formula], nonbools: [Formula]}
        function splitFormulas(formulas) {
            let bools = formulas.filter(isBooleanFormula);
            let nonbools = formulas.filter((formula) => !isBooleanFormula(formula));
            return {bools, nonbools};
        }

        let splitForms = splitFormulas(formulas);

        // this one's a doc
        let nonbools = stack(splitForms.nonbools.map((form) => fieldToDoc(form.prog))),
            bools;

        if (splitForms.bools.length !== 0) {
            // this is an array of documents
            let condRows = splitForms.bools.map((form) => (
                nest(1, bracket('[', stack([fieldToDoc(form.prog), formulasToDoc(form.thenChildren)]),']'))
            ));
            // this one is just a doc
            bools = nest(2, bracket('(', stack([text('cond'), ...condRows]),')'));
        }

        if (splitForms.bools.length !== 0 && splitForms.nonbools.length !== 0) {
            return stack([bools, nonbools]);
        } else if (splitForms.bools.length !== 0) {
            return bools;
        } else if (splitForms.nonbools.length !== 0) {
            return nonbools;
        } else {
            return nil;
        }
    }

    // Field (yellow or string or program) -> Doc
    function fieldToDoc(input) {
        if (input === yellow) {                 // empty
            return text('...');
        } else if (typeof input === 'string') { // name
            return text(input);
        } else {                                // program
            return progToDoc_noGroup(input);
        }
    }
}

/****************
    Unparsers
****************/
const widePretty = makePretty(Infinity, Infinity);

export let unparse_cons = (prog) => widePretty(progToDoc(prog));
export let unparse_list = (prog) => widePretty(progToDoc_list(prog));

export default toBSL_noGroup;
// export default toBSL;
