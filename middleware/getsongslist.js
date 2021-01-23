const fs = require("fs");

exports.getSongsList = (req, res, next)  => {
    fs.readFile('public/songs.jsonl', 'utf8', function(err, linesdata) {
        // Check for errors 
        if (err) throw err;
        // add the song data to the request
        req.songlist = linesdata;
        next();
    });
}