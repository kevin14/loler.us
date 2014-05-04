var express = require('express'),
    router = express.Router(),
    utils = require('../c/utils'),
    Question = require('../c/question');

router.get('/', function(req, res) {

    var qid = req.query.qid;
    var renderData = {
        curPage:'question'
    }
    res.render('question',renderData)
});

module.exports = router;
