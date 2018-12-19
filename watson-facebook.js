/**
 * Created by hysham on 12/18/2018.
 */
var Botkit = require('botkit');
require('dotenv').load();
import {mediate} from './app/modules/mediator'

var controller = Botkit.facebookbot({
    debug: true, 
    log: true,
   
    access_token: process.env.FACEBOOK_PAGE_TOKEN,
    verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
    app_secret: process.env.FACEBOOK_APP_SECRET,
    validate_requests: true
});

var bot = controller.spawn({
});

controller.setupWebserver(process.env.port || 5000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
    });
});

controller.api.messenger_profile.greeting('Hello');
controller.api.messenger_profile.get_started('Hello');


controller.on('message_received', function (bot, message) {
    mediate(bot, message,'')
});


