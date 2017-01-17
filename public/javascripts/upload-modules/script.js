app.controller('upload_ctrl', function ($scope) {
	$scope.applicationName = 'Sanitize Uploader';
});


let dropzone = document.getElementById('dropzone');
let errorNode = document.getElementById('error-message');

errorNode.visibility = 'hidden';

dropzone.addEventListener('dragstart', function (event) {
	event.preventDefault();
});

dropzone.addEventListener('dragover', function (event) {
	event.preventDefault();
});

dropzone.addEventListener('drop', function (event) {
	event.preventDefault();
	console.log(event.dataTransfer.files);
	let droppedFiles = event.dataTransfer.files;

	if(droppedFiles.length === 0){
		errorNode.innerHTML = 'Dropped item is not a file';
		errorNode.visibility = 'visible';
	}
	else if(droppedFiles.length > 1){
		errorNode.innerHTML = 'Only one file can be dropped';
		errorNode.visibility = 'visible';
	}
	else if(droppedFiles[0].type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
		errorNode.innerHTML = 'Dropped file is not a excel type';
		errorNode.visibility = 'visible';
	}
	else {
		let form = document.getElementById('uploader');
		form['file'] = event.dataTransfer.files[0];
		form.submit();
	}
});

