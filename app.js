const stomp = require('@stomp/stompjs');
const axios = require('axios');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
var destination = '/topic/commands';


const stompConfig = new stomp.StompConfig();
  stompConfig.webSocketFactory = function () {return new WebSocket("ws://localhost:8081/stanalone-websocket");};
  //stompConfig.webSocketFactory= function () {return new SockJS("http://localhost:8081/stanalone-websocket");},
  stompConfig.heartbeatIncoming = 0;
  stompConfig.heartbeatOutgoing = 20000;
  stompConfig.reconnectDelay = 5000;
  stompConfig.stompVersions = 1.2;
  stompConfig.logRawCommunication = true;
  stompConfig.onConnect = function(data,headers) {
    console.log(data);
    console.log(headers);
  };
  stompConfig.onDisconnect = function(data,headers) {
    console.log(data);
    console.log(headers);
  };
  stompConfig.debug = function(data) {
     console.log(data);
  };

app.get('/run', function(req, res) {
    let query = req.query.queryStr;
    axios.post('http://127.0.0.1:8081/api/authenticate', { username: 'guest',password: 'guest123' })
    .then(function (response) {
      var bearerToken = 'Bearer ${token}';
      bearerToken = bearerToken.replace('${token}',response.data.token);
      console.log('Auth Token'+bearerToken);
      var client = new stomp.Client();
      stompConfig.connectHeaders = {'Authorization': bearerToken},
      client.configure(stompConfig);
      console.log(client);
      res.send(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
});

var server = app.listen(port,"127.0.0.1", function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("App listening at http://%s:%s", host, port)
})