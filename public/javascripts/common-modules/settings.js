APPLICATION_NAME = '';

VTAF_COMMANDS = [
    "Comment", "KeyPress", "GetObjectCount", "CheckDBResults", "SetDBResult", "CreateDBConnection", "Screenshot", "Fail", "Loop",
    "Else", "CheckChartContent", "If", "CheckPattern", "NavigateToURL", "Type", "DoubleClick", "Call", "SwitchUser", "ClickAt",
    "Click", "EditVariable", "CheckElementPresent", "GoBack", "Select", "Retrieve", "EndLoop", "MouseMoveAndClick", "SetVarProperty",
    "ElseIf", "DoubleClickAt", "CheckTextPresent", "SelectFrame", "WriteToReport", "HandlePopup", "EndIf", "SelectWindow", "FireEvent",
    "CheckTable", "CreateUser", "SetVariable", "Store", "StartComment", "Pause", "CheckObjectProperty", "MouseOver", "Open", "EndComment",
    "CheckDocument", "HandleImagePopup", "CheckImagePresent", "RightClick", "Break"
];

SEETEST_COMMANDS = ["Launch", "Tap", "Swipe", "Rotate", "PerformUserActions", "DragToElement", "CheckPattern", "ElementSwipe", "ElementDrag" ,"Landscape", 
    "Portrait", "Home", "Enter", "Wake", "Unlock", "Browserback", "Menu", "RecentApps", "Power", "CloseKeyboard", "Paste", "Backspace", "Back", "LongTap"];


APPLICATION_COMMAND_LIST = VTAF_COMMANDS.concat(SEETEST_COMMANDS);

STARTS_WITH_COMMAND_REGEX = getStartsWithCommandRegex();

CONTAINS_WHITE_SPACE_REGEX = new RegExp(/\s+/);

CONTAINS_WHITE_SPACE_GLOBAL_REGEX = new RegExp(/\s+/, 'g');

NO_SPACE_REGEX = new RegExp(/\S/);

STARTS_WITH_CALL_REGEX = new RegExp(/^call/, 'i');
