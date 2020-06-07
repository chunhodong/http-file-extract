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

let dicer;
function Parser (extracter,headers)  {
  
    WritableStream.call(this);

    this._extracter = extracter;
    
    //헤더값 추출
    const header = headers['content-type'];
    if (!header) {
      throw new Error('non exists content-type');
    }

    if (header.indexOf('multipart/form-data') < 0) {
      throw new Error('non exists multipart/form-data');
    }

    //파일구분하는 boundary값 추출
    const boundary = header.split('=')[1];
    
    dicer = new Dicer({ boundary });

    //파일을 part 단위로 추출
    dicer.on('part', function (part) {
  
      let contype;
      let filename;
      let fieldname;
      part.on('header', function (header) {
        contype = header['content-type'];
        const disposition = header['content-disposition'][0].split(';');
        fieldname = disposition[1].trim();
  
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
              console.log('filename : ',filename);
              fileStream.push(null);
  
          });
        }
        else{
          let buffer;
          part.on('data', function (data) {

              buffer += data.toString();

          });
          part.on('end', function () {
              console.log('End of part\n');
            });
        }
      });
    });
    dicer.on('finish', function () {
      console.log('End of parts');
    });


}
inherits(Parser, WritableStream);

Parser.prototype._write = (chunk) =>{
  dicer.write(chunk);
}

module.exports = Parser;





