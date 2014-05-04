var db = require('./db'),
    table_name = 'questions',
    eventproxy = require('eventproxy'),
    ep = new eventproxy();

exports.newQuestion = function(data, next) {
    db.insert_one(data, table_name, function(err, question) {
        return next(err, question);
    })
}

exports.selectOne = function(data, next) {
    var query = 'SELECT * FROM ' + table_name + ' WHERE id="' + data.id;
    db.query(query, function(err, reslut) {
        return next(err, reslut);
    });
}

exports.get_questions_list = function(begin, length, next) {
    db.query("SELECT * FROM " + table_name + " ORDER BY id DESC LIMIT " + begin + "," + length, function(err, rs, field) {
        return next(err, rs);
    });
}
