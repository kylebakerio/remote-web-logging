
if (!socket) {
	var socket = location.hostname === "localhost" ? io() : io('https://log-share.herokuapp.com/');
}
else {
	console.warn("won't declare socket/storedConsole a second time")
}

storedConsole = {
	log: console.log,
	warn: console.warn,
	error: console.error,
	groupCollapsed: console.groupCollapsed,
	groupEnd: console.groupEnd,
};

socket.on('sharedConsole', function(msg) {
	msg = JSON.parse(msg)

	// console.info("sharedConsole", msg)
	// return

	// var item = document.createElement('li');
	// item.textContent = msg;
	// messages.appendChild(item);
	// window.scrollTo(0, document.body.scrollHeight);

	// storedConsole.log(msg)
	const isWarnOrError = msg.method === "warn" || msg.method === "error";
	if (isWarnOrError) storedConsole[msg.method](msg.method.toUpperCase(), msg.args[0])
	console.groupCollapsed(isWarnOrError ? "^" : msg.args[0])
	storedConsole[msg.method](...(msg.args))
	storedConsole[msg.method](msg.trace/*.split('\n').slice(2).join('\n')*/)
	// slice off first two because top level says 'Error' which is because we're using Error().stack, and second one says line of the socket emit call itself. 
	// After that, we get to the actual console method call's end
	console.groupEnd(msg.method)


	if (window.customRender) {
		let toString;
		let argToStringify;
		if (msg.args[0]) {
			argToStringify = msg.args[0]
		} else if (msg.args[1]) {
			argToStringify = msg.args[1]
		} else {
			argToStringify = "(args empty)"
		}
		try {
			toString = typeof argToStringify === "string" ? argToStringify : JSON.stringify(argToStringify);
		} catch (e) {
			toString = `!!! DROPPED ${msg.method.toUpperCase()}, can't make string`
			storedConsole.error(e)
		}
		window.customRender(toString)
	}
	
});
