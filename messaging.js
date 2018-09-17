var pages = require("./pages.js");
var request = require("request");

//
// Send bot message
//
// sender_id (string) : Page-scoped ID of the message recipient
// context_id (string): FBInstant context ID. Opens the bot message in a specific context
// page (object): Page that the player belongs to
// 
function BuildAndSendMessage(sender_id, context_id, page)
{
	var button =
	{
		type: "game_play",
		title: page.cta
	};

	if (context_id)
		button.game_metadata = { context_id: context_id };
	
	if (page.payload)
		button.payload = JSON.stringify(page.payload)

	var messageData =
	{
		recipient: {
			id: sender_id
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "generic",
					elements: [
						{
							title: page.title,
							subtitle: page.subtitle,
							image_url: page.imageurl,
							buttons: [button]
						}
					]
				}
			}
		}
	};

	CallSendAPI(messageData, page.pat);
}

function CallSendAPI(messageData, pat)
{
	var graphApiUrl = "https://graph.facebook.com/me/messages?access_token=" + pat;
	request({
		url: graphApiUrl,
		method: "POST",
		json: true,  
		body: messageData
	}, function (error, response, body){
		console.log("send api returned", "error", error, "status code", response.statusCode, "body", body);
	});
}

function MessagePlayer(key, obj, tsm, days)
{
	var prms = key.split(":");
	var game_index = prms[0] | 0;
	var player_id = prms[1];

	//console.log("Sending message to " + game_index + " - " + player_id + ", tsm = " + tsm + ", days = " + days);

	BuildAndSendMessage(obj.pid, obj.cid, pages.GetPage(game_index));	
}

module.exports = 
{
	MessagePlayer,
};
