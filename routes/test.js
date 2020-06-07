const express = require('express');
const router = express.Router();

const Extractor = require('../http-file-extract');
const extractor = new Extractor();
router.post('/test',async(req,res,next)=>{
    
    
    const header = req.headers['content-type'];
    if(!header){
        return res.status(200).send({ status: "ok", message: 'ok', code: "9010" });
    }
    if(header.indexOf('multipart/form-data') < 0){
        return res.status(200).send({ status: "ok", message: 'ok', code: "9010" });
    }
    //파일추출
    extractor.parser(req);




});

 




module.exports = router;
