
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

socket.on('db', function(msg) {
	storedConsole.error('SESSION DB')
	const importText = 'importdb_'+msg;
	storedConsole.log(importText)
  	window.customRender(importText);

  	// attempt to add to clipboard, weird api, didn't finish figuring it out
	navigator.permissions.query({name: "clipboard-write"}).then(result => {
	  if (result.state == "granted" || result.state == "prompt") {
	  	Cliipboard.writeText(importText)
	    /* write to the clipboard now */
	  }
	});
})

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
		let argToStringify = "";
		if (typeof msg.args[0] === "string") {
			argToStringify += msg.args[0] + " "
		}
		if (typeof msg.args[1] === "string") {
			argToStringify += msg.args[1]
		}
		if (!argToStringify) {
			argToStringify += "(args empty)"
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
