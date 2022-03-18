const PROTO_PATH = __dirname + '/../../protos/card-services.proto'
const grpc = require('@grpc/grpc-js');

const async = require('async');
var fs = require('fs');
var parseArgs = require('minimist');
var path = require('path');
var _ = require('lodash');
const protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var cardService = grpc.loadPackageDefinition(packageDefinition).cardservice;
var client = new cardService.CardService('localhost:50051', grpc.credentials.createInsecure());

function runAddCard(callback) {
    const cardRequest = {
        firstName: 'Ipsem',
        lastName: 'Lorum',
        cardNumber: 4111111111111111,
        expirationDate: '11/99',
        cvv: 321
    }
    console.log(`Running AddCard on ${JSON.stringify(cardRequest)}\n`)
    var call = client.AddCard(cardRequest);
    call.on('data', function(cardResponse) {
        console.log(`CardResponse: ${JSON.stringify(cardResponse, null, 2)}`)
    });
    call.on('end', callback);
}

/**
 * Run all of the demos in order
 */
function main() {
    async.series([
        runAddCard,
    ]);
}

if (require.main === module) {
    main();
}