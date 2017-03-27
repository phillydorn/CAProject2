import { Writable } from 'stream';
import raven from 'raven';
import bunyan from 'bunyan';
import bunyanExpressMiddleware from 'express-bunyan-logger';

import Express from 'express';
import path from 'path';
import Helmet from 'react-helmet';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { useRouterHistory, RouterContext, match } from 'react-router';

import { createMemoryHistory, useQueries } from 'history';
import compression from 'compression';
import Promise from 'bluebird';

import { Provider } from 'react-redux';

import favicon from 'serve-favicon';
import robots from 'robots.txt';

// var robots = require('robots.txt')
import configureStore from '../store/configureStore';
import createRoutes from '../routes/index';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';


global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// Logging setup
const loggingOpts = {
  name: 'bracketDraft',
  streams: [{
    stream: process.stdout,
    level: 'info',
  }],
  serializers: bunyan.stdSerializers,
  src: process.env.NODE_ENV === 'development',
};


const logger = bunyan.createLogger(loggingOpts);
// Patch console.log
(() => {
  // const originalConsole = Object.assign({}, console);
  ['debug', 'log', 'info', 'warn', 'error'].forEach((level) => {
    console[level] = (...args) => {
      (logger[level] || logger.info).apply(logger, args);
      // originalConsole[level].apply(originalConsole, args)
    };
  });
})();

const server = new Express();

const port = process.env.PORT || 3000;
let scriptSrcs;

let styleSrc;

server.use(favicon('dist/public/images/favicon.ico'));

if (process.env.NODE_ENV !== 'development') {
  const assets = require('../../dist/public/webpack-assets.json');
  const refManifest = require('../../dist/public/rev-manifest.json');

  scriptSrcs = [
    `${assets.vendor.js}`,
    `${assets.app.js}`,
  ];
  styleSrc = `/${refManifest['main.css']}`;
} else {
  const proxy = require('http-proxy-middleware');

  scriptSrcs = [
    'http://localhost:3001/static/vendor.js',
    'http://localhost:3001/static/dev.js',
    'http://localhost:3001/static/app.js',
  ];
  styleSrc = '/main.css';

  // const proxyOptions = {
  //   target: 'localhost:8000',
  //   changeOrigin: true,
  //   router: {
  //     'localhost:3000': 'http://localhost:8000',
  //   },
  // };

  const assetProxyOptions = {
    target: 'localhost:3001',
    changeOrigin: true,
    pathRewrite: {
      '^/': '/app/assets/',
    },
    router: {
      'localhost:3000': 'http://localhost:3001',
    },
  };

  
  // const apiProxy = proxy(proxyOptions);
  const assetProxy = proxy(assetProxyOptions);
  // server.post('/api', function(req, res) {require('./routes')(server)});

  server.use('/fonts', assetProxy);
  server.use('/images', assetProxy);


  // TODO DEAL WITH HMR
  server.get('/__webpack_hmr', (req, res) => {
    res.sendStatus(200);
  });
}
// END DEVELOPMENT ONLY ROUTES / SETUP




function onError(err, req, res, next) { // eslint-disable-line
  req.log.error({ err });
  // TODO show nice 500 error page
  try {
    res.redirect('/404');
    // res.status(500).send('this should be the error page');
  } catch (e) {
    // Error page had an error
    res.redirect('/404');
    // res.status(500).send('something went wrong...');
  }
}


// Will log reqs and errors
server.use(bunyanExpressMiddleware({
  logger,
}));

server.use(compression());
server.use(robots(path.join(__dirname, '../..', '/robots.txt')));

const oneYear = 31536000000;

// server.use('/assets/fonts/515736', Express.static(path.join(__dirname, '..', 'assets/fonts/515736'), { maxAge: oneYear }));
server.use(Express.static(path.join(__dirname, '../..', 'dist/public'), { maxAge: oneYear }));
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

server.use('/error', (req, res, next) => {
  const err = new Error('testing error');
  next(err);
});

  server.use(bodyParser.urlencoded({extended:true}));
    server.use(bodyParser.json());
    // server.use(cookieParser());
    server.use(session({
      secret: 'mySecret',
      resave: false,
      saveUninitialized: false,

    }));
    server.use(passport.initialize());
    server.use(passport.session());

require('./routes')(server);
require('./auth')(server);
  
var models = require('./models');
var schools = require('./helpers/schoolFunctions');
var leagues = require('./helpers/leagueFunctions');
var teams = require('./helpers/teamFunctions');
var draft = require('./helpers/draftFunctions');
var drafts = {};

const httpServer = require('http').Server(server);
const io = require('socket.io').listen(httpServer);


io.on('connection', function(socket) {
  console.log('connected')

  socket.on('action', (action) => {
    if (action.type === 'server/test') {
      console.log('testing', action.data)
      socket.emit('action', {type: 'returning', data: 'comming back'});

    } else if (action.type === 'server/leaguePage') {
      const { leagueId } = action.data;
      socket.join(leagueId);
      draft.checkDraftInProgress(leagueId, socket);
      io.to(leagueId).emit('update', leagueId);

    } else if (action.type === 'server/sendMessage') {
      const { leagueId } = action.data;
      io.to(leagueId).emit('newMessage', action.data); 

    } else if (action.type === 'server/startDraft') {
      const { leagueId } = action.data;
      leagues.startDraft(io, leagueId);

    } else if (action.type === 'server/update') {
      let { leagueId, schoolName, teamId } = action.data;
      console.log('update', teamId)
      teams.getTeamName(teamId, leagueId, schoolName, io);
      draft.advance(leagueId, io);

    } else if (action.type === 'server/leave') {
      const { leagueId, teamId } = action.data;
      console.log('close connection', leagueId);
      socket.leave(leagueId)
      console.log('leaving', teamId)
      teams.turnOnAutoDraft(teamId);

    } else if (action.type === 'server/disconnect') {
      console.log('closing')
    }


  });
});


server.get('*', (req, res, next) => {
  const history = useRouterHistory(useQueries(createMemoryHistory))();
  const store = configureStore({ log: req.log });
  const routes = createRoutes(history);
  const location = history.createLocation(req.url);
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(301, redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      // Log errors!
      req.log.error({ err: error });
      // TODO What is this? Another error page?????
      res.setHeader('Cache-Control', 'public, max-age=10');

      res.status(500).send(error.message);
    } else if (renderProps == null) {
      // TODO make nice 404 page
      res.setHeader('Cache-Control', 'public, max-age=10');
      res.redirect('/404');
      // res.status(404).send('Not found');
    } else {
      const [getCurrentUrl, unsubscribe] = subscribeUrl();
      const reqUrl = location.pathname + location.search;
      if (!process.env.HOSTNAME) {
        process.env.HOSTNAME = req.headers.host;
      }

      getReduxPromise().then(() => {
        const state = store.getState();
        delete state.log;
        const reduxState = escape(JSON.stringify(state));
        const html = ReactDOMServer.renderToString(
          <Provider store={store}>

            { <RouterContext {...renderProps} /> }
          </Provider>
        );
        const head = Helmet.rewind();

        res.setHeader('Cache-Control', 'public, max-age=10'); // one year
        if (getCurrentUrl() === reqUrl) {
          res.render('index', { html, scriptSrcs, reduxState, styleSrc, head });
        } else {
          res.redirect(302, getCurrentUrl());
        }
        unsubscribe();
      })
      .catch((err) => {
        unsubscribe();
        next(err);
      });
      function getReduxPromise() {
        const { query, params } = renderProps;
        const comp = renderProps.components[renderProps.components.length - 1].WrappedComponent;
        const promise = comp.fetchData ?
          comp.fetchData({ query, params, store, history, req }) :
          Promise.resolve();
        return promise;
      }
    }
  });
  function subscribeUrl() {
    let currentUrl = location.pathname + location.search;
    const unsubscribe = history.listen((newLoc) => {
      if (newLoc.action === 'PUSH') {
        currentUrl = newLoc.pathname + newLoc.search;
      }
    });
    return [
      () => { return currentUrl; },
      unsubscribe,
    ];
  }
});


// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'development') {
  server.use((err, req, res, next) => { // eslint-disable-line
    if (err instanceof Error) {
      req.log.error({ err });
      res.status(err.status || 500);
      // Django error?
      if (err.message[0].trim() === '<!') {
        // Pass through
        res.send(err.message);
      } else {
        res.render('error', {
          message: err.message,
          error: err,
        });
      }
    } else {
      next(err);
    }
  });
}

// Production error handler
server.use(onError);

models.NCAA_Team.sync().then(function () {
  models.NCAA_Team.findAll().then(function(teams) {
    if (!teams.length) {
      schools.fetchAllSchools();
    }
  });

  logger.info(`Server is listening to port: ${port}`);
  const appHttpServer = httpServer.listen(port, () => {
    if (process.send) {
      process.send('ready');
    }
  });

  

  appHttpServer.on('error', (err) => {
    // handle errors here
    console.error(err.stack);
  });

  // GRACEFUL RESTART HANDLING FOR PRODUCTION
  if (process.env.NODE_ENV !== 'development') {
    process.on('SIGINT', () => {
      console.log('graceful shutdown');
      // This process has received a SIGINT signal
      // Meaning PM2 is now trying to stop the process

      // So I can clean some stuff before the final stop
      appHttpServer.getConnections((err, count) => {
        if (err) console.error(err);
        console.log(`connections: ${count}`);
      });

      // Allow time for upstream process to stop sending new requests
      // Don't accept new connections (after a delay)
      // and allow existing connections to finish
      const closeDelay = Math.random() * 3000 + 500;
      setTimeout(() => {
        appHttpServer.close(() => {
          // No more connections, safe to quit
          console.log('Closing because of no more connections');
          process.exit(0);
        });
      }, closeDelay);

      // close after 5 seconds max
      setTimeout(() => {
        // force quit the process to allow a restart
        console.log(`Closing because of timeout of ${closeDelay}`);
        process.exit(0);
      }, closeDelay + 5000);
    });
  }
});

module.exports = io;
