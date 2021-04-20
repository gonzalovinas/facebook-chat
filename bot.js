const login = require("./facebook-chat-api/index.js");
const obj = {email: "gonzalo.vinas@gmail.com", password: "."};








// https://github.com/Schmavery/facebook-chat-api/issues/794

var chatStates = {};

login(obj, (err, api) => {

    if(err) {

        switch (err.error) {

            case 'login-approval':
    
                console.log('Enter code > ');
    
                rl.on('line', (line) => {
                    err.continue(line);
                    rl.close();
                });

                break;

            default:

                console.error(err);

        }

        return;

    }
    else {
        
        api.listenMqtt((err, message) => {
            if(message.type==="message") {
                if(message.body.toLowerCase() === "¿esta disponible?") {
                    chatStates[message.threadID] = 'next_msg_should_be_phone_number';
                    api.sendMessage("Necesitaria tu telefono de contacto para...", message.threadID);

                }
                else if(chatStates[message.threadID] == 'next_msg_should_be_phone_number') {
                    console.log(message.body);
                    api.sendMessage("Gracias, Slds. lo contactaremos a la brevedad", message.threadID);
                    chatStates[message.threadID] == 'phone_number_already_queried'
                }
            }
        });
    }
});
