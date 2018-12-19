//Note: middleware.before used to update the context and send the payload to watson.
//this is for botkit-middleware-watson": "1.3.0" less than 1.4 versions.
/**
 * Created by hysham on 12/18/2018.
 */
import {watson_middleware,mongoURI} from '../../config/config';
const mongoose = require('mongoose');
var User = require('../../user/User');
var message_processor = require('./message_processor')
var middleware = require('botkit-middleware-watson')(watson_middleware);
mongoose.connect(mongoURI);
let command=''

export function mediate(bot, message,c, callback) {
   
    command = c;
    User.findOne({user_id:message.user}) .exec(function (err, user) {
        if (err) throw err;

        if (user != null) {
            //console.log('user',user)
        }else{
            let user = new User({
                user_id:message.user,
                timestamp:message.timestamp
            });

            user.save(function (err) {
                if (err) throw err;
                console.log('User successfully saved.');
            })
        }
    })
    
    //console.log('user is::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::',u);
    console.log('send to watson:::',message);
    middleware.interpret(bot, message, function (err) {
        console.log('reply from watson:::',message);
        if (!err) {
            command=''
            let mess = [];
            let out = {};
            if (message.watsonData) {
                if (message.watsonData.output) {
                    //console.log('output is::::::::',message);
                    
                    out = message.watsonData.output;
                    let message_elements=message_processor.process_message(out);
                    message_elements.forEach(message_element=> mess.push(message_element));

                
                    mess.forEach(m=>{
                        console.log(m);
                        bot.reply(message, m.message);
                    })

                    if (message.watsonData.hasOwnProperty('actions')) {


                        if (message.watsonData.actions.length != 0) {
                            let x = message.watsonData.actions.length===undefined?0:message.watsonData.actions.length;
                            for (var i = 0; i < x; i++) {
                                switch (message.watsonData.actions[i].name) {
                                    case 'check_user':
                                        console.log('inside actions::::::::::::::::::::::::::::::::::::::');
                                        command = 'check_user'
                                        mediate(bot,message,command,callback);
                                        break;
                                    case 'save_nic_phone':
                                      let params =  message.watsonData.actions[i].parameters;
                                      User.findOne({user_id:message.user}) .exec(function (err, user) {
                                        User.findByIdAndUpdate(user._id,{nic:params['nic'],phone:params['phone']},(err,usr)=>{
                
                                            if(usr){
                                                console.log('upated::::::::::::::::',usr)
                                            }
                
                                          })
                                      })
                                      message.text='next';
                                      mediate(bot, message,callback);
                                      break;
                                }
                            }
                        }
                    } 

                   
                }
                
            }  
             
           
        }
        else {            
            bot.reply(message, "I'm sorry, but for technical reasons I can't respond to your message");
        }
    });
    
}
middleware.before = function(message, assistantPayload, callb) {
    // Code here gets executed before making the call to Assistant.
    //console.log('before send to watson',assistantPayload);
    if(command==='check_user'){
        let res = {}
        let customizedPayload = {}
            User.findOne({user_id:message.user}) .exec(function (err, user) {
            if (err) throw err;
                res = {success:false}
            if(user.nic&&user.phone){
                res = {success:true}
            }
            customizedPayload.input={text:'result'}
            customizedPayload.workspace_id = assistantPayload.workspace_id;
            customizedPayload.context = assistantPayload.context;
            customizedPayload.context.result = res;
            console.log('before send to watson1',customizedPayload); 
            callb(null, customizedPayload); 
        })  
        
        
    }else{
        console.log('before send to watson2',assistantPayload);
        callb(null, assistantPayload);
    }
    
    
}  

 
