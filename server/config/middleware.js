var morgan = require('morgan'); // used for logging incoming request
var bodyParser = require('body-parser');
var helpers = require('./helper.js');


module.exports = function (app, express) {
  var userRouter = express.Router();

  // unused at the moment
  // var linkRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));


  app.use('/api/users', userRouter); // use user router for all user request

  // authentication middleware used to decode token and made available on the request
  //app.use('/api/links', helpers.decode);
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  require('../models/users/userRoutes.js')(userRouter);
  // inject our routers into their respective route files
};
