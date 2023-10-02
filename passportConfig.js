const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3');
const LocalStrategy = require('passport-local').Strategy;

const db = new sqlite3.Database('./database.sqlite');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'name' }, async (name, password, done) => {
            try {

                const user = await getUserByName(name);

                if (!user) {
                    return done(null, false, { message: 'Not recognized!' });
                }


                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (isPasswordValid) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        getUserById(id)
            .then((user) => done(null, user))
            .catch((error) => done(error));
    });


    async function getUserByName(name) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM User WHERE name = ?', [name], (error, user) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(user);
                }
            });
        });
    }

    async function getUserById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM User WHERE id = ?', [id], (error, user) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(user);
                }
            });
        });
    }
};