app.service('$editorService', editorService);

function editorService () {
    let self = this;

    self.getEditorContent = function (selectedComponent, val) {
        let result;
        if(selectedComponent !== null){
            selectedComponent._id === val._id ?
                result = val.content :
                result = selectedComponent.content
        }
        else {
            result = '';
        }

        return result;
    }

    self.deleteEditorContent = function (selectedComponent, val) {
        return (selectedComponent !== null && selectedComponent._id === val._id) ?
            '' : selectedComponent.content;
    }
}
