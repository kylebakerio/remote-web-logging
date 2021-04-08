
// var form = document.getElementById('form');
// var input = document.getElementById('input');

// form.addEventListener('submit', function(e) {
	// e.preventDefault();
	// if (input.value) {
	//   console.log("hi")
	//   socket.emit('chat message', input.value);
	//   input.value = '';
	// }
// });
	

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

// manual calls to console.error() don't trigger an Error() object with a trace, so we handle those like logs and warnings
// however, real errors do, and if we don't grab their trace, we'll lose it.
const realErrorHandler = (message, trace) => {
	socket.emit('console', JSON.stringify({ method:'error', args:["-" /*message*/ /* we leave this empty, because it's included in the complete trace */], trace: (trace || getStack()) }));

	return
	storedConsole.error(trace) // contains the message as well
}

const getStack = () => {
	// remove the wrapper when we generate a stack
	return Error().stack.split('\n').slice(2).join('\n');
}

Object.keys(storedConsole).forEach(key => {
	storedConsole[key] = console[key];
	window.console[key] = function(...args) {

	if (args[0].message && args[0].stack && !args[1]) {
		console.info("got a caught error item")
		realErrorHandler(args[0].message, args[0].stack)
		return;
	}

	let payload = { method:key, args, trace: getStack() };
	try {
		JSON.stringify(payload);
	} catch (e) {
		console.error(e);
		payload = { method:payload.method, args:["!!!! circular args, could not stringify to JSON, had to throw away."] trace: payload.trace }
	}
	socket.emit('console', payload);
		storedConsole[key](...args)
	}
})


// this seems to just overlap with addEventListener("error")
// window.onerror = function (message, file, line, col, error) {
//    // alert("Error occurred: " + error.message);
//    debugger
//    // console.error(...arguments)
//    console.error(message)
//    return false;
// };

// window.onerror = console.debug

window.addEventListener("error", function (e) {
   // alert("Error occurred: " + e.error.message);
   console.info('will send intercepted error')
   // console.error(e.message)
   realErrorHandler(e.message, e.error.stack)
   return false;
});

window.addEventListener('unhandledrejection', function (e) {
  	// alert("Error occurred: " + e.reason.message);
	console.info('will send intercepted unhandled promise rejection')
	// console.error(e.reason.message, e.reason.stack)
	realErrorHandler(e.reason.message, e.reason.stack)
	return false;
});


// Note: You can catch programmer-generated and runtime exceptions, but you can’t catch JavaScript syntax errors.
// ...sort of?

// let x;
// try {
// 	eval('hoo bar');
// 	// (() => {})()
// } catch(e) {
// 	console.error(e)
// }

// throw new SyntaxError('Hello', 'someFile.js', 10);
// console.log(1, 2, 3);
// (new Promise(() => { throw new Error('promise failing')}))//.catch(console.warn)