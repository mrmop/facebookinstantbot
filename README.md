# facebookinstantbot
##Facebook Instant Games Bot

Facebook bots server which handle multiple games using a single Redis database

bot.js - The main bot which accepts requests and creates new players
bot_none_cluster.js - None cluster version of bot.js (can be used with pm2 -i option)
crawler - Crawls through the database checking for players that need to be messaged and messaged them, also removes players that do not respond from the database
messaging.js - Sends messages out to players
pages.js - Stores page data

#Usage:
node bot.js - Runs the bot which listens for connections and adds players to hte database
node crawler.js - Periodically crawls through thre database finding players that need to be messaged and sends them a message

Created and provided by Mat Hopwood ay http://www.drmop.com
