const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const bodyParser = require('body-parser');
//const run = require('./bin/start').run;

const index = require('./routes');
const app = express();
//run();

// view engine setup
app.use(bodyParser.json({limit:'256mb'}));

app.use(bodyParser.urlencoded({limit:'256mb', extended: true, parameterLimit:50000}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use("/health", function (req, res, next) {
  res.send(200);
});


//미들웨어
app.use('/v1', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log('error msg : ',err.message);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);
  res.status(err.status || 500).send({status : "error", message: '', code:err.status || 500});
});

module.exports = app;
