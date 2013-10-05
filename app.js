var express = require('express');
var http = require('http');
var path = require('path');

var index_route = require('./routes/index');
var rpc_route = require('./routes/rpc');
var mouse = require("./mouse");

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('kedavra'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


app.get('/', index_route);
app.get('/rpc', rpc_route);


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

// Initialize mouse module (get access to X11).
mouse.init();

