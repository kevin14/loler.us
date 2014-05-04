var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	var renderData = {
		curPage:'index'
	}
  	res.render('index',renderData);
});

module.exports = router;
