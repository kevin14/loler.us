var mQuestion = require('../m/question'),
    res = require('./response'),
    cUser = require('./users'),
    utils = require('./utils'),
    ep = require('eventproxy');


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
            response.res_msg = '发布成功！';
            response.res_body = {
                qid:data.insertId
            }
        }

        return next(response);
    });
}

Question.getQuestionsList = function(begin,length,next){
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

Question.getQuestionsHotList = function(begin,length,next){
    var response = new res();
    mQuestion.get_questions_hot_list(begin,length,function(err,rs){
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

Question.getQuestionById = function(qid,next){
    var response = new res();
    mQuestion.get_question_by_id(qid,function(err,rs){
        if (err) {
            response.res_code = 9;
            response.res_msg = '数据库异常';
            return next(response);
        }else{
            if (rs.length > 0) {
                var uid = rs[0].uid;
                response.res_body = rs[0];
                cUser.getUserById(uid,function(data){
                    response.res_body.email = data.res_body.email;
                    response.res_body.username = data.res_body.username;
                    response.res_body.avatarUrl = data.res_body.avatarUrl;
                    return next(response);
                })
            }else{
                response.res_code = 0;
                response.res_msg = '404'
                return next(response);
            }
        }
    })
}

module.exports = Question;
