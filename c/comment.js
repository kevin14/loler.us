var mComment = require('../m/Comment'),
    res = require('./response'),
    cUser = require('./users'),
    utils = require('./utils'),
    ep = require('eventproxy'),
    _ = require('underscore');


function Comment(comment) {
    this.uid = comment.uid;
    this.content = comment.content;
    this.qid = comment.qid;
    this.pid = comment.pid;
    this.tid = comment.tid; //tid 是 所属类别的id 问答专区的id是1 所有评论都在这张表里
}

Comment.prototype.create = function(next) {
    var response = new res(),
        ctime = new Date(),
        ctime = Math.ceil(ctime.getTime() / 1000),
        insertData = {
            'pid': this.pid,
            'qid': this.qid,
            'uid': this.uid,
            'tid': this.tid,
            'content': this.content,
            'ctime': ctime
        };
    mComment.newComment(insertData, function(err, data) {

        if (err) {
            response.res_code = 9;
            response.res_msg = '数据库异常';
            console.log(err);
        } else {
            response.res_msg = '发布成功！';
            response.res_body = {
                qid: data.insertId
            }
        }

        return next(response);
    });
}

Comment.getCommentsList = function(begin, length, qid, next) {
    var response = new res();
    mComment.get_comments_list_by_qid(qid, function(err, rs) {
        if (err) {
            response.res_code = 9;
            response.res_msg = '数据库异常';
            console.log(err);
        } else {
            response.res_body = dataMagic(rs);
        }
        return next(response);
    })
}

Comment.getMostUsefulCommentsList = function(sum, qid, next) {
    var response = new res();
    mComment.get_most_useful_comments_list(sum, qid, function(err, rs) {
        if (err) {
            response.res_code = 9;
            response.res_msg = '数据库异常';
            console.log(err);
        } else {
            response.res_body = rs;
        }
        return next(response);
    })

}

Comment.getCommentsHotList = function(begin, length, next) {
    var response = new res();
    mComment.get_comments_hot_list(begin, length, function(err, rs) {
        if (err) {
            response.res_code = 9;
            response.res_msg = '数据库异常';
            console.log(err);
        } else {
            response.res_body = rs;
        }
        return next(response);
    })
}

Comment.getCommentById = function(qid, next) {
    var response = new res();
    mComment.get_comment_by_id(qid, function(err, rs) {
        if (err) {
            response.res_code = 9;
            response.res_msg = '数据库异常';
            return next(response);
        } else {
            if (rs.length > 0) {
                var uid = rs[0].uid;
                response.res_body = rs[0];
                cUser.getUserById(uid, function(data) {
                    response.res_body.email = data.res_body.email;
                    response.res_body.username = data.res_body.username;
                    response.res_body.avatarUrl = data.res_body.avatarUrl;
                    return next(response);
                })
            } else {
                response.res_code = 0;
                response.res_msg = '404'
                return next(response);
            }
        }
    })
}

//处理无限极分类数据的拼装

function dataMagic(rs) {
    var result = [];
    rs.forEach(function(o, i) {
        if (!o.hasOwnProperty('comments')) {
            o.comments = new Array();
        };
        if (o.pid > 0) {
            findCommentByQid(rs, o.pid).comments.push(o);
        };
    })

    rs.forEach(function(o, i) {
        if(o.pid == 0){
            result.push(o);
        }
    })
    return result;
}

//根据qid在数据库返回的数组中找到指定的comment

function findCommentByQid(rs, pid) {
    var result;
    rs.forEach(function(o, i) {
        if (o.id == pid) {
            if (!o.hasOwnProperty('comments')) {
                o.comments = new Array();
            };
            result = o;
            return true;
        }
    })
    return result || {};
}

module.exports = Comment;
