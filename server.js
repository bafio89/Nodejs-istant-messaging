

// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";
 
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';
 
// Port where we'll run the websocket server
var webSocketsServerPort = 1337;
 
// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
 
/**
 * Global variables
 */
// latest 100 messages
var history = [ ];
// list of currently connected clients (users)
var clients = [ ];
 


var utenti  = new Array();

var utenti_on = new Array() ;

var colleghi_on = [ ];

var index_ut_on = '';

var index_col_on = '';

var update_page = 0 ;

var history_mess = new Array();

var utenti_on_history = new Array();



 var bool = false;

/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
 

/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});
 
/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});
 
// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
 
    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin); 

    console.log("ID:"+connection);

    // we need to know client index to remove them on 'close' event
   // var index = utenti_on.push(connection) - 1;
    var utente = " ";

   var utente_iniziale;

   var key;

    var userName = false;
   
 
    console.log((new Date()) + ' Connection accepted.');
 
    // send back chat history
    if (history.length > 0) {
        connection.sendUTF(JSON.stringify( { type: 'history', data: history} ));
    }
 

    // user sent some message
    connection.on('message', function(message) {
      
            
            

                //console.log(message);
                var messaggio = JSON.parse(message.utf8Data);
                 
                 
                  

                 switch(messaggio.type){
                 
                    case "add_user":
                          
                          var amici_online = new Array();
                          var amici_online_id = new Array();
                          var amici_online_state = new Array();
                          var amici_online_matter_choosed = new Array();

                          var colleghi = new Array();

                          var matter = '';

                          matter = messaggio.matter;
                       //if(clients[messaggio.utente] == null){
                             
                              utente = messaggio.utente;

                              console.log("USER "+ utente);

                              utente_iniziale = messaggio.utente;
                              colleghi = messaggio.amici;
                              key = messaggio.chiave;
                             
                             
                            // if(in_array(utente,utenti_on_history)){

                              var presenza = 0;

                              
                              /*
                               ciclo che verifica se un utente è già presente all'interno della lista utenti[]. Se si significa che è stata aperta un'altra scheda. 


                              */
                              for(var i = 0; i < utenti.length; i++){
                    

                                  if(utenti[i].utente == utente){ 
                                      //utenti[i].scheda++;
                                  
                                      /*
                                       se l'utente è presente 'presenza' viene settato ad 1.
                                      */ 
                                      presenza = 1;

                                     // if(utenti[i].scheda > 0){
                                     
                                         // utenti[i].scheda++;
                                    
                                          
                                         /*
                                           controllo che 'update_page' sia settato a 0. In tal caso significa che l'utente ha aggiornato la scheda e ora si è riconnesso. 
                                         */
                                         if(utenti[i].update_page == 0){

                                              utenti[i].update_page = 1;

                                              console.log("BANANE "+ utenti[i].new_scheda[0].utente);
                                              utente =  utenti[i].new_scheda[0].utente;

                                               var new_name= {

                                                 type: 'new_name',
                                                 nome: utente
                                                 }; 
                                          
                                                  connection.sendUTF(JSON.stringify(new_name));
                                            }else{

                                              /*
                                              se l'utente non ha aggiornato la pagina vuol dire che ha aperto una nuova scheda.
                                              */

                                 //             console.log('PASSA 3');

                                                   /*il contatore del n. di schede dell'utente è incrementato.
                                                   */
                                                   utenti[i].scheda++;

                                                   var datatime = new Date();

                                                   /*
                                                   all'id utente viene concatenato ore,minuti e secondi. Per distinguere le differenti schede dello stesso utente.
                                                   */
                                                   utente = utente + 'n' + datatime.getHours() + datatime.getMinutes() + datatime.getSeconds();


                                                   /*
                                                   si  crea la struttura con il nuovo nome della scheda dell'utente
                                                   */
                                                   var new_name= {

                                                              type: 'new_name',
                                                              nome: utente
                                                        }; 
                                                    
                                                    /*
                                                    viene inviato il nuovo nome alla scheda degli utenti.
                                                    */
                                                    connection.sendUTF(JSON.stringify(new_name));

                                                     var new_user = {

                                                       utente: utente,
                                                       update_page: 1  //DA RIMUOVERE 

                                                     };

                                                     /*
                                                     la nuova scheda degli utenti viene aggiunta alla lista delle schede di quell'utente
                                                     */
                                                    utenti[i].new_scheda.push(new_user);

    

                                            }

                                          }
                                         } 

                                         
                                         /*for(var k = 0; k < utenti[i].new_scheda.length; k++){
                                            if(utenti[i].new_scheda[k].update_page == 0){
                                        

                                                console.log("CI siamo quasi");
                                                utenti[i].new_scheda[k].update_page = 1;                                 
                                                pres2 = 1; 
                                                utente =  utenti[i].new_scheda[k].utente;
                                            }
                                          }*/


                                         /* if(pres2 == 0){
                                     
                                              utenti[i].scheda++;


                                              utente = utente + 'n' + datatime.getHours() + datatime.getMinutes() + datatime.getSeconds();

                                             // utente = utente+ 'n' + utenti[i].scheda;
                                              
                                              var new_user = {

                                                       utente: utente,
                                                       update_page: 1

                                              };

                                    

                                              var json = JSON.stringify({ 
                                                       
                                                       type:'update_user', 
                                                       utenti: utente

                                              });

                                              for(var h = 0; h< utenti.length;h++ ){
                                                 for(var j = 0; j < utenti[h].new_scheda.length; j++){

                                                    clients[utenti[h].new_scheda[j].utente].sendUTF(json);
                                                  }                              
                                                  //clients[utenti_on[i]].sendUTF(json);
                                              }



                                              utenti[i].new_scheda.push(new_user);
                                     
                                     
                                     
                                          }*/

                        /*                  presenza = 1;
                                      
                                          for(var j = 0 ; j< utenti[i].new_scheda.length; j++){
                                             console.log("PERPLESSO" + utenti[i].new_scheda[j].utente);
                                          }

                                     
                                          var new_name= {

                                                 type: 'new_name',
                                                 nome: utente
                                          }; 
                                          
                                          connection.sendUTF(JSON.stringify(new_name));
                                      }

                                  }
                              }

*/
                              for(var i = 0; i< utenti.length;i++ ){
                                      
                                      if (in_array(utenti[i].utente, messaggio.amici) > -1){
                                       console.log("AGg amici");
                                       amici_online.push(utenti[i]);
                                       amici_online_id.push(utenti[i].utente);
                                       amici_online_state.push(utenti[i].state);
                                       amici_online_matter_choosed.push(utenti[i].matter);
                                       }
                                  }
                              
                              /*
                              se 'presenza' è rimasto uguale a 0 vuol dire che l'utente ha appena fatto il log in.
                              */
                              if(presenza == 0){
                                
                                    /*
                                    si prepara la struttura con cui memorizzare l'utente
                                    */
                                   var new_utente = {

                                          utente: utente,
                                          chiave:key,
                                          scheda: 1,
                                          new_scheda: new Array(),
                                          amici: colleghi,
                                          update_page: 1,
                                          state: 'free',
                                          matter: matter
                                     
                                   }; 

                                   /*
                                   si prepara la struttura per notificare agli altri utenti che il nuovo user è online
                                   */  
                                   var json = JSON.stringify({ 
                                             
                                              type:'update_user', 
                                              utenti: utente,
                                              matter: matter

                                   });
                                   
                                   var datatime = new Date();
                                    /*
                                       all'id utente viene concatenato ore,minuti e secondi. Per distinguere le differenti schede dello stesso utente.
                                    */
                                   utente = utente + datatime.getHours() + datatime.getMinutes() + datatime.getSeconds();
                                
                                   //utente = utente + "n1";

                                   /*
                                     si  crea la struttura con il nuovo nome della scheda dell'utente
                                   */
                                   var new_name= {

                                          type: 'new_name',
                                          nome: utente
                                    }; 
                                    
                                    connection.sendUTF(JSON.stringify(new_name));

                                   var new_user = {

                                          utente: utente,
                                          update_page: 1   //DA RIMUOVERE
                                    };

  // QUIQUI                        
                                   /*
                                   si invia la notifica che il nuovo utente è online agli altri colleghi
                                   */
                                 
                                 
                                   for(var i = 0; i< amici_online.length;i++ ){
                                      
                                         for(var j = 0; j < amici_online[i].new_scheda.length;j++){


                                   
                                            clients[amici_online[i].new_scheda[j].utente].sendUTF(json);
                                   
                                          } 
                                      }                             
                                      //clients[utenti_on[i]].sendUTF(json);
                                    
                                                                 

                                   
                                   /*
                                   si aggiunge una nuova scheda
                                   */ 
                                   new_utente.new_scheda.push(new_user);

                               //    console.log("NUOVO_UTE:" + new_utente.new_scheda);


                                   /*la struttura con le info dell'utente viene aggiunta alla lista degli utenti on_line*/
                                   utenti.push(new_utente);
                              }
                                 

                                 
                          /*    for(var i = 0 ; i < utenti_on_history.length; i++){

                                 if(utenti_on_history[i].utente == utente && utenti_on_history[i].new_scheda > 0){
                                 
                                 utente = utente+"n"+ utenti_on_history[i].new_scheda;
                                 utenti_on_history[i].new_scheda++;

                                 new_name= {

                                       type: 'new_name',
                                       nome: utente
                                 };
 

                                 connection.sendUTF(JSON.stringify(new_name));
                                 }

                              }*/
                              
                              /*
                              l'oggetto connessione viene associato ad una dizionario cui si accede con il rispettivo id.
                              */
                             clients[utente] = connection;



                             /*
                             la seguente porzione di codice gestisce i messaggi pendenti
                             */


                       //       for(var j=0 ; j < utenti_on_history.length; j++){
                       //         if(utenti_on_history[j].utente == utente){
                      //             utenti_on_history[j].update_page = 1;
                                   
                     //              console.log("PASSA DA QUI : e utetne = " + utenti_on_history[j].update_page);
                             for(var j =0; j < history_mess.length; j++){
console.log("VEDIAMOM " +history_mess[j].destinatario);
                                 // if(utente.search(history_mess[i].destinatario) != -1){
                                   //   console.log("VEDI 2");
                                      for(var i = 0; i< utenti.length; i++)
                                          if(utente.search(utenti[i].utente) != -1){
                                            console.log("VEDI 2");
                                            if(history_mess[j].destinatario.search(utenti[i].utente) != -1){
                                             console.log("VEDI 3 " + utenti[i].new_scheda[0].utente);

                                             history_mess[j].destinatario = utenti[i].new_scheda[utenti[i].new_scheda.length -1 ].utente;
                                             clients[utenti[i].new_scheda[utenti[i].new_scheda.length -1 ].utente].sendUTF(JSON.stringify(history_mess[j]));
                                          }
                                         }



                                     // clients[utente].sendUTF(JSON.stringify(history_mess[i]));
                                      console.log('INVIO EFFETTUATO');
                                      console.log(history_mess[i]);
                             //     } 
                              }
                       //         }
                        //      }

                       /*
                            fine della porzione di codice che gestisce i messaggi pendenti
                        */
                         
                          
                          
                             console.log("utenti on: " + utenti_on.length);
                        
                        /*  var json = JSON.stringify({ 
                                          type:'update_user', 
                                          utenti: utente

                                           });

                           for(var i = 0; i< utenti[i].length;i++ ){
                            for(var j = 0; j < utenti[i].new_scheda[j].length){

                             clients[utenti[i].new_scheda[j].utente].sendUTF(json);
                             }

                              
                              //clients[utenti_on[i]].sendUTF(json);
                              }
                           */
                          
                             /*
                             lista degli utenti già online
                             */
                             var info_utenti_on = {

                                       type:'utenti_connessi',
                                       utenti: amici_online_id,
                                       state_users: amici_online_state,
                                       matter_user: amici_online_matter_choosed
                              };                         
                              
                              for(k = 0; k < amici_online.length; k++){
                //                console.log("amici_online : " + amici_online[k]);
                              }


                              /*
                              si invia la lista degli utenti online*/
                              clients[utente].sendUTF(JSON.stringify(info_utenti_on));

                              var history_utente = {
                                
                                          utente: utente,
                                          update_page: 0
                                           
                              };
                            
                            
                             if( in_array(messaggio.utente,utenti_on) == -1 ){
                             
                                  utenti_on.push(messaggio.utente);
                                // utenti_on_history.push(history_utente);
                              }


                              var pres = 0;
                              
                              for(var j = 0 ; j < utenti_on_history.length; j++){
                                  
                                  if(utente == utenti_on_history[j].utente){
                                    
                                     pres = 1;
                               
                                  }
                              }

                              
                              if(pres == 0)
                                 utenti_on_history.push(history_utente);
                      /* } 
                        else
                          update_page = 1;*/

 
                          //    for(var j = 0 ; j < utenti.length; j++)
                        //          console.log("PALLE : " + utenti[j].utente);

                    
                    break;


                    case "testo":
                    
                               var dest = messaggio.destinatario;
                               console.log("E ARRIVAOT UN MESS");

                               var true_id = 0;

                           //    console.log('UTENTE_INIZIALE : ' + utente_iniziale);
                             //  console.log('CHIAVE: ' + key);
//console.log('MESS _ CHIAVE: ' + messaggio.chiave);

                               if(messaggio.chiave == key && messaggio.autore == utente_iniziale)
                                  true_id = 1;


                              if(true_id == 1){
                               for(var i =0; i< utenti.length; i++){
                                   console.log(messaggio);
                                                                      
                                    console.log("TTYYY :" + utenti[i].utente);
                                   console.log("UTTTTTT "+ messaggio.destinatario);

                                   if(utenti[i].utente == messaggio.destinatario ){
                                      console.log("UTENSSSSS "+utenti[i].new_scheda.length);
                                      for(var j = 0; j < utenti[i].new_scheda.length; j++){
                                      
                                       //   messaggio.destinatario = utenti[i].new_scheda[j].utente;

                                          var hold = {

                                                  type: "",
                                                  autore: "",
                                                  destinatario: "",
                                                  testo: "",
                                                  name: "",
                                                  surname: "",
                                          };
                                            

                                          hold.type = messaggio.type;
                                          hold.autore = messaggio.autore;
                                          hold.destinatario = utenti[i].new_scheda[j].utente;
                                          hold.testo = messaggio.testo;
                                          hold.name  = messaggio.name;
                                          hold.surname = messaggio.surname;
                                          hold.immagine= messaggio.immagine;
                                          hold.object  = messaggio.object;


                                          console.log(messaggio.destinatario + " Utente " + j);
                                          history_mess.push(hold);
                                          clients[utenti[i].new_scheda[j].utente].sendUTF(JSON.stringify(messaggio));
                                     
                                       
                                       
                                      }


                                      ;
                                    
                                    }else if( utente.search(utenti[i].utente) != -1){
                                     
                                             for(var k = 0; k< utenti[i].new_scheda.length; k++){
                                              
                                                if(utenti[i].new_scheda[k].utente != utente){

                                                   messaggio.destinatario = dest;
console.log("E STATO INVIATO UN MESS");
                                                   clients[utenti[i].new_scheda[k].utente].sendUTF(JSON.stringify(messaggio));
                                                }


                                              }

                                      }
                                }
                               }
                                for(var j = 0 ; j< history_mess.length; j++) {

                                  console.log("COMPOSIZIONE " + history_mess[j].destinatario);
                                }

                          break;


                    case 'typing':

                             var true_id = 0;

                               if(messaggio.chiave == key && messaggio.autore == utente_iniziale)
                                  true_id = 1;
                          

                          if(true_id){
                              console.log("TOYP");
                               for(var i =0; i< utenti.length; i++){
                   
                                   if(utenti[i].utente == messaggio.destinatario ){
                                       
                                      for(var j = 0; j < utenti[i].new_scheda.length; j++){  
                                             
                                           clients[utenti[i].new_scheda[j].utente].sendUTF(JSON.stringify(messaggio));
                                          console.log("INVIO " + utenti[i].utente + " j" + j + " i" + i );
                                      }
                                  //console.log(messaggio.autore + "STA SCRIVNEDO");
                                      break;
                                    }
                                }
                              }
                          break;

                    case 'no_typing':
                          

                               var true_id = 0;

                               if(messaggio.chiave == key && messaggio.autore == utente_iniziale)
                                  true_id = 1;

                              if(true_id == 1){
                               for(var i =0; i< utenti.length; i++){
                   
                                   if(utenti[i].utente == messaggio.destinatario ){
                                     
                                     for(var j = 0; j < utenti[i].new_scheda.length;j++){

                                        clients[utenti[i].new_scheda[j].utente].sendUTF(JSON.stringify(messaggio));

                                      }
                                       //console.log(messaggio.autore + "STA SCRIVNEDO");
                                      break;
                                    }
                                }
                              }
                          break;

                    case 'conferma':
                                      console.log("E ARRITAVA CONFERMA ");
                                 
                                 for(var i = 0; i< history_mess.length; i++){
                                      console.log("HISTORY UTETE " + history_mess[i].destinatario + " " + i);
                                       if(history_mess[i].autore == messaggio.autore && history_mess[i].destinatario == messaggio.destinatario && history_mess[i].testo == messaggio.testo){
                                           console.log("HISTORY " + history_mess[i].autore + " " + history_mess[i].destinatario+ " " +history_mess[i].testo);

                                           history_mess.splice(i,1);
                                           i--;
                                           console.log("history length " + history_mess.length);
                                        } 
                                 }

                                  console.log("LUNGHH : " +history_mess.length);

                               break; 

                    case 'conferma_nome':


                                utente = messaggio.nome;
                                
                                console.log("GGG : " + utente);
                              break;


                   case 'off_line':


                          var json = JSON.stringify({ 
                                             
                                              type:'off_line', 
                                              user: messaggio.uid

                                   });
                               

                               for(var i = 0; i< utenti.length;i++ ){
                                      for(var j = 0; j < utenti[i].new_scheda.length;j++){

                                           clients[utenti[i].new_scheda[j].utente].sendUTF(json);
                                   
                                      }                              
                                      //clients[utenti_on[i]].sendUTF(json);
                                    }

                   
                   break;


                   case 'on_line':

                           var json = JSON.stringify({ 
                                             
                                              type:'on_line', 
                                              utenti: messaggio.uid

                                });


                           for(var i = 0; i< utenti.length;i++ ){
                                      for(var j = 0; j < utenti[i].new_scheda.length;j++){

                                           clients[utenti[i].new_scheda[j].utente].sendUTF(json);
                                   
                                      }                              
                                      //clients[utenti_on[i]].sendUTF(json);
                                    }
                           

                   break; 


                   case 'notification':  
                          
                         console.log("notifica");
                          //variable used to hold the position of one of the receivers
                          var position = "";

                         //structure that will be send to the receiver
                         var notification = JSON.stringify({
                                              
                                             type: messaggio.type,                                             
                                             html: messaggio.html,
                                             typeNotification: messaggio.typeNotification,
                                             receivers: messaggio.receivers
                                             
                                             }); 
                   
                         //cicle to found user online that are also receivers
                         for(var i = 0; i < messaggio.receivers.length; i++){  
  
console.log("primo ciclo");
                            // position = in_array(messaggio.receivers[i], utenti_on); //RIVEDI
                              for(var k = 0 ; k < utenti.length; k++){
                                 
                                 if(messaggio.receivers[i] == utenti[k].utente){

                               
                               //if( position > -1){
                           console.log("trovato");                
                                   //cicle to send notification to each scheda of a single user.
                                   for(var j = 0; j < utenti[k].new_scheda.length; j++){
                           console.log("invio");         
                                    clients[utenti[k].new_scheda[j].utente].sendUTF(notification);


                                   }
                                   //position = -1;
                                }

                              }



                          
                            }




                   break;    

                   
                   case 'state':

console.log(" GIUNTO ");

var amici_online_state    = new Array();
var amici_online_state_id = new Array();

                        


                        for(var i = 0; i< utenti.length;i++ ){
                                      
                                    if (in_array(utenti[i].utente, messaggio.amici) > -1){
                                     
                                       amici_online_state.push(utenti[i]);
                                       amici_online_state_id.push(utenti[i].utente);
                                       }
                                    if(utente.search(utenti[i].utente) != -1 ){
console.log("wewewe" +message.state);
                                       utenti[i].state = messaggio.state;
                                    }
                                  }

/*il ciclo for viene fatto su amici_online_state piuttosto che su utenti[], come invece avviene nel caso add_user. Verificare quel caso quindi.*/
                        
                        for(var i = 0; i< amici_online_state.length;i++ ){
                                      
                                         for(var j = 0; j < amici_online_state[i].new_scheda.length;j++){


                                          console.log("inviato STATO " + amici_online_state[i].new_scheda[j].utente);

                                            clients[amici_online_state[i].new_scheda[j].utente].sendUTF(JSON.stringify(messaggio));
                                   
                                          } 
                                      }       
                                  


                   break;

                  case 'matter':
                           
                           var amici_online_matter    = new Array();
                           var amici_online_matter_id = new Array();

                        
                                        for(var i = 0; i< utenti.length;i++ ){
                                      
                                    if (in_array(utenti[i].utente, messaggio.amici) > -1){
                                     
                                       amici_online_matter.push(utenti[i]);
                                       amici_online_matter_id.push(utenti[i].utente);
                                       }
                                    if(utente.search(utenti[i].utente) != -1 ){
console.log("wewewe" +message.state);
                                       utenti[i].matter = messaggio.matter;
                                       
                                    }
                                  }

                             /*il ciclo for viene fatto su amici_online_state piuttosto che su utenti[], come invece avviene nel caso add_user. Verificare quel caso quindi.*/
                        
                        for(var i = 0; i< amici_online_matter.length;i++ ){
                                      
                                         for(var j = 0; j < amici_online_matter[i].new_scheda.length;j++){


                                          console.log("inviato STATO " + amici_online_matter[i].new_scheda[j].utente);

                                            clients[amici_online_matter[i].new_scheda[j].utente].sendUTF(JSON.stringify(messaggio));
                                   
                                          } 
                                      }       

                        
                  break; 

                  }
                 

           
        
    });
 
    // user disconnected
    connection.on('close', function(connection) {

       var hold = -1;
       var holdj = 0;
      
      
       //  while(bool){};
         bool = true;
         
               console.log('passa 0 ' + utente);

       for(var i = 0; i < utenti.length; i++ ){
          if( utente.search(utenti[i].utente) != -1){  //non inserire in utenti_on_history l'utente nuova scheda e qui fare il confronto parziale
         //utenti[i].scheda--;
             
             if(utenti[i].scheda == 1){  
             for(var j = 0; j < utenti[i].new_scheda.length; j++){
             
                if(utenti[i].new_scheda[j].utente == utente){

                   utenti[i].update_page = 0;
                   holdj = j;
                }

              }
               hold = i;
             //utenti[i].update_page = 0;
           }else{
                     
                     utenti[i].scheda--;

                for(var j = 0; j < utenti[i].new_scheda.length; j++){
             
                   if(utenti[i].new_scheda[j].utente == utente){
                     
                      utenti[i].new_scheda.splice(j,1);

                      delete clients[utente];

                      break;
                }
                }

           }
             
          }

        }

      

     
       if(hold != -1){
         
       setTimeout(function() {
      // Do something after 5 seconds
   for(var j = 0; j < utenti.length; j++ ){
     if( utente.search(utenti[j].utente) != -1){  //non inserire in utenti_on_history l'utente nuova scheda e qui fare il confronto parziale
       

       if(utenti[j].update_page == 0){

          console.log('passa 1 ');
            var utente_off = {

                    type: 'user_off',
                    user: utenti[j].utente
  
                };

               /*   for(var i =0; i< utenti.length; i++)
                      for(var h = 0; h< utenti[i].new_scheda.length; h++){
            
                         clients[utenti[i].new_scheda[h].utente].sendUTF(JSON.stringify(utente_off));
                      }
*/            

for (var s = 0; s < utenti[j].amici.length; s++) {
                       console.log("ELENCO AMICI " + utenti[j].amici[s]);
                     };                     
                    for(var i = 0; i < utenti.length; i ++){

                      console.log("PASSA 2" ) ; 

                      if (in_array(utenti[i].utente,  utenti[j].amici)  > -1){

                         console.log("PASSA 3" ) ; 
                        for(var h = 0; h< utenti[i].new_scheda.length; h++){
            
                         clients[utenti[i].new_scheda[h].utente].sendUTF(JSON.stringify(utente_off));
                        }             
                      }

                    }



                        for(var k = 0; k<utenti_on.length; k++){

                            if(utente.search(utenti_on[k]) != -1 ){

                               utenti_on.splice(k,1);
               
                            }
                        }

                        for(var i = 0; i < utenti.length;  i++){ //USA HOLD INVECE CHE RI-CICLARE

                           if(utente.search(utenti[i].utente) != -1)
                              utenti.splice(i,1);
           
            
                        }

             delete clients[utente];

       }
      
      }
    }

   
       //console.log("GIORGIO : " + utenti[hold].new_scheda[holdj].utente );
       
  /*    if(/*utenti[hold] != null &&*/ /*utenti[hold].new_scheda[holdj]!= null){
  /*      if( utenti[hold].new_scheda[holdj].update_page == 0){
    
  /*  for(var i = 0; i<utenti_on_history.length; i++){
      
       if(utenti_on_history[i].utente == utente){
       
         if( utenti_on_history[i].update_page == 0 ){*/

  /*         utenti[hold].scheda--;
          
          console.log("NUM SCHEDE " + utenti[hold].scheda);
           var ultimo = 1;

           var ind = 0;

           console.log("UTONTO  :" + utente);
       
           var utente_off = {

                  type: 'user_off',
                  user: utenti[hold].utente

            };


           if(utenti[hold].scheda == 0){  //OCCHIO

              for(var i =0; i< utenti.length; i++)
                  for(var h = 0; h< utenti[i].new_scheda.length; h++){
            
                      clients[utenti[i].new_scheda[h].utente].sendUTF(JSON.stringify(utente_off));
                  }
        
              console.log("PRIMA ON: "+ utenti_on);

              console.log("UTENTE: "+ utente);
        // remove user from the list of connected clients
        
              for(var k = 0; k<utenti_on.length; k++){

                  if(utente.search(utenti_on[k]) != -1 ){

                     utenti_on.splice(k,1);
               
                  }
              }

              for(var i = 0; i < utenti.length;  i++){

                  if(utente.search(utenti[i].utente) != -1)
                     utenti.splice(i,1);
           
            
              }


              //utenti_on_history.splice(i,1);
            }else{

                  ind = 1;
                  var re_index = -1;

                  var counter = 0;
                
                  for(var y = 0; y< utenti[hold].new_scheda.length; y++){
                    

                      console.log("YYYY valu: " + y);
                     
                      if(utenti[hold].new_scheda[y].utente == utente){
                       /*if(i == utenti[hold].new_scheda.length-1){

                         delete utenti[hold].new_scheda[i];
                       }else  */         
                       
  /*                        if(y < utenti[hold].new_scheda.length-1){
                             clients[utenti[hold].new_scheda[y].utente] =  clients[utenti[hold].new_scheda[y+1].utente];
                             ultimo = 0;
                             console.log ("PASSA da qui ARG :");
                             //clients[utente] =  clients[utenti[hold].new_scheda[y+1].utente];
                          }else
                             delete clients[utente];

                        
                          utenti[hold].new_scheda.splice(y,1);
                          re_index = y;
                      }

                      if(re_index != -1 && ultimo == 0){
                        
                         re_index++;
                         var re_index_1 = re_index +1;
                      // re_index.toString();
                         re_index_1.toString();

                         console.log("RE_INDEX "+re_index);
                      // utenti[hold].new_scheda[y].utente.replace(re_index_1, re_index);
                      //if(counter > 0){
                         if((y+1) < utenti[hold].new_scheda.length){
                             clients[utenti[hold].new_scheda[y].utente] =  clients[utenti[hold].new_scheda[y+1].utente];
                             console.log("PASSETTO: " + y);
                          }
                         else{
                               console.log("RRRRR : " +y);
                               delete clients[utenti[hold].new_scheda[y].utente];
                               ultimo = 1;

                            //delete utenti[hold].new_scheda[y];
                          }
                        //   }
                          utenti[hold].new_scheda[y].utente = utenti[hold].utente +"n"+ re_index;
                          utente = utenti[hold].utente +"n"+ re_index;
                          utenti[hold].new_scheda[y].update_page = 1;
                        
                          

                          var new_name= {

                                    type: 'new_name',
                                    nome: utenti[hold].new_scheda[y].utente
                          }; 


                          console.log("NUOVISSIMO " + utenti[hold].new_scheda[y].utente);
                          clients[utenti[hold].new_scheda[y].utente].sendUTF(JSON.stringify(new_name));
                       //re_index++;
                          counter = 1;
                      }
                  }

                //utenti_on_history.splice(i,1);

            }

    /*    for(var k = 0; k<colleghi_on.length; k++){

            if(colleghi_on[k] == utente)
               colleghi_on.splice(k,1);
        }.push
*/


        //colleghi_on.splice(index_col_on,1);

 /*       console.log("UTENTI_ON : " +utenti_on.user);
        console.log("COLL ONLINE:  "+colleghi_on);         

        if(ind == 0)
           delete clients[utente];
        
        console.log("CLIENTS:  "+ clients);

      /*}else{
       utenti_on_history[i].update_page = 0;
      
      }
     }
   }*/

  //}
 // bool = false;
  /*          }
          }else{              

               var utente_off = {

                  type: 'user_off',
                  user: utenti[hold].utente

            };


          //  if(utenti[hold].off_request == utenti[hold].scheda -1  ){

           
              for(var i =0; i< utenti.length; i++)
                  for(var h = 0; h< utenti[i].new_scheda.length; h++){
            
                      clients[utenti[i].new_scheda[h].utente].sendUTF(JSON.stringify(utente_off));
                  }

              for(var k = 0; k<utenti_on.length; k++){

                  if(utente.search(utenti_on[k]) != -1){

                     utenti_on.splice(k,1);
               
                  }
              }

              for(var i = 0; i < utenti.length;  i++){

                  if(utente.search(utenti[i].utente) != -1)
                     utenti.splice(i,1);
           
            
              }
                  delete clients[utente];

                //  bool = false;

         //   }
          }

          bool = false;         */
          }, 8000);
        }

    });
 
});

function in_array(valore_da_esaminare, array_di_riferimento) {
      for(var i = 0; i < array_di_riferimento.length; i++) {
         if(valore_da_esaminare == array_di_riferimento[i]) {
           return i;
         }
      }
    return -1;
    }