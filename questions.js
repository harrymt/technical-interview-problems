/* eslint-disable */

// Hide all answers, ctrl+K + ctrl+0

// What is a potential pitfall with using vvv to determine if bar is an object?
    typeof bar === 'object'

    // answer
        // > null is also an object
        typeof null === 'object'
        // > true

    // How can this pitfall be avoided?

    // answer
        (bar !== null) && (typeof bar === "object")


// What will this output, and why?
    (function(){
        var a = b = 3;
    })();
    console.log("a defined? " + (typeof a !== 'undefined'));
    console.log("b defined? " + (typeof b !== 'undefined'));

    // answer
        undefined
        undefined
        // Because a and b are defined in the scope of the function
        var a = b = 3; // translates to the following when not 'use strict', otherwise its a runtime error
        b = 3;
        var a = b;