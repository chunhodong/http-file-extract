const Parser = require('./parser');

class FileExtract{
    parser(req){
        //Parser로 스트림전송
        const parser = new Parser(this,req.headers);
        req.pipe(parser);
    }
}

/*
FileExtract.prototype.emit = (result) => {

}


FileExtract.prototype.writeStorageLocal = (option) => {

}
FileExtract.prototype.writeStorageLocalAsync = (option) => {

}

FileExtract.prototype.writeStorageS3 = (option) => {

}

FileExtract.prototype.writeStorageS3Async = (option) => {

}

FileExtract.prototype.writeBuffer = () => {

}

FileExtract.prototype.readBody = () => {

}*/
module.exports = FileExtract;