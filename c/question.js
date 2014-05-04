var mQuestion = require('../m/question'),
    res = require('./response'),
    utils = require('./utils');


function Question(question) {
    this.uid = question.uid;
    this.content = question.content;
    this.type = question.type;
}

Question.prototype.create = function(next) {
    var response = new res(),
        ctime = new Date(),
        ctime = Math.ceil(ctime.getTime() / 1000),
        insertData = {
            'uid': this.uid,
            'content': this.content,
            'type': this.type,
            'ctime': ctime
        };
    mQuestion.newQuestion(insertData, function(err, data) {

        if (err) {
            response.res_code = 9;
            response.res_msg = '数据库异常';
            console.log(err);
        } else {
            //注册成功！
            response.res_msg = '发布成功！';
            response.res_body = {
                qid:data.insertId
            }
        }

        return next(response);
    });
}

Question.get_questions_list = function(begin,length,next){
    var response = new res();
    mQuestion.get_questions_list(begin,length,function(err,rs){
        if (err) {
            response.res_code = 9;
            response.res_msg = '数据库异常';
            console.log(err);
        }else{
            response.res_body = rs;
        }

        return next(response);
    })
}

module.exports = Question;
