const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const aws_config = require('../config/aws_config');
const multer = require('../node_modules/multer');
const multerS3 = require('../node_modules/multer-s3');

const Extractor = require('../http-file-extract');
const extractor = new Extractor();

AWS.config.update({"accessKeyId": aws_config.accessKeyId, "secretAccessKey": aws_config.secretAccessKey, "region": aws_config.region});
const s3 = new AWS.S3();
let upload = multer({
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


router.post('/upload/file',async(req,res,next)=>{    
    const header = req.headers['content-type'];
    if(!header){
        return res.status(200).send({ status: "fail",message:'non exists content-type'});
    }
    if(header.indexOf('multipart/form-data') < 0){
        return res.status(200).send({ status: "fail", message: 'non exists multipart/form-data'});
    }
    //파일파싱
    extractor.parser(req).writeLocal().writeS3();
    res.status(200).send({ status: "success", message: 'ok'});



});


router.post('/multer',upload.fields([{ name: 'bom', maxCount: 5 }]),async(req,res,next)=>{
    res.status(200).send({ status: "success", message: 'ok'});

})

 




module.exports = router;
