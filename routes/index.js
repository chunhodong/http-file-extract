const express = require('express');
const router = express.Router();

const fs = require('fs');
const AWS = require('aws-sdk');
const Chance = require('chance');
var ReadableStream = require('stream').Readable || require('readable-stream');

const multer = require('../node_modules/multer');
const multerS3 = require('../node_modules/multer-s3');
const aws_config = require('../config/aws_config');
AWS.config.update({ "accessKeyId": '', "secretAccessKey": '', "region": aws_config.region });
const s3 = new AWS.S3();
const path = new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate() + "/";
var inherits = require('util').inherits;

var Dicer = require('dicer');

//var parseParams = require('./utils').parseParams;
var inspect = require('util').inspect

function FileStream(opts) {
    if (!(this instanceof FileStream))
      return new FileStream(opts);
    ReadableStream.call(this, opts);
  
    this.truncated = false;
}
inherits(FileStream, ReadableStream);
FileStream.prototype._read = function(n) {

};



router.post('/test',async(req,res,next)=>{
    
    console.log('req.headers : ',req.headers);
    const header = req.headers['content-type'];
    if(!header){
        return res.status(200).send({ status: "ok", message: 'ok', code: "9010" });
    }
    if(header.indexOf('multipart/form-data') < 0){
        return res.status(200).send({ status: "ok", message: 'ok', code: "9010" });
    }



    const boundary = header.split('=')[1];
    console.log('boundary : ',boundary);
    
    const d = new Dicer({boundary});

    d.on('part', function(p) {
        console.log('New part! : ');
        let fileStream;
        let field;
        p.on('header', function(header) {
          for (var h in header) {
              console.log('h is : ',h);
              
            console.log('Part header: k: ' + inspect(h)
            + ', v: ' + inspect(header[h]));
            
          }
          const filename = new Chance().string();
          const fsc = new FileStream({});
          console.log('fsc : ',fsc);
          const ws = fs.createWriteStream(filename+'.png');

          p.on('data', function(data) {
            ws.write(data);
            fsc.push(data);
          });
          p.on('end', function() {
            console.log('End of part\n');
            ws.end();
            fsc.push(null);
          });
        });
      
      });
      d.on('finish', function() {
        console.log('End of parts');
      });
      req.pipe(d);
      return res.status(200).send({ status: "ok", message: 'ok', code: "9010" });


    /*
 
    d.on('part', function(p) {
      console.log('New part!');
      p.on('header', function(header) {
        for (var h in header) {
          console.log('Part header: k: ' + inspect(h)
                      + ', v: ' + inspect(header[h]));
        }
      });
      p.on('data', function(data) {
        console.log('Part data: ' + inspect(data.toString()));
      });
      p.on('end', function() {
        console.log('End of part\n');
      });
    });
    d.on('finish', function() {
      console.log('End of parts');
      res.writeHead(200);
      res.end('Form submission successful!');
    });
    req.pipe(d);
    
    */


});

 




module.exports = router;
