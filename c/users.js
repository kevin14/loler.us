var mUser = require('../m/users'),
    res = require('./response'),
    utils = require('./utils');


function User(user) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.ip = user.ip;
}

User.prototype.create = function(next) {
    var response = new res(),
        ctime = new Date(),
        ctime = Math.ceil(ctime.getTime() / 1000),
        insertData = {
            'username': this.username,
            'email': this.email,
            'password': utils.md5(this.password),
            'ip': this.ip,
            'ctime': ctime
        };
    mUser.newUser(insertData, function(err, data) {

        if (err) {
            response.res_code = 9;
            response.res_msg = '数据库异常';
            console.log(err);
        } else {
            if (!data) {
                response.res_code = 0;
                response.res_msg = '用户名或邮箱已存在，请重新输入';
            } else {
                //注册成功！
                response.res_msg = '注册成功！';
                response.res_body = {
                    accessToken:utils.makeAccessToken(data.insertId),
                    username: insertData.username,
                    email: insertData.email
                }
            }
        }

        return next(response);
    });
}

User.login = function(loginData, next) {
    var response = new res();

    loginData.password = utils.md5(loginData.password);

    mUser.selectOne(loginData, function(err, data) {

        if (err) {
            response.res_code = 9;
            response.res_msg = '数据库异常';
        } else {
            if (data.length == 0) {
                response.res_code = 0;
                response.res_msg = '用户名或密码错误，请重新输入';
            } else {

                response.res_msg = '登录成功！';
                response.res_body = {
                    accessToken:utils.makeAccessToken(data[0].id),
                    email:data[0].email,
                    username: loginData.username
                }
            }
        }
        return next(response);
    })
}

module.exports = User;
