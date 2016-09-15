var a = ['hello', 'world', 'new', 'new2', 'new 3'];
var rem = ['world', 'new', 'new 3'];

function remove () {
	rem.forEach(function (val) {
		if((x = a.indexOf(val)) > -1) {
			a.splice(x, 1);
		}
	});
	console.log(a);
}

remove();