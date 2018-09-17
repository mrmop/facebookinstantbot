var pages = require("./pages.js");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
var redis = require("redis");

var red = redis.createClient();
red.on("error", (err) =>
{
});

app.set("port", (process.env.PORT || 8000));
app.use(bodyParser.json());
app.use(cors());

app.listen(app.get("port"), function()
{
});

app.get("/bot", function(request, response)
{
	if (request.query["hub.mode"] === "subscribe" && request.query["hub.verify_token"] === pages.GetVertifyToken())
	{
		response.status(200).send(request.query["hub.challenge"]);
	}
	else
	{
		response.sendStatus(403);          
	}  
});

app.post("/bot", function(request, response)
{
	var data = request.body;
	if (data.object === "page" && data.entry !== undefined)
	{
		data.entry.forEach(function(entry)
		{
			if (entry.messaging !== undefined)
			{
				var page_id = entry.id;
				entry.messaging.forEach(function(event)
				{
					if (event.message)
					{
						HandleMessage(event);
					}
					else if (event.game_play)
					{
						HandleGameplay(event, pages.GetGame(page_id));
					}
					else
					{
						// console.log("Webhook received unknown event: ", event);
					}
				});
			}
		});
	}
	response.sendStatus(200);
});

function HandleMessage(event)
{
}

function HandleGameplay(event, game)
{
	var sender_id = event.sender.id; 
	var player_id = event.game_play.player_id; 
	var context_id = event.game_play.context_id;

/*	if (event.game_play.payload)
	{
		//
		// The variable payload here contains data set by
		// FBInstant.setSessionData()
		//
		var payload = JSON.parse(event.game_play.payload);
	}*/

	AddPlayer(sender_id, player_id, context_id, game);
}

function AddPlayer(sender_id, player_id, context_id, game)
{
	var now = Date.now();
	var key = game.key + ":" + player_id;

	red.exists(key, function(err, exists)
	{
		if (!exists)
		{
			// Player does not exist so add them
			// pid - Page scoped player id
			// cid - Context ID
			// tsm - Total sent messages since player last played
			// lt - Last time a message was sent (resets each timea message is sent or the player plays the game)
			if (context_id !== undefined)
				red.hmset(key, "pid", sender_id, "cid", context_id, "tsm", "0", "lt", now);
			else
				red.hmset(key, "pid", sender_id, "tsm", "0", "lt", now);
		}
		else
		{
			// Player has come back so reset send
			red.hmset(key, "tsm", "0", "lt", now);
		}
	});
}


