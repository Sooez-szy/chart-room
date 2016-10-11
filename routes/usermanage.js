/**
 * Created by Administrator on 2016/9/28.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('userManage');
});

module.exports = router;