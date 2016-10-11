/**
 * Created by Administrator on 2016/9/22.
 */
var express = require('express');
var router = express.Router();
var chatContentDao = require('../dao/chatContentDao');

/* GET home page. */
router.get('/', function(req, res, next) {
    chatContentDao.searchByTime(req, res, next);
});
router.post('/chatContent', function(req, res, next) {
    chatContentDao.saveContent(req, res, next);
});
router.post('/searchOwnContent', function(req, res, next) {
    chatContentDao.searchByOwn(req, res, next);
});
module.exports = router;