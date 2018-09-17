var VERIFY_TOKEN = "<Your custom verification code here>";
var PAGES = [
	// Add your pages here, change key for each one, I use numberical values starting at 0
	{
		id: "<Your page ID>",
		name: "<Game Name>",
		key: "0",
		title: "Don't forget your daily free coins",
		subtitle: "We miss you, come back and play",
		cta: "Play Now",
		imageurl: "<URL of image to show in message>",
		payload: null,
		pat: "<Enter tour Page Access Token here>",
	},
];

function GetGame(page_id)
{
	for (var t = 0; t < PAGES.length; t++)
	{
		if (page_id === PAGES[t].id)
			return PAGES[t];
	}
}

function GetPage(which)
{
	return PAGES[which];
}

function GetVertifyToken()
{
	return VERIFY_TOKEN;
}

module.exports = 
{
	GetGame,
	GetPage,
	GetVertifyToken,
};
