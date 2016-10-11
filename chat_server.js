/**
 * Created by Administrator on 2016/9/23.
 */
var io = require('socket.io')();
var _ = require('lodash-node');

var userList = [];

/**
 * 将用户添加到用户列表方法
 */

function addUser(user,_socket){
    if(_.find(userList,{'id':user.id})){
        return;
    }else{
        _socket.user = user;
        userList.push(user);
    }
}

/**
 * 用户列表移除指定用户方法
 */

function removeUser(user){
    userList =_.reject(userList,{'id':user.id})
}

io.on('connection', function (_socket) {
    /**
     * 发送 用户信息请求
     */
    _socket.emit('needUser');
    _socket.emit('userList',userList);
    /**
     * 接收用户信息
     */
    _socket.on('myUser',function(user){
        var user = decodeURI(user);
        var userObj = eval('(' + user + ')');
        _socket.user = userObj;
        addUser(userObj,_socket);
        /*向所有人发送用户加入事件*/
        _socket.emit('userJoin',user);
        _socket.broadcast.emit('userJoin',user);
        /*向所有人发送当前在线用户列表*/
        _socket.emit('userList',userList);
        _socket.broadcast.emit('userList',userList);
    })
    _socket.on('usermsg',function(msg,user){
        var user = decodeURI(user);
        var userObj =  eval('(' + user + ')');
        var time = new Date().toString();
        _socket.emit('chat', userObj, msg ,time);
        _socket.broadcast.emit('chat', userObj, msg ,time);
    })
    /**
     * 监听私聊消息
     */
    _socket.on('ownChat',function(toUserId,msg, user){
        var user = decodeURI(user);
        var userObj =  eval('(' + user + ')');
        var time = new Date().toString();
        _socket.emit('ownChatSelf', userObj, msg ,time);
        _socket.emit('to'+toUserId, userObj, msg ,time);
        _socket.broadcast.emit('to'+toUserId, userObj, msg ,time);
    })

    /**
     * 监听用户失去连接
     */
    _socket.on('disconnect',function(){
        if(_socket.user){
            console.log(_socket.user.username + ': disconnect');
        }
        var userObj = _socket.user;
        if(userObj){
            removeUser(userObj)
            _socket.broadcast.emit('userLeave',_socket.user,userList);
        }
    })
});

exports.listen = function (_server) {
    return io.listen(_server);
};