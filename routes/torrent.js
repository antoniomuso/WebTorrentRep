var express = require('express');
var router = express.Router();
var Torrent =  require("webtorrent");
var config = require("../config.json");

var client = new Torrent();

function status(client)
{
    let status = {
        stateAllTorrent : client.progress,
    };
    client.torrents.forEach(function (torr) {
        status[torr.infoHash] = {
            active : !torr.paused,
            progress : torr.progress
        };
    });
    return status;
}


/* GET users listing. */
router.get('/add', function(req, res, next) {

    client.on('error', function (err) {
      res.end(err.message);
    });

    client.add(req.query.torrent,{ path: config.path }, function (torrent) {
        // Got torrent metadata!
        console.log('Client is downloading:', torrent.infoHash);
        res.json(status(client));
    });



});



router.get("/remove", function (req, res, next) {
    if (req.query.torrent)
    {
        client.remove(req.query.torrent);
    }
    res.json(status(client));


});

router.get("/status", function (req, res, next) {

    res.json(status(client));

});

router.get("/pause", function (req,res, next) {
    if(req.query.torrent)
    {
        let tor = client.get(req.query.torrent);
        if (!tor)
            res.end("Value is not correct");

        client.on('error', function (err) {
            res.end(err.message);
        });

        res.json({
            id: tor.infoHash,
            active: !tor.paused,
            progress: tor.progress
        });
    }
    else {
        client.torrents.forEach(function (tor) {
            tor.pause();
        });
        res.json(status(client));

    }
});


router.get("/resume", function (req,res) {

    if (!req.query.torrent)
    {
        client.torrents.forEach(function (tor) {
            tor.resume();
        });
    }
    else
    {
        client.get(req.query.torrent).resume();
    }


    res.json(status(client));
});


module.exports.torrent = client;
module.exports = router;
