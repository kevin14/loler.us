var express = require('express'),
    router = express.Router(),
    utils = require('../c/utils'),
    Comment = require('../c/comment'),
    Question = require('../c/question'),
    eventproxy = require('eventproxy'),
    ep = new eventproxy();

router.get('/', function(req, res) {
    var qid = req.query.qid;
    var renderData = {
        curPage: 'question'
    }
    Question.getQuestionById(qid, function(response) {
        if (response.res_code == 1) {
            ep.emit('getQuestion', response);
        } else {
            ep.emit('error',response);
        }
    })
    Comment.getCommentsList(0,30,qid,function(response){
        if (response.res_code == 1) {
            ep.emit('getComments', response);
        } else {
            ep.emit('error',response);
        }
    })
    Comment.getMostUsefulCommentsList(3,qid,function(response){
        if (response.res_code == 1) {
            ep.emit('getUsefulComments', response);
        } else {
            ep.emit('error',response);
        }
    })
    ep.on('error',function(err){
        renderData.err = [];
        renderData.err.push(err);
        res.render('error',renderData);
    });
    ep.all('getQuestion','getComments','getUsefulComments',function(response1,response2,response3){
        res.send(response2);
        // renderData.question = response1.res_body;
        // renderData.comments = response2.res_body;
        // renderData.usefulComments = response3.res_body;
        // res.render('question',renderData);
    })
});

//API 提交回答或者评论的接口
router.post('/postComment', function(req, res) {
    var accessToken = req.cookies.accessToken;
    utils.getUidByToken(accessToken, function(uid) {

        //TODO 判读如果uid不存在的话 那么返回请登录 这一层需要在客户端先测试一次

        var content = utils.sanitizer.escape(req.body.content) || ''; //防止脚本注入
        if (!utils.validator.isLength(content, 1)) {
            res.send({
                res_code: 0,
                res_msg: '输入的长度不能为空，请重新输入'
            })
        } else {
            var commentData = {
                uid: uid,
                qid: req.body.qid,
                pid: req.body.pid,
                tid: 1,
                content: content
            }

            var comment = new Comment(commentData);

            comment.create(function(response) {
                if (response.res_code == 0) {
                    var newRegId = getNewCcap();
                    response.regId = newRegId;
                }
                res.send(response);
            })
        }
    })


})

module.exports = router;
