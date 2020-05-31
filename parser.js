const ReadableStream = require('stream').Readable || require('readable-stream');

function FileStream(opts) {
  if (!(this instanceof FileStream)) return new FileStream(opts);
  ReadableStream.call(this, opts);

  this.truncated = false;
}
inherits(FileStream, ReadableStream);

const _parser = async (headers) => {
  const header = req.headers['content-type'];
  if (!header) {
    throw new Error('non exists content-type');
  }
  if (header.indexOf('multipart/form-data') < 0) {
    throw new Error('non exists multipart/form-data');
  }
  const boundary = header.split('=')[1];
  const dicer = new Dicer({ boundary });
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
      console.log('contype :', contype);
      console.log('fieldname :', fieldname);
      console.log('filename :', filename);
      const fileStream = new FileStream({});
      //const ws = fs.createWriteStream(filename+'.png');

      if (contype) {
        part.on('data', function (data) {
            fileStream.push(data);
        });
        part.on('end', function () {
          console.log('End of part\n');
          //   ws.end();
          //   fsc.push(null);
          //   fsc.pipe(fs.createWriteStream('kim.png'));
        });
      }
      else{
        part.on('data', function (data) {
            console.log('data : ', data.toString());
            //   ws.write(data);
            //   fsc.push(data);
        });
        part.on('end', function () {
            console.log('End of part\n');
            //   ws.end();
            //   fsc.push(null);
            //   fsc.pipe(fs.createWriteStream('kim.png'));
          });
      }
    });
  });
  dicer.on('finish', function () {
    console.log('End of parts');
  });
  req.pipe(d);
  return res.status(200).send({ status: 'ok', message: 'ok', code: '9010' });
};
