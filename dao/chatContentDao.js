/**
 * Created by Administrator on 2016/9/23.
 */
var mysql = require('mysql');
var db = require('../connection/db');
var sql = require('./chatContentSqlMapping');
var session = require('express-session');
var _ =require('lodash');
var chatContent = require('../model/chatContent');
var moment = require('moment');
//创建数据库连接池
var pool = mysql.createPool(db.mysql);
module.exports = {
    /**
     * 存储聊天记录
     */
    saveContent:function(req,res,next){
        pool.getConnection(function(err,connection){
            var param = req.body;
            var ChatContent = new chatContent();
            for(var key in param){
                ChatContent[key] = param[key];
            }
            connection.query(
                sql.saveContent,
                [ChatContent.id,ChatContent.create_time,ChatContent.from_user,ChatContent.nickname,ChatContent.content,ChatContent.msg_type,ChatContent.status,ChatContent.receive_user,ChatContent.topic],
                function(err,result){
                    if(err){
                        console.log('add err:' + err);
                        res.send('fail');
                    }else{
                        res.send('success');
                    }
                    connection.release();
                }
            )
        })
    },
    searchByTime:function(req,res,next){
        pool.getConnection(function(err,connection){
            connection.query(
                sql.searchContent,
                [],
                function(err,rows){
                    if(err){
                        console.log('add err:' + err);
                    }else{
                        rows.forEach(function(row){
                            row.create_time = moment(row.create_time).format("HH:mm")
                        })
                        var newData = rows.reverse();
                        res.render('chat',{chatContents:newData});
                    }
                    connection.release();
                }
            )
        })
    },
    searchByOwn:function(req,res,next){
        var param = req.body;
        var sendId = param.sendId;
        var receiveId = param.receiveId;
        pool.getConnection(function(err,connection){
            connection.query(
                sql.searchOwn,
                [sendId,receiveId,receiveId,sendId],
                function(err,rows){
                    if(err){
                        console.log('add err:' + err);
                    }else{
                        rows.forEach(function(row){
                            row.create_time = moment(row.create_time).format("HH:mm")
                        })
                        var newData = rows.reverse();
                        res.send({chatContents:newData});
                    }
                    connection.release();
                }
            )
        })
    },


}