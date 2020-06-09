const express = require('express');
const router = express.Router();
const Extractor = require('../http-file-extract');
const extractor = new Extractor();
const AWS = require('aws-sdk');
const aws_config = require('../config/aws_config');
const multer = require('../node_modules/multer');
const multerS3 = require('../node_modules/multer-s3');
const Dicer = require('dicer');
var inspect = require('util').inspect;

AWS.config.update({"accessKeyId": aws_config.accessKeyId, "secretAccessKey": aws_config.secretAccessKey, "region": aws_config.region});
const s3 = new AWS.S3();
let upload;
try{
upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'node-board',
        acl: 'public-read',
        contentType: (req, file, cb) => {
            cb(null, file.mimetype)
        },
        key: (req, file, cb) => {

            cb(null, Date.now()+"_test.png");

     
        }
    })
});
}catch(error){
    console.log('error : ',error);
}

router.post('/upload/file',async(req,res,next)=>{    
    const header = req.headers['content-type'];
    if(!header){
        return res.status(200).send({ status: "fail",message:'non exists content-type'});
    }
    if(header.indexOf('multipart/form-data') < 0){
        return res.status(200).send({ status: "fail", message: 'non exists multipart/form-data'});
    }
    //파일파싱
    extractor.parser(req);

//    res.status(200).send({ status: "success", message: 'ok'});

  const boundary = req.headers['content-type'].split('=')[1];
  var parserCfg = {
   boundary: boundary,
   maxHeaderPairs: (this.limits && this.limits.headerPairs)
 };
 /*
    var d = new Dicer(parserCfg);
 
    d.on('part', function(p) {
      console.log('New part!');
      p.on('header', function(header) {
        for (var h in header) {
          console.log('Part header: k: ' + inspect(h)
                      + ', v: ' + inspect(header[h]));
        }
      });
      p.on('data', function(data) {
          console.log('data$$');
       // console.log('Part data: ' + inspect(data.toString()));
      });
      p.on('end', function() {
        console.log('End of part\n');
      });
    });
    d.on('finish', function() {
      console.log('End of parts');
    });
    req.pipe(d);
    */
    

    console.log('response@');
    
    res.status(200).send({ status: "success", message: 'ok'});



});


router.post('/multer',upload.fields([{ name: 'bom', maxCount: 5 }]),async(req,res,next)=>{

//    console.log('req body : ',req.files);
    res.status(200).send({ status: "success", message: 'ok'});

})

 




module.exports = router;
