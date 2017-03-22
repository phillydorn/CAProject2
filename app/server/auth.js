var bcrypt = require('bcrypt'),
    models = require('./models'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id).then(function(user) {
    done(null, user);
  });
});

var checkPassword = function(password, hash, done, user) {

  bcrypt.compare(password, hash, function(err, resp) {
    if (resp) {
      console.log('success')
        return done(null, user);
    } else {
      console.log('failure')
      return done(null, false, { message: 'Incorrect password.' });
    }
  })
}

passport.use(new LocalStrategy(
    function(username, password, done) {
      models.User.findOne({ where: {username: username }}).then(function (user) {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        checkPassword(password, user.password, done, user);

      });
    }
  ));


module.exports = function(app) {

  app.post('/api/auth/signup', function (req, res) {
    var newUser = {
      firstname : req.body.firstname,
      lastname : req.body.lastname,
      email : req.body.email,
      username : req.body.username
    }

    bcrypt.hash(req.body.password, 10, function(err, hash) {
      models.sequelize.sync().then(function() {
        models.User.create({
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          email: newUser.email,
          password: hash,
          username: newUser.username
        }).then(function(user){
          console.log('user created for ', user.username);
          passport.authenticate('local')(req, res, function() {
            console.log('authenticate')
            res.status(200).json('success');
          });
        });
      });
    });

  });

  app.post('/api/auth/login', passport.authenticate('local'), function (req, res) {
      console.log('authenticate')
      res.status(200).json('success');
    });
  app.get('/api/auth/logout', function(req, res) {
    req.logout();
    res.status(200).json('logged out');
  });
  app.get('/api/auth/verify', function(req, res) {
    if(req.user && req.user.username) {
      res.status(200).json({loggedIn: true});
    } else {
      res.status(200).json({loggedIn: false});
    }
  });
};
