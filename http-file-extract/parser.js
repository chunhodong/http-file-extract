const ReadableStream = require('stream').Readable || require('readable-stream');
const WritableStream = require('stream').Writable || require('readable-stream');

const Dicer = require('../node_modules/dicer');
inherits = require('util').inherits;

class FileStream  extends ReadableStream{
  constructor(){
    super();
  }
  _read(){
    
  }
}
class Parser extends WritableStream {
  constructor(extracter,headers,req){
    super();
    this._extracter = extracter;
    this._headers = headers;
    this.limits = headers.limit;
    this.req = req;
     //헤더값 추출
     if (!this._headers['content-type']) {
       throw new Error('non exists content-type');
     }
     if (this._headers['content-type'].indexOf('multipart/form-data') < 0) {
       throw new Error('non exists multipart/form-data');
     }
     //파일구분하는 boundary값 추출
     const boundary = this._headers['content-type'].split('=')[1];
     var parserCfg = {
      boundary: boundary,
      maxHeaderPairs: (this.limits && this.limits.headerPairs)
    };
     this.dicer = new Dicer(parserCfg);
     //파일을 part 단위로 추출
     this.dicer
     .on('drain',function(){
     })
     .on('part', function onPart(part) {
       let contype;
       let filename;
       let fieldname;
       part.on('header', function (header) { 
         contype = header['content-type'];
         const disposition = header['content-disposition'][0].split(';');
         fieldname = disposition[1].split('=')[1].replace(/\"/gi, "").trim();
         
         if (contype) {
           filename = disposition[2].trim();
         }
         
         //multipart에서 바이너리데이터 추출
         if (contype) {
           const fileStream = new FileStream({});
           part.on('data', function (data) {
             fileStream.push(data);
           });
           part.on('end', function () {
             fileStream.push(null);
             extracter._setStream(fieldname,fileStream);
   
           });
         }
         else{
           let buffer = '';
           part.on('data', function (data) {
               buffer += data.toString();
           });
           part.on('end', function () {
             extracter._setBuffer(fieldname,buffer);
            });
         }
       });
     })
     .on('finish', function () {
       console.log('End of parts');
     });

  }

  
  _write(chunk, encoding, cb){
    console.log('ok write : ',cb);
    this.dicer.write(chunk);
    cb();

  }

    
   


}


module.exports = Parser;





