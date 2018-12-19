/**
 * Created by hysham on 12/18/2018.
 */
require('dotenv').load();
var Botkit = require('botkit');
import {mediate} from './app/modules/mediator'
import {fbConfig} from './config/config'


var controller = Botkit.facebookbot(fbConfig);

var bot = controller.spawn({
});

controller.setupWebserver(process.env.port || 8080, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
    });
});

controller.api.messenger_profile.greeting('Hello');
controller.api.messenger_profile.get_started('Hello');


controller.on('message_received', function (bot, message) {
    mediate(bot, message,'')
});


