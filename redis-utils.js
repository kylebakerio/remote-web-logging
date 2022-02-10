// utils:
const redis = require("redis");
const herokuVarA = process.env.REDISCLOUD_URL;
const herokuVarB = process.env.REDIS_URL; // seems to be the wrong one, don't recall where I found it, doesn't hurt to leave it in as a plan b in case it is different in a different environment for some reason
console.log('heroku prod available?', herokuVarA, herokuVarB);

const hardcodeDEV =  /*null */ `redis://default:YhNRHi1cPwcwcSAJ5lzdqXFrFymB6SSD@redis-19848.c82.us-east-1-2.ec2.cloud.redislabs.com:19848`;
const hardcodePROD = `redis://default:w5QGxd52H95u4rN4NwbZ6WNHuunjuZny@redis-10191.c246.us-east-1-4.ec2.cloud.redislabs.com:10191`;
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

	// poolToCurrentScorepool: function(pool) {
	// 	// pool might be 'homePool'
	// 	return `${pool}_${currentDeadline()}`;
	// },

	// emailAndDisplaynameToRankName: function(email, displayName) {
	// 	return `${email}:${displayName}`;
	// },

	// rankNameToDisplayName: function (rankName) {
	// 	return rankName.split(":")[1]; // strip email off, leaving only display name
	// },

	// getTop10: async function (pool) {
	// 	//  expected use:
	// 	// 	const { rankedNames, leaderBoardWithScores } = await getTop10(pool);
	// 	const rankNameToDisplayName = this.rankNameToDisplayName;

	// 	let leaderBoard = await redisAsync('zrange')(pool,-10,-1,'withscores'); // this only gets names and ranks, not scores

	// 	return leaderBoard.reduce((m,v,i,arr) => {
	// 			// "withscores" from redis gives us an array with alternating name/score
	// 			// here we turn that into an array with the names ranked in order,
	// 			// and a second array of objects in order that contain both name and score (to send to client)
	// 			if (!(i % 2)) {
	// 				// odd, name
	// 				const name = rankNameToDisplayName(v);
	// 				m.rankedNames.push(v); // rankedNames has full rankNames
	// 				m.leaderBoardWithScores.push({name}); // leaderBoardWithScores has client-suitable displayNames only
	// 			} else {
	// 				// even, score
	// 				m.leaderBoardWithScores[m.leaderBoardWithScores.length -1].score = v;
	// 			}
	// 			return m;
	// 		},
	// 		{ rankedNames:[], leaderBoardWithScores:[] }
	// 	);
	// 	// returns object with two versions of leaderboard -- with and without scores
	// },

	// isInRankedNames: function (rankedNames, email) {
	// 	// rankedNames is the value seen in getTop10
	// 	return rankedNames.some(emailAndDisplayname => emailAndDisplayname.includes(email));
	// },

	// overwriteDisplayName: function (rankedNames, leaderBoardWithScores, email, newDisplayName) {
	// 	// rankedNames and leaderBoardWithScores are arrays returned from this.getTop10()
	// 	rankedNames.map(emailAndDisplayname => {
	// 		if (emailAndDisplayname.includes(email)) {
	// 			return this.emailAndDisplaynameToRankName(email,newDisplayName);
	// 		}
	// 		else {
	// 			return emailAndDisplayname;
	// 		}
	// 	});
	// 	// leaderBoardWithScores.map()
	// },

	// addUsersRank: async function(leaderBoardWithScores, rankName, pool) {
	// 	// WARNING: NOT PURE, MODIFIES GIVEN ARGUMENT leadBoardWithScores!
	// 	// takes in a leaderBoardWithScores from getTop10, returns it with user's rank/score appended
	// 	let userRank = await redisAsync('zrevrank')(pool,rankName);
	// 	let userScore = await redisAsync('zscore')(pool,rankName);

	// 	const rankNameToDisplayName = this.rankNameToDisplayName;

	// 	const userRankObj = {
	// 		name: rankNameToDisplayName(rankName),
	// 		rank: userRank, // only 11th item, which is user, has this
	// 		score: userScore,
	// 	};
	// 	console.log("will unshift ",userRankObj)
	// 	leaderBoardWithScores.unshift(userRankObj);
	// 	console.log("after unshift:", leaderBoardWithScores);
	// 	return leaderBoardWithScores;
	// }

}
