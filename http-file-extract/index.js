const Parser = require('./parser');
const fs = require('fs');
/**
 * @description multipart file parsing project
 * 기존에 업로드에 사용하는 multer library의 구조적제약 개선
 * 1. middleware에서만 쓰일수 있음
 * 2. 파일별처리 불가 ( a.png 는 s3, b.png는 disk)
 * 3. front와 back에서 속성개수와 이름이 안맞을 경우 error
 */

class FileExtract{
    constructor(){
        this.fileMap = new Map();
        
        
    }

    parser(req){
        //Parser로 스트림전송
        const parser = new Parser(this,req.headers,req);
        req.pipe(parser);
        return this;

    }

    _setStream(fieldname,stream){
        this._setDataMap(fieldname,stream);
    }
    
    _setBuffer(fieldname,buffer){
        this._setDataMap(fieldname,buffer);
    }

    _setDataMap(field,value){
        if(this.fileMap.has(field)){
            this.fileMap.get(field).push(value);
            return;
        }
        this.fileMap.set(field,[].push(value));
    }


    writeS3(filename){

        return this;
    }

    writeLocal(body,cb){
        
        
        if(!this.fileMap.has(body.name)){
            return cb(new Error('non exsists file'));
        }
        
        const wstream = fs.createWriteStream(this.fileMap.get(body.path));
        wstream.on('finish', function(){
          });
        return this;

    }

    getBody(){

    }


}
module.exports = FileExtract;