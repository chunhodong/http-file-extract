const ReadableStream = require('stream').Readable || require('readable-stream');
const WritableStream = require('stream').Writable || require('readable-stream');

const Dicer = require('dicer');
inherits = require('util').inherits;

function FileStream (opts) {
  if (!(this instanceof FileStream)) return new FileStream(opts);
  ReadableStream.call(this, opts);

  this.truncated = false;
}
inherits(FileStream, ReadableStream);
console.log('@@@parser.js');
class Parser extends WritableStream {
  constructor(extracter,headers){
    super();
    this._extracter = extracter;
    this._headers = headers;

     //헤더값 추출
     if (!this._headers['content-type']) {
       throw new Error('non exists content-type');
     }
     if (this._headers['content-type'].indexOf('multipart/form-data') < 0) {
       throw new Error('non exists multipart/form-data');
     }
     //파일구분하는 boundary값 추출
     const boundary = this._headers['content-type'].split('=')[1];
     console.log('boundray : ',boundary);
     this.dicer = new Dicer({ boundary });
 
     //파일을 part 단위로 추출
     this.dicer
     .on('drain',function(){
       console.log('drain$$');
     })
     .on('part', function onPart(part) {
       let contype;
       let filename;
       let fieldname;
       part.on('header', function (header) {
               console.log('part!!!! : ',part);
 
         contype = header['content-type'];
         const disposition = header['content-disposition'][0].split(';');
         fieldname = disposition[1].trim();
   
         if (contype) {
           filename = disposition[2].trim();
         }
         
         //multipart에서 바이너리데이터 추출
         if (contype) {
           //const fileStream = new FileStream({});
           part.on('data', function (data) {
             //fileStream.push(data);
           });
           part.on('end', function () {
             //fileStream.push(null);
             console.log('fieldname : ',fieldname);
             //extracter.setStream(fieldname,fileStream);
   
           });
         }
         else{
           let buffer;
           part.on('data', function (data) {
 
               buffer += data.toString();
 
           });
           part.on('end', function () {
               console.log('fieldname : ',fieldname);
               console.log('field value : ',buffer);
               
             });
         }
       });
     })
     .on('finish', function () {
       console.log('End of parts');
     });
  }

  _write(chunk){
    this.dicer.write(chunk);
  }

    
   


}


module.exports = Parser;





