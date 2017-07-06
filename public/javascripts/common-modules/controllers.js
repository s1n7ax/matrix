function getStartsWithCommandRegex() {
    let cmds = APPLICATION_COMMAND_LIST;
    let result = '';

    for(i = 0, len = cmds.length; i < len; i++){
        result += '^' + cmds[i];
        if(len > 1 + i) result += '|';
    }
	
    return new RegExp(result, 'i');
}

function assertEqual(expected, actual){
    if(expected !== actual){
        let error = new Error();
        error.name = "ActualIsNotExpected";
        throw error;
    }
}

function assertNotEqual(expected, actual){
    if(expected === actual){
        let error = new Error();
        error.name = "ActualIsExpected";
        throw error;
    }
}
