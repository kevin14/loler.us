var ccap = require('ccap')(),
    crypto = require('crypto'),
    validator = require('validator'),
    sanitizer = require('sanitizer'),
    util = require('util'),
    client = require('./redis').client,
    redis = require('./redis').redis;

var SECRET_STRING = "kevin14isgreat";

//验证码工具
exports.ccap = function(str) {
    var captcha = ccap({

        width: 160, //set width,default is 256

        height: 60, //set height,default is 60

        offset: 40, //set text spacing,default is 40

        quality: 60, //set pic quality,default is 50

        fontsize: 50, //set font size,default is 57

        generate: function() { //Custom the function to generate captcha text

            //generate captcha text here

            return text; //return the captcha text

        }

    });
}

//得到accessToken 加密规则在这里
exports.makeAccessToken = function(data) {

    client.select(8);
    var time = new Date().getTime();
    var token = md5(data.uid + time + SECRET_STRING);
    client.set(token, JSON.stringify(data), redis.print);
    client.expire(token,604800,redis.print);
    return token;

}

exports.getAccessToken = function(uid) {

}

exports.getUidByToken = function(token, next) {
    client.select(8);
    client.get(token, function(err, value) {
        return next(JSON.parse(value).uid);
    });
}

exports.getInfoByToken = function(token, next) {
    client.select(8);
    client.get(token, function(err, value) {
        return next(JSON.parse(value));
    });
}

exports.removeUidByToken = function(token) {

}


exports.setCookies = function(res, data) {
    var data = data.res_body;
    for (var key in data) {
        res.cookie(key,data[key],{maxAge:604800000});
    }
}

/**
 * [继承]
 * @return 让o1继承o2
 */
exports.extend = function(o1, o2) {
    if (typeof o1 === 'object' && typeof o2 === 'object') {
        for (o in o2) {
            o1[o] = o2[o];
        }
        return true;
    } else {
        console.error("extend类型异常")
    }
}

//MD5 加密
exports.md5 = md5;

//验证
//LoLer的用户名验证 只能输入5-20个以字母开头、可带数字、“_”、“.”的字串
validator.isUsername = function(str) {
    var reg = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/
    if (reg.test(str)) {
        return true;
    } else {
        return false;
    }
}
validator.isPassword = function(str) {
    if (str.length < 6) {
        return false;
    } else {
        return true;
    }
}
exports.validator = validator;

exports.sanitizer = sanitizer;

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}
