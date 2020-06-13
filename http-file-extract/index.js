const Parser = require('./parser');
const fs = require('fs');

/**
 * @description multipart file parsing project
 * 기존에 업로드에 사용하는 multer library의 구조적제약 개선
 * 1. middleware에서만 쓰일수 있음
 * 2. 파일별처리 불가 ( a.png 는 s3, b.png는 disk)
 * 3. front와 back에서 속성개수와 이름이 안맞을 경우 error
 */
class Data {
    constructor(){
    }
}
class LocalData {
    constructor(path,cb){
        this._path = path;
        this._cb = cb;
    }

    getPath(){
        return this._path;
    }
}
class S3Data{
    constructor(){

    }
}
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
        try{
            this._setDataMap(fieldname,stream);
        }
        catch(error){
            console.error(error);
            
        }
    }
    
    _setBuffer(fieldname,buffer){
        try{
            this._setDataMap(fieldname,buffer);
        }
        catch(error){
            console.error(error);


        }
    }

    _setDataMap(field,value){
       
        if(this.fileMap.has(field)){
            if(typeof value == 'object'){
                
                const localData = this.fileMap.get(field);
                value.pipe(fs.createWriteStream(localData.getPath()));
                localData._cb(null,'ok pipe');
                
            }

            return;
        }
        throw new Error('non exists field name');

    }


    writeS3(filename){
        return this;
    }

    writeLocal(body,cb){
        this.fileMap.set(body.name,new LocalData(body.path,cb));
        return this;

    }

    getBody(){

    }


}
module.exports = FileExtract;