

jQuery.key = function(user_id){

  return  $key =  (user_id + 0.1003) * -1;
    
}


/*
This function connect to the server side. 
It receives in input the address of the server.

*/
jQuery.connect = function(address){


  
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
 
    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
       var mess = 'Your browser doesn\'t support WebSocket, please update it.';
      
        return mess;
    }
    // open connection
    connection = new WebSocket(address);
    
	connection.onopen = function apri(){


}; 

}


/*
This function send to the server the new user connected. The new user will be identified, on the server - side, by the parameter user_id, so you have to use 
'user_id' value to refer to a specific user. 

user_id : identificator of the client on the server side. 
contact_list: array of others client whereby will be connect. The array have to contain the serer-side idintificator of the others client, that is user_id of that client.

*/

jQuery.addUser = function(user_id, contact_list){


	//var chiave = String(<?php calcolachiave(); ?>);
   var key = $.key(user_id);
    var datastring = 'user_id='+user_id;
     var contact_list = new Array();

 
        var hold = { 
            type: 'add_user',
            utente: user_id,
            chiave:key,
            amici: contact_list

        }; 
         
        connection.send(JSON.stringify(hold));

}

/*
this function send a notification to the server. 
The user had to pass the html code that he want display on the other client side that receive this notification.

html: html code that he want display on the other client side that receive this notification.

receivers_list: list of user_id* which will receive the notification. 


*Be careful: id_user means the server-side identificator used to connect the user to the server.

*/
jQuery.sendNotification = function(html, receivers_list ){



var structure = {
        
        type: 'notification',
        html: html,        
        receivers: receivers_list


};

 connection.send(JSON.stringify(structure));



}



/*

Function that send the type event. 

autore: server-side identificator of who is typing.
destinatario: server-side identificator of who will receive the typing.
event: it can assume two value "typing" or "no_typing". "no_typing" means the the user stop to typing.



*/


jQuery.typing = function(author, receiver, event){

var key = $.key(author);
        
                
        var struct = {
                                 type: event,
                                 autore: author,
                                 chiave:key,
                                 destinatario: receiver
                                

                         };
        
        
                         connection.send(JSON.stringify(struct));

                      
}


/*

Function that send to other a textual message.

autore: server-side identificator of who is typing.
receiver: server-side identificator of who will receive the typing.
text: text that you want to send


*/

jQuery.sendMess = function(author, receiver, text){

var key = $.key(author);
       
           
                         var messaggio = {
                                 type:'testo',
                                 autore: author,
                                 chiave:key,
                                 destinatario: receiver,
                                 testo: text

                         };
                          
                         connection.send(JSON.stringify(messaggio));
                        
                        }
                }













