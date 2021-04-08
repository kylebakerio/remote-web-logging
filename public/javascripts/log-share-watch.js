
if (!socket) {
	var socket = io('https://log-share.herokuapp.com/');
	var storedConsole = {
		log: console.log,
		warn: console.warn,
		error: console.error,
	};
}
else {
	console.warn("won't declare socket/storedConsole a second time")
}


socket.on('sharedConsole', function(msg) {
	msg = JSON.parse(msg)
	console.info("sharedConsole", msg)
	// return

	// var item = document.createElement('li');
	// item.textContent = msg;
	// messages.appendChild(item);
	// window.scrollTo(0, document.body.scrollHeight);

	// storedConsole.log(msg)

	console.group('received ' + msg.method)
	storedConsole[msg.method](...(msg.args))
	storedConsole[msg.method](msg.trace/*.split('\n').slice(2).join('\n')*/)
	// slice off first two because top level says 'Error' which is because we're using Error().stack, and second one says line of the socket emit call itself. 
	// After that, we get to the actual console method call's end
	console.groupEnd(msg.method)
});
