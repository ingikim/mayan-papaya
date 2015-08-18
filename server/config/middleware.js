var morgan = require('morgan'); // used for logging incoming request
var bodyParser = require('body-parser');
var helpers = require('./helper.js'); // our custom middleware


module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var userRouter = express.Router();
  var triviaRouter = express.Router();
  var gameRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));


  app.use('/api/users', userRouter); // use user router for all user request
  app.use('/api/trivia', triviaRouter);
  app.use('/api/game', gameRouter);

  // authentication middleware used to decode token and made available on the request
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  require('../models/users/userRoutes.js')(userRouter);
  require('../models/trivia/triviaRoutes.js')(triviaRouter);
  require('../models/game/gameRoutes.js')(gameRouter);
  // inject our routers into their respective route files
};
