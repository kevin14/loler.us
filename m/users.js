var db = require('./db'),
    table_name = 'users',
    eventproxy = require('eventproxy'),
    ep = new eventproxy();

exports.newUser = function(data, next) {
    checkUserExit(data.email, data.username, function(canReg) {
        if (canReg) {
            db.insert_one(data, table_name, function(err, user) {
                return next(err, user);
            });
        } else {
            return next(null, false);
        }
    })
}

exports.selectOne = function(data,next){
    var query = 'SELECT * FROM '+table_name+' WHERE username="'+data.username+'" AND password="'+data.password+'"';
    db.query(query,function(err,reslut){
        return next(err,reslut);
    });
}

function checkUserExit(email, username, next) {
    ep.all('checkEmail', 'checkUsername', function(checkEmail, checkUsername) {
        if (checkEmail.length > 0 || checkUsername.length > 0) {
            return next(false);
        } else {
            return next(true);
        }
    })
    db.select_by_title('email', email, table_name, function(err, data) {
        ep.emit('checkEmail', data);
    })
    db.select_by_title('username', username, table_name, function(err, data) {
        ep.emit('checkUsername', data);
    })

}
