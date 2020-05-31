const express = require('express');
const router = express.Router();

const fs = require('fs');
const AWS = require('aws-sdk');
const Chance = require('chance');
var ReadableStream = require('stream').Readable || require('readable-stream');

var inherits = require('util').inherits;

var Dicer = require('dicer');

var inspect = require('util').inspect

function FileStream(opts) {
    if (!(this instanceof FileStream))
      return new FileStream(opts);
    ReadableStream.call(this, opts);
  
    this.truncated = false;
}
inherits(FileStream, ReadableStream);




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
      
        let contype;
        let filename;
        let fieldname;
        p.on('header', function(header) {
            contype = header['content-type'];
            const disposition = header['content-disposition'][0].split(';');
            fieldname = disposition[1].trim();

            if(contype){
                filename = disposition[2].trim();
            }
            console.log('contype :',contype);
            console.log('fieldname :',fieldname);
            console.log('filename :',filename)


            for (var h in header) {
                //console.log('h is : ', h);
        
                //console.log('Part header: k: ' + inspect(h) + ', v: ' + inspect(header[h]));
            }
          const fname = new Chance().string();
          const fsc = new FileStream({});
          //const ws = fs.createWriteStream(filename+'.png');

          
          p.on('data', function(data) {
              console.log('data : ',data.toString());
         //   ws.write(data);
         //   fsc.push(data);
          });
          p.on('end', function() {
            console.log('End of part\n');
         //   ws.end();
         //   fsc.push(null);
         //   fsc.pipe(fs.createWriteStream('kim.png'));
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
