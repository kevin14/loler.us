var db = require('./db'),
    table_name = 'questions',
    eventproxy = require('eventproxy'),
    ep = new eventproxy();

exports.newQuestion = function(data, next) {
    db.insert_one(data, table_name, function(err, question) {
        return next(err, question);
    })
}

exports.get_question_by_id = function(id, next) {
    var query = "SELECT q.*,u.*,q.id as qid,u.id as uid FROM questions q JOIN users u ON q.uid = u.id WHERE q.id=" + id;
    db.query(query, function(err, result) {
        return next(err, result);
    });
}

exports.get_questions_list = function(begin, length, next) {
    db.query("SELECT questions.*,users.*,questions.id as qid,users.id as uid,questions.ctime as qctime FROM questions join users ON questions.uid = users.id ORDER BY questions.id DESC LIMIT " + begin + "," + length, function(err, rs, field) {
        return next(err, rs);
    });
}

//TODO get hotest list
exports.get_questions_hot_list = function(begin,length,next){
    db.query("SELECT * FROM " + table_name + " ORDER BY id DESC LIMIT " + begin + "," + length, function(err, rs, field) {
        return next(err, rs);
    });
}

exports.get_count = function(next){
    db.get_count(table_name,function(err,rs){
        return next(err,rs);
    })
}
