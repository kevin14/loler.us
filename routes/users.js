var express = require('express');
var router = express.Router(),
    request = require('request'),
    cheerio = require('cheerio'),
    http = require('http'),
    pool = new http.Agent(),
    Users = require('../c/users'),
    ccap = require('ccap')(),
    ccapSet = {},
    utils = require('../c/utils'),
    eventproxy = require('eventproxy'),
    client = require('../c/redis');


router.get('/reg', function(req, res) {

    var ary = ccap.get(),
        txt = ary[0],
        buf = ary[1],
        regId = new Date().getTime();

    ccapSet[regId] = {
        str: txt,
        image: buf
    }

    var renderData = {
        curPage: 'reg',
        regId: regId
    }
    res.render('reg', renderData);
});

router.get('/login', function(req, res) {

    var renderData = {
        curPage: 'login'
    }
    res.render('login', renderData);
});

//API 获取验证码
router.get('/ccap', function(req, res) {

    var regId = req.query.regId;

    res.end(ccapSet[regId].image);

});

//API 获取新的验证码
router.get('/getNewCcap', function(req, res) {

    var ary = ccap.get(),
        txt = ary[0],
        buf = ary[1],
        regId = new Date().getTime();

    ccapSet[regId] = {
        str: txt,
        image: buf
    }

    res.send({
        res_code: 1,
        regId: regId
    });

});

//API 登入
router.post('/postLogin', function(req, res) {
    var loginData = {
        username: req.body.username,
        password: req.body.password
    }
    
    Users.login(loginData, function(data) {
        res.send(data);
    })
})

//API 注册接口
router.post('/postReg', function(req, res) {

    var ccapCode = req.body.ccapCode.toLocaleUpperCase(),
        regId = req.body.regId;

    if (ccapCode != ccapSet[regId].str) {
        var newRegId = getNewCcap();

        res.send({
            res_code: 2,
            res_msg: '验证码不正确！',
            regId: newRegId
        })
    } else {
        var userData = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            ip: req.connection.remoteAddress
        };
        if (!utils.validator.isEmail(userData.email)) {
            var newRegId = getNewCcap();
            res.send({
                res_code: 0,
                res_msg: '邮箱格式错误！',
                regId:newRegId
            })
        } else if (!utils.validator.isUsername(userData.username)) {
            var newRegId = getNewCcap();
            res.send({
                res_code: 0,
                res_msg: '用户名只能输入5-20个以字母开头、可带数字、“_”、“.”的字串！',
                regId:newRegId
            })
        } else if (!utils.validator.isPassword(userData.password)) {
            var newRegId = getNewCcap();
            res.send({
                res_code: 0,
                res_msg: '密码长度过小！',
                regId:newRegId
            })
        } else {
            var user = new Users(userData);
            user.create(function(response) {
                if (response.res_code == 0) {
                    var newRegId = getNewCcap();
                    response.regId = newRegId;
                }
                res.send(response);
            });
        }
    }

    removeCcapCode(regId);

});

//API 获取玩家信息 users/getPlayerInfo
router.post('/getPlayerInfo', function(req, res) {
    var playerName = req.body.playerName,
        serverName = req.body.serverName,
        result = {
            res_code: 1
        },
        url = "http://lolbox.duowan.com/playerDetail.php?serverName=" + serverName + "&playerName=" + playerName;
    var req = request.get({
        url: url,
        pool: pool
    }, function(error, response, body) {
        if (error) {
            result.res_code = 0; //0代表请求异常
            res.send(result);
        } else {
            var $ = cheerio.load(body);
            if (!$('#playerNameLink')) {
                result.res_code = 2; //2代表没有这位玩家的信息
                res.send(result);
            } else {
                var zdz = $('.fighting').find('p').eq(1).find('span').text(),
                    playerName = $('#playerNameLink').text(),
                    ftime = $('.act').text().replace(/\s*/g, ''),
                    avatarUrl = $('.avatar img').attr('src'),
                    level = $('.avatar em').text();
                var ppjd = $('.mod-tabs-content table tr').eq(1),
                    ppjdInfo = [ppjd.find('td').eq(2).text(), ppjd.find('td').eq(3).text(), ppjd.find('td').eq(4).text(), ppjd.find('td').eq(5).text()];
                var pw = $('.mod-tabs-content').eq(1).find('tr').eq(1),
                    pwInfo = [pw.find('td').eq(4).text(), pw.find('td').eq(5).text(), pw.find('td').eq(6).text(), pw.find('td').eq(7).text()];
                result.playerInfo = {
                    zdz: zdz,
                    playerName: playerName,
                    ftime: ftime,
                    avatarUrl: avatarUrl,
                    level: level,
                    ppjdInfo: ppjdInfo,
                    pwInfo: pwInfo
                }
                res.send(result);
            }
        }
    });
});

//API 获取排位赛的信息
router.post('/getWarzone', function(req, res) {
    var playerName = req.body.playerName,
        serverName = req.body.serverName,
        result = {
            res_code: 1
        },
        url = "http://lolbox.duowan.com/ajaxGetWarzone.php?serverName=" + serverName + "&playerName=" + playerName;
    var req = request.get({
        url: url,
        pool: pool
    }, function(error, response, body) {
        if (error) {
            result.res_code = 0; //0代表请求异常
            res.send(result);
        } else {
            result.warInfo = body;
            res.send(result);
        }
    });
});

//API 获取正在进行的比赛接口 TODO
router.post('/getCurrent', function(req, res) {
    var playerName = req.body.playerName,
        serverName = req.body.serverName,
        result = {
            res_code: 1
        };
    res.send(result);
});

function removeCcapCode(regId) {
    delete ccapSet[regId];
}

function getNewCcap() {
    var ary = ccap.get(),
        txt = ary[0],
        buf = ary[1],
        regId = new Date().getTime();

    ccapSet[regId] = {
        str: txt,
        image: buf
    }

    return regId;
}

module.exports = router;
