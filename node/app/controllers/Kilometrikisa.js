var Kilometrikisa = require('../lib/kilometrikisa.js');
var strava = require('strava-v3');
var User = require('../models/UserModel.js');

/**
 * Handle Kilometrikisa login flow.
 * @type {Object}
 */
var KilometrikisaController = {



    /**
     * Display login form.
     *
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    auth:  function(req, res, next) {

        res.render('kilometrikisa-auth');

    },



    /**
     * Try logging in to Kilometrikisa.
     *
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    authHandler: function(req, res, next) {

        var username = req.query.username;
        var password = req.query.password;

        // res.render('kilometrikisa-auth');
        Kilometrikisa.login(
            username,
            password,
            function(token, sessionId) {

                console.log("Login complete: " + token + " / " + sessionId);

                // req.session.kilometrikisaToken = token;
                // req.session.kilometrikisaSessionId = sessionId;

                // Find user.
                User.find({stravaUserId: req.session.stravaUserId}, "stravaUserId", function(err, u) {

                    if (err) {
                        res.redirect('/error?code=DATABASE_CONNECTION_FAILED');
                        return;
                    }

                    // Save Kilometrikisa token and session id.
                    var user = u[0];
                    user.set("kilometrikisaToken", token);
                    user.set("kilometrikisaSessionId", sessionId);
                    user.save(function() {

                        // Redirect to account page.
                        res.redirect('/account');

                    });

                });


            },
            function() {

                res.render('kilometrikisa-error');

            }
        );
    }






    /*
    index: function(req, res, next) {

        Kilometrikisa.login(
            "jaamo",
            "KissaKoira2",
            function(token, sessionId) {

                console.log("Login complete: " + token + " / " + sessionId);

                Kilometrikisa.updateLog(token, sessionId, 17, 66, "2016-04-05", function() {
                    console.log("ok");
                })


            },
            function() {
                console.log("Not logged in...");
            }
        );

        res.render('kilometrikisa', {data: 'check the terminal log'});
    }
    */



};
module.exports = KilometrikisaController;