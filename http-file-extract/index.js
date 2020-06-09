const Parser = require('./parser');

/**
 * @description multipart file parsing project
 * 기존에 업로드에 사용하는 multer library의 구조적제약 개선
 * 1. middleware에서만 쓰일수 있음
 * 2. 파일별처리 불가 ( a.png 는 s3, b.png는 disk)
 * 3. front와 back에서 속성개수와 이름이 안맞을 경우 error
 */
class MultipartStructure{



}
class FileExtract{
    constructor(){
        this.fileSet = new Map();
        
    }

    parser(req){
        //Parser로 스트림전송
        console.log('parse call');
        
        const parser = new Parser(this,req.headers,req);
        req.pipe(parser);

    }

    setStream(fieldname,stream){
       // console.log('get stream : ',stream);
        if(this.fileSet.has(fieldname)){
            
        }
        else{
            this.fileSet.set('')

        }
    }
    
    
    setBuffer(fieldname,buffer){

    }


    writeS3(filename){

    }

    writeLocal(){

    }

    getBody(){

    }


}
module.exports = FileExtract;