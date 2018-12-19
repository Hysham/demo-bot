/**
 * Created by hysham on 12/18/2018.
 */
module.exports.process_message = (output)=>{

    let message=[]

    if (output.hasOwnProperty('generic') && output.generic.length != 0) {


        for (var j = 0; j < output.generic.length; j++) {

            let responses = output.generic[j];
            let title;

            //display text outputs
            if (responses.hasOwnProperty('text')) {
                message.push({type: 'text', message: responses.text});


            }

            //display options-rich response
            if (responses.hasOwnProperty('title')) {
                title = responses.title;
                // message += ( responses.title);

            }
            if (responses.hasOwnProperty('options')) {
                
                if (responses.options.length != 0) {
                    var btn = {
                        'type':'template',
                        'payload':{
                            'template_type':'button',
                            'text':title,
                            'buttons':[]
                        }
                    };
                    var attachment = {
                        "text": title,
                        "quick_replies":
                        [
                            
                        ]
                        }

                    for (var i = 0; i < responses.options.length; i++) {


                        let btnText = responses.options[i].label,
                            btnPostback = responses.options[i].value.input.text;
                            attachment['quick_replies'].push({
                                "content_type": "text",
                                "title": btnText,
                                "payload": btnPostback
                            });

                    }

                }

                message.push({type: 'button', message: attachment});
            }

        }


    }

    return message;
}