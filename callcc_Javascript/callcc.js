
function callcc(f) {
	var k = new Continuation();
	return f(k);
};
// Codi primera prova
var x;
var continuation;
x = callcc(function(cc){
	continuation = cc;
	return false;
});
if (!x) {
	continuation(true);
}
print(x);

//Codi segona prova whileTrue
var continuation = callcc(function(cc) {
	return cc;
});
var randomNumber;
var returnsBooleanFunction = function() {
	randomNumber = Math.floor(Math.random()*100);
	return (randomNumber > 10);
};
var whileTrue = function(returnsBooleanFunction){
	if (returnsBooleanFunction()) {
		print('The random number is '+randomNumber+' not less than 10...');
		continuation(continuation);
	}
	else {
		print('LOOP EXITED: The number is '+randomNumber+' less than 10.');
		return null;
	}
};
whileTrue(returnsBooleanFunction);
