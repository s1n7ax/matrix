APPLICATION_NAME = '';

VTAF_COMMANDS = [
    "Comment", "KeyPress", "GetObjectCount", "CheckDBResults", "SetDBResult", "CreateDBConnection", "Screenshot", "Fail", "Loop",
    "Else", "CheckChartContent", "If", "CheckPattern", "NavigateToURL", "Type", "DoubleClick", "Call", "SwitchUser", "ClickAt",
    "Click", "EditVariable", "CheckElementPresent", "GoBack", "Select", "Retrieve", "EndLoop", "MouseMoveAndClick", "SetVarProperty",
    "ElseIf", "DoubleClickAt", "CheckTextPresent", "SelectFrame", "WriteToReport", "HandlePopup", "EndIf", "SelectWindow", "FireEvent",
    "CheckTable", "CreateUser", "SetVariable", "Store", "StartComment", "Pause", "CheckObjectProperty", "MouseOver", "Open", "EndComment",
    "CheckDocument", "HandleImagePopup", "CheckImagePresent", "RightClick", "Break"
];

SEETEST_COMMANDS = [
	"Launch", "Tap", "Swipe", "Rotate", "PerformUserActions", "DragToElement", "CheckPattern", "ElementSwipe", "ElementDrag" ,"Landscape", 
    "Portrait", "Home", "Enter", "Wake", "Unlock", "BrowserBack", "Menu", "RecentApps", "Power", "CloseKeyboard", "Paste", "Backspace", "Back", "LongTap"];

	
CENTROID_COMMANDS = [
	"QueryDatabase", "ScreenShot", "CheckFileInfo", "CheckSorting", "CheckWindowProperty", "CallWebService", "OnParadigm", "EndOnParadigm", "Compare", "CheckPropertyValue", "ChangeContext", "ClearCache", "ResizeApplication", "DragToText", "ConnectDatabase", "CheckSameHeight", "CloseApplication", "ContinueApplication", "GetCurrentURL", "CheckSameWidth", "CheckSameXAxis", "CheckSameYAxis", "CheckSameBox", "SendFixMessage", "ReceiveFixMessage", "CallCommand", "LoadLibrary", "SetOCRText", "HideKeyboard", "EditDataContainer", "ReadDataContainer", "BrowseDataContainer", "SendEmail", "ResolveTemplate", "CommitThis", "AssignValue", "DragAndDrop", "Process", "ConnectSsh", "SendSshCommand", "Continue", "StoredProcedure", "MoveFile", "DeleteFile", "ImportExcel", "ExportExcel", "Trigger", "FieldOperation", "ActiveDirectory", "ArrayOperation", "WriteExcel", "WriteToExcel", "ReadExcel", "ReturnValue", "ReadPdf", "ReadWord", "WriteWord", "Zoom"
]


APPLICATION_COMMAND_LIST = VTAF_COMMANDS.concat(SEETEST_COMMANDS, CENTROID_COMMANDS);

STARTS_WITH_COMMAND_REGEX = getStartsWithCommandRegex();

CONTAINS_WHITE_SPACE_REGEX = new RegExp(/\s+/);

CONTAINS_WHITE_SPACE_GLOBAL_REGEX = new RegExp(/\s+/, 'g');

NO_SPACE_REGEX = new RegExp(/\S/);

STARTS_WITH_CALL_REGEX = new RegExp(/^call/, 'i');