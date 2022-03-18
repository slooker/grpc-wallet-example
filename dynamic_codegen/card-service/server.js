const PROTO_PATH = __dirname + '/../../protos/card-services.proto'
const grpc = require('@grpc/grpc-js');
const parseArgs = require('minimist');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

var protoLoader = require('@grpc/proto-loader');
// Suggested options for similarity to existing grpc.load behavior
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy
var cardService = protoDescriptor.cardservice;

const Server = new grpc.Server();

function AddCard(cardRequest) {
    console.log(cardRequest);
    const lastFour = `${cardRequest.cardNumber}`.slice(-4);
    return lastFour;
}

function getServer() {
    var server = new grpc.Server();
    server.addService(cardService.CardService, {
        addCard: AddCard
    });
    return server;
}

/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return {Server} The new server object
 */
 function getServer() {
    var server = new grpc.Server();
    server.addService(cardService.CardService.service, {
        addCard: AddCard
    });
    return server;
  }
  
  if (require.main === module) {
    // If this is run as a script, start a server on an unused port
    var routeServer = getServer();
    const serverBinding = '0.0.0.0:50051';
    routeServer.bindAsync(serverBinding, grpc.ServerCredentials.createInsecure(), () => {
        console.log(`Starting server on ${serverBinding}`);
        routeServer.start();
    });
  }
  
  exports.getServer = getServer;