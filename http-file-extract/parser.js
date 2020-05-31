const ReadableStream = require('stream').Readable || require('readable-stream');
const Dicer = require('dicer');

function FileStream(opts) {
  if (!(this instanceof FileStream)) return new FileStream(opts);
  ReadableStream.call(this, opts);

  this.truncated = false;
}
inherits(FileStream, ReadableStream);


function Parser(header){

    
    const header = req.headers['content-type'];
    if (!header) {
      throw new Error('non exists content-type');
    }
    if (header.indexOf('multipart/form-data') < 0) {
      throw new Error('non exists multipart/form-data');
    }
    const boundary = header.split('=')[1];
    this.dicer = new Dicer({ boundary });
    dicer.on('part', function (part) {
      console.log('New part! : ');
  
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
        
      
        if (contype) {
          const fileStream = new FileStream({});
          part.on('data', function (data) {
              fileStream.push(data);
          });
          part.on('end', function () {
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
      //emit
    });


}

Parser.prototype._write = (chunk) =>{
    this.dicer.write(chunk);
}

module.exports = Parser;





