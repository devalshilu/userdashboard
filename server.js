const restify = require('restify');
const bunyan = require('bunyan');
const rjwt = require('restify-jwt-community');
const jwt = require('jsonwebtoken');
const config = require('./config.json')
var fs = require('fs'); /* Put it where other modules included */
var data = JSON.parse(fs.readFileSync('./User.json', 'utf8')); /* Inside the get function */
//import * as assert from 'assert';

const port = process.env.PORT || 3000;

const logServer = bunyan.createLogger({
    name: 'log',
    level: 'debug',//'trace',
    stream: process.stdout
});

const server = restify.createServer({
    name: 'REST APIs',
    log: logServer,
    version: '1.0.0'
});

module.exports = server;


server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

//  RequestLogger
//server.use(restify.requestLogger());

/**
 * Request handling before routing.
 * Note that req.params will be undefined, as that's filled in after routing.
 */
server.pre(function (req, res, next) {
    const log = req.log;
    log.info(`${req.method.toUpperCase()} ${req.url}`);
    //log.debug({ headers: req.headers }, 'req.Headers:');
    next();
});

/**
 * To be executed on all routes.
 */
server.use(function (req, res, next) {
    const log = req.log;
    //log.debug( {params: req.params}, 'req.Params:' );
    next();
});


/**
 * Mapping static resources
 */
server.get('/', restify.serveStatic({
    directory: './client/build',
    file: 'index.html'
}));
server.get(/\/build\/?.*/, restify.serveStatic({
    directory: __dirname+'/client',
    default: 'index.html'
}));
server.get(/\/css\/?.*/, restify.serveStatic({
    directory: __dirname+'/client/build',
    default: 'index.html'
}));
server.get(/\/js\/?.*/, restify.serveStatic({
    directory: __dirname+'/client/build',
    default: 'index.html'
}));
server.get(/\/media\/?.*/, restify.serveStatic({
    directory: __dirname+'/client/build',
    default: 'index.html'
}));

/**
 * Applications handling
 */

server.use(rjwt(config.jwt).unless({
    path: ['/auth','/','/api/user/:name']
}));

server.get('/api/userName', (req, res, next) => {
    const log = req.log;   
    var data1= data.map(function (element) {
        return element.name;
    })
        res.send({status:200, data: data1 });     
});

server.get('/api/user/:name', (req, res, next) => {
    const log = req.log;
   var data1= data.find(function (element) {
        return element.name == req.params.name;
    })
        res.send({data:data1});
      
});

server.get('/auth', (req, res, next) => {
    const log = req.log;
     var data = {Data: "done"}
        // creating jsonwebtoken using the secret from config.json
        let token = jwt.sign(data, config.jwt.secret, {
            expiresIn: '2 days' // token expires in 2 days
        });
        // retrieve issue and expiration times
        let { iat, exp } = jwt.decode(token);
        res.send({ iat, exp, token });
    
}); 


server.listen(port, function () {
    logServer.info('%s listening at %s', server.name, server.url);
});
