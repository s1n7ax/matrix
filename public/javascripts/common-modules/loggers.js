function logger(type, args){
    try{
        this[type](args);
    }catch (error){
        let callerFuntion = arguments.callee.caller.toString();
        switch(error.name){
            case 'ReferenceError': {
                error(`caller function :${callerFuntion} first argument: ${arguments[0]} is invalide!`);
            } break;
        }
    }
}

function error() {
    console.log('\n***************************');
    printAllArgs(arguments);
    console.log('***************************');
}


function success() {
    console.log('\n--------------------------');
    printAllArgs(arguments);
    console.log('--------------------------');
}

function defaultLog() {
    console.log('');
    printAllArgs(arguments);
}


function logHeader(header){
    console.log('');
    printAllArgs(arguments, '----> ');
}

function logSub(){
    printAllArgs(arguments, '   |----> ');
}

function logSub2(){
    printAllArgs(arguments, '      |----> ');
}



function printAllArgs(args, styleBefore, styleAfter){
    for(let i = 0; i < args.length; i++) {
        if(typeof args[i] === 'string'){
            let message = args[i];
            if(styleBefore) message = styleBefore + message;
            if(styleAfter) message = message + styleAfter;
            console.log(message);
        }
        else if(typeof args[i] === 'object'){
            styleBefore && console.log(styleBefore);
            console.log(args[i]);
            styleAfter && console.log(styleAfter);
        }
    }
}
