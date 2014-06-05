var express = require('express'),
    router = express.Router(),
    utils = require('../c/utils'),
    Comment = require('../c/comment');

//API 提交回答或者评论的接口
router.post('/postComment', function(req, res) {
    var content = utils.sanitizer.escape(req.body.content) || ''; //防止脚本注入
    if (!utils.validator.isLength(content, 1)) {
        res.send({
            res_code: 0,
            res_msg: '问题的长度不能为空，请重新输入'
        })
    } else {
        var commentData = {
            uid: req.body.uid,
            qid: req.body.qid,
            pid: req.body.pid,
            tid: req.body.tid,
            content: content
        }

        var comment = new Comment(questionData);

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
