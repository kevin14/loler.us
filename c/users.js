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
                    accessToken: utils.makeAccessToken({
                        uid: data.insertId,
                        username: insertData.username,
                        email: insertData.email,
                        avatarUrl: ''
                    })
                }
            }
        }

        return next(response);
    });
}

//API 根据用户id获取用户数据
User.getUserById = function(uid, next) {
    var response = new res();
    mUser.get_user_by_id(uid, function(err, data) {
        if (err) {
            response.res_code = 9;
            response.res_msg = '数据库异常';
        } else {
            if (data.length == 0) {
                response.res_code = 0;
                response.res_msg = '没有这个用户id';
            } else {
                response.res_msg = '查询成功！';
                response.res_body = data[0];
            }
        }
        return next(response);
    })
}

//API 登录
User.login = function(loginData, next) {
    var response = new res();
    loginData.password = utils.md5(loginData.password);
    mUser.login(loginData, function(err, data) {
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
                    accessToken: utils.makeAccessToken({
                        uid: data[0].id,
                        email: data[0].email,
                        username: data[0].username,
                        avatarUrl: data[0].avatarUrl
                    }),
                    email: data[0].email,
                    username: data[0].username,
                    avatarUrl: data[0].avatarUrl
                }
            }
        }
        return next(response);
    })
}

module.exports = User;
