/**
 * Created by Administrator on 2016/9/23.
 */
var chatContent = {
    saveContent: 'INSERT INTO t_chat(id,create_time, from_user, nickname, content, msg_type, status, receive_user, topic) VALUES (?,?,?,?,?,?,?,?,?)',
    /*根据时间查询用户ID*/
    searchContent:"SELECT t.create_time,t.nickname,t.content,u.header_pic FROM t_chat t"+
    " JOIN user u ON u.id = t.from_user"+
    " WHERE t.msg_type = 0 AND t.status=0 "+
    " ORDER BY t.create_time DESC"+
    " LIMIT 0,10 ",
    searchOwn:"SELECT t.create_time,t.from_user,t.nickname,t.content,u.header_pic FROM t_chat t"+
    " JOIN user u ON u.id = t.from_user"+
    " WHERE (t.msg_type = 1 AND t.status=0) AND (t.from_user=? AND t.receive_user=?) OR (t.from_user=? AND t.receive_user=?)"+
    " ORDER BY t.create_time DESC"+
    " LIMIT 0,10 "
};
module.exports = chatContent;