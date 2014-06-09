var express = require('express'),
    router = express.Router(),
    utils = require('../c/utils'),
    Question = require('../c/question');

router.get('/', function(req, res) {
    var pageId = req.query.id || 1;
    var begin = 0 + (pageId-1) * 20;
    Question.getQuestionsList(begin, 30, function(response) {
        if (response.res_code != 0) {
            var renderData = {
                curPage: 'qa',
                pageId:pageId,
                pageCount:~~response.res_body.count/20,
                questions: response.res_body.questions
            }
            res.render('qa', renderData);

        } else {
            res.send(response);
            return;
        }
    })
});

router.get('/ask', function(req, res) {
    var renderData = {
        curPage: 'qa_ask'
    }
    res.render('qa_ask', renderData);
})

router.post('/postQuestion', function(req, res) {
    var content = utils.sanitizer.escape(req.body.content) || ''; //防止脚本注入
    if (!utils.validator.isLength(content, 10)) {
        res.send({
            res_code: 0,
            res_msg: '问题的长度不能少于10个字符，请重新输入'
        })
    } else {
        var questionData = {
            uid: req.body.uid,
            type: req.body.type,
            content: content
        }

        var question = new Question(questionData);

        question.create(function(response) {
            if (response.res_code == 0) {
                var newRegId = getNewCcap();
                response.regId = newRegId;
            }
            res.send(response);
        })
    }
})

module.exports = router;
