const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tieba');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.on('open', function() {
    console.log('connect successfully!');
});

const account = mongoose.model('account', mongoose.Schema({
    username: String,
    password: String
}));

const post = mongoose.model('post', mongoose.Schema({
    title: String,
    content: String,
    user: String,
    time: Number
}));

var modelcolletions = {};

// mongoose.Types.ObjectId('String')

module.exports = {
    signin: async (user) => {
        console.log(user);
        return account.find(user, async (err, res) => {
            if (err) {
                console.log(err);
            }
            return res;
        });
    },

    signup: async (user) => {
        const acc = new account(user);
        acc.save((err, acc) => {
            if (err) {
                console.log(err);
            }
            console.log(user);
        });
    },

    // return the _id
    saveabstract: async (userpost) => {
        const lastpost = new post(userpost);
        lastpost.save((err, postcontent) => {
            if (err) {
                console.log(err);
            }
        });
        return lastpost._id.toString();
    },

    updateabstract: async (userpost) => {
        post.findById(userpost.postid,(err, res) => {
            if (err) {
                console.log(err);
            }
            res.content = userpost.content;
            res.user = userpost.user;
            res.time = userpost.time;
            res.save((err) => {
                if (err) {
                    console.log(err);
                }
            });
        });
    },

    getabstract: async (page) => {
        return post.find()
                    .sort({time:-1})
                    .skip(7 * (page - 1))
                    .limit(7)
                    .exec((err, data) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log('get number of content: ' + data.length);
                        return data;
                    });
    },

    savepost: async (userpost) => {
        const id = userpost.postid;
        var post = modelcolletions[id];
        if (post == undefined) {
            post = mongoose.model(id, mongoose.Schema({
                content: String,
                user: String,
                time: Number
            }));
            modelcolletions[id] = post;
        }
        const lastpost = new post(userpost);
        lastpost.save((err, postcontent) => {
            if (err)
                console.log(err);
            console.log('saved the post: ' + id);
        });
    },

    getpost: async (query) => {
        let postid = query.postid;
        let page = query.page;
        var post = modelcolletions[postid];
        if (post == undefined) {
            post = mongoose.model(postid, mongoose.Schema({
                content: String,
                user: String,
                time: Number
            }));
            modelcolletions[postid] = post;
        }
        return post.find()
                    .sort({time:1})
                    .skip(5 * (page - 1))
                    .limit(5)
                    .exec((e) => {
                        if (e) {
                            console.log(e);
                        }
                    });
    },

    getabstractcount: async () => {
        return post.count().exec((e, c) => {
            if (e) {
                console.log(e);
            }
            return c;
        });
    },

    getpostcount: async (id) => {
        let post = modelcolletions[id];
        if (post == undefined) {
            post = mongoose.model(id, mongoose.Schema({
                content: String,
                user: String,
                time: Number
            }));
            modelcolletions[id] = post;
        }
        return post.count().exec((e, c) => {
            if (e) {
                console.log(e);
            }
            return c;
        });
    },

    gettitle: async (id) => {
        var title = '';
        return post.findById(id, (err, res) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
