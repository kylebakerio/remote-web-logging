// utils:
const redis = require("redis");
const herokuVarA = process.env.REDISCLOUD_URL;
const herokuVarB = process.env.REDIS_URL; // seems to be the wrong one, don't recall where I found it, doesn't hurt to leave it in as a plan b in case it is different in a different environment for some reason
console.log('heroku prod available?', herokuVarA, herokuVarB);

const hardcodeDEV = null;
const hardcodePROD = null;
const useRedisAddr = hardcodeDEV || herokuVarA || herokuVarB || hardcodePROD 
console.log('redis addr:', useRedisAddr)
if (hardcodeDEV) console.log("#\n#\nUSING DEV, NOT PROD, REDIS\n#\n#")
else console.log("#\n#\nUSING PROD REDIS\n#\n#")

const client = redis.createClient( useRedisAddr );
client.on("error", function(error) {
  console.error(error);
});


/*
Node Redis currently doesn't natively support promises (this is coming in v4), however you can wrap the methods you want to use with promises using the built-in Node.js util.promisify method on Node.js >= v8;

const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);

getAsync.then(console.log).catch(console.error);
*/

// command can be a string that is any valid redis command, e.g. 'get'
const { promisify } = require("util");

function redisAsync (command) {
	return promisify(client[command]).bind(client);
};

console.log('redis addr:', process.env.REDISCLOUD_URL || process.env.REDIS_URL || "WILL USE HARDCODED");


// const currentDeadline = require('./time-utils.js').currentDeadline;

// example usage:
// (async function() {
//	await rUtils.redisAsync('set')('keyA', 'valB')
//	rUtils.redisAsync('get')('keyB').then(console.log)
// })()



// client.monitor(function(err, res) {
//   console.log("Entering monitoring mode.");
// });


// client.on("monitor", function(time, args, rawReply) {
//   console.log(time + ": " + args); // 1458910076.446514:['set', 'foo', 'bar']
// });





module.exports = {
	redis,
	client,
	useLocalLocationServer: true,
	redisAsync: function (command) {
		// command can be a string that is any valid redis command, e.g. 'get'
		return promisify(client[command]).bind(client);
	},


}
