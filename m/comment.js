var db = require('./db'),
    table_name = 'comments',
    eventproxy = require('eventproxy'),
    ep = new eventproxy();

exports.newComment = function(data, next) {
    db.insert_one(data, table_name, function(err, comment) {
        return next(err, comment);
    })
}

exports.get_comment_by_id = function(id, next) {
    var query = "SELECT * FROM " + table_name + " WHERE id=" + id;
    db.query(query, function(err, result) {
        return next(err, result);
    });
}

exports.get_comments_list = function(begin, length, qid, next) {
    var query = "SELECT * FROM " + table_name + " WHERE qid=" + qid + " ORDER BY id DESC LIMIT " + begin + "," + length;
    db.query(query, function(err, rs, field) {
        return next(err, rs);
    });
}

exports.get_comments_list_by_qid = function(qid, next) {
    var query = "SELECT * FROM " + table_name + " WHERE qid=" + qid + " ORDER BY id DESC";
    db.query(query, function(err, rs, field) {
        return next(err, rs);
    });
}

//TODO get hotest list
exports.get_comments_hot_list = function(begin, length, next) {
    db.query("SELECT * FROM " + table_name + " ORDER BY id DESC LIMIT " + begin + "," + length, function(err, rs, field) {
        return next(err, rs);
    });
}

exports.get_most_useful_comments_list = function(sum, qid, next) {
    var query = "SELECT * FROM " + table_name + " WHERE qid=" + qid + " ORDER BY uptimes DESC LIMIT 0," + sum;
    db.query(query, function(err, rs, field) {
        return next(err, rs);
    });
}
