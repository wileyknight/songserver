
const fs = require("fs");
const parse = require('csv-parse');

// @desc    Get All Songs
// @route   GET /api/songs
exports.getSongs = (req, res, next)  => {
  // get the songlist
  const songList = req.songlist;
  // split lines into array
  const xdata = songList.split('\r\n');
  // create object from array 
  let jsonObj = [];
  const headers = JSON.parse(xdata[0]);
  for(let i = 1; i < xdata.length; i++) {
    let data = JSON.parse(xdata[i]);
    let obj = {};
    obj.id = i;
    for(let j = 0; j < data.length; j++) {
      obj[headers[j]] = data[j];
    }
    jsonObj.push(obj);
  }
  res.status(200).json(jsonObj);
}

// @desc    Create Song
// @route   POST /api/songs
exports.createSong = (req, res, next)  => {
  // create string of song data from the body
  let newsong = `["${req.body['Song Title']}","${req.body['Author']}","${req.body['Length']}","${req.body['Released']}"]`

  // get the songlist
  const songList = req.songlist;
  // add new song to the song list
  const newList = songList + "\r\n" + newsong;

  // write the new file
  fs.writeFile('public/songs.jsonl', newList, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  //send response
  res.status(200).send({
    status: true,
    message: 'New song added.'
  });
}
  
// @desc    Create Songs from .CSV file
// @route   POST /api/songs/csv
exports.createSongs = (req, res, next)  => {
try {
    if(!req.files) {
        // no file found
        res.send({
            status: false,
            message: 'No file uploaded'
        });
    } else {
        // file to variable
        const csvFile = req.files.file;
        const songList = req.songlist;

        // save the file
        csvFile.mv('./public/uploads/' + csvFile.name);

        // retrieve uploaded file
        fs.readFile('./public/uploads/' + csvFile.name, function(err, linesdata) {
          // parse csv
          parse(linesdata, {
            comment: '#'
          }, function(err, output){
            // create string from csv
            let toStringLines = '';
            for(var i = 1; i < output.length; i++) {
              toStringLines += "\r\n" + JSON.stringify(output[i]);
            }
            // add new list to old list
            const newList = songList + toStringLines;

            // write new list to file
            fs.writeFile('public/songs.jsonl', newList, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
          });
        });

        //send response
        res.status(200).send({
            status: true,
            message: 'File is uploaded',
            data: {
                name: csvFile.name,
                mimetype: csvFile.mimetype,
                size: csvFile.size
            }
        });

    }
  } catch (err) {
      res.status(500).send(err);
  }
}
