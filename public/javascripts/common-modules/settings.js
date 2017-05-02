APPLICATION_NAME = '';

APPLICATION_COMMAND_LIST = [
    "Comment", "KeyPress", "GetObjectCount", "CheckDBResults", "SetDBResult", "CreateDBConnection", "Screenshot", "Fail", "Loop",
    "Else", "CheckChartContent", "If", "CheckPattern", "NavigateToURL", "Type", "DoubleClick", "Call", "SwitchUser", "ClickAt",
    "Click", "EditVariable", "CheckElementPresent", "GoBack", "Select", "Retrieve", "EndLoop", "MouseMoveAndClick", "SetVarProperty",
    "ElseIf", "DoubleClickAt", "CheckTextPresent", "SelectFrame", "WriteToReport", "HandlePopup", "EndIf", "SelectWindow", "FireEvent",
    "CheckTable", "CreateUser", "SetVariable", "Store", "StartComment", "Pause", "CheckObjectProperty", "MouseOver", "Open", "EndComment",
    "CheckDocument", "HandleImagePopup", "CheckImagePresent", "RightClick", "Break"
];

STARTS_WITH_COMMAND_REGEX = getStartsWithCommandRegex();

CONTAINS_WHITE_SPACE_REGEX = new RegExp(/\s+/);

CONTAINS_WHITE_SPACE_GLOBAL_REGEX = new RegExp(/\s+/, 'g');

NO_SPACE_REGEX = new RegExp(/\S/);

STARTS_WITH_CALL_REGEX = new RegExp(/^call/, 'i');
