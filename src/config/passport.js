const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'username'
}, async(username, password, done) => {
    // mathc username
    const user = await User.findOne({ username: username });
    if (!user) {
        return done(null, false, { message: 'No se encontro el usuario.' });
    } else {
        // match password
        const match = await user.matchPassword(password);
        if (match) {
            // match activate
            const matchac = await User.findById(user._id);
            if (matchac.active == false) {
                return done(null, false, { message: 'Su cuenta aun no ah sido verificada.' });
            } else {
                await User.findByIdAndUpdate(user._id, {status: true});
                return done(null, user);
            }

        } else {
            return done(null, false, { message: 'Contraseña incorrecta.' });
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});