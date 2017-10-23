var express = require('express');
var router = express.Router();

router.get('/test-video', function (req, res, next) {

  var options = {
    root: __dirname + '/../public/video/'
  };

  var fileName = 'test-video.mp4';
  res.set({'Content-Type':'video/cc'});
  res.sendFile(fileName, options);
});

module.exports = router;
