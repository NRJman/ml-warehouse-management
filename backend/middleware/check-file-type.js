const toUint8Array = require('base64-to-uint8array');
const getFileType = require('file-type');
const MIME_TYPES_MAP = {
    'image/png': 'png',
    'image/gif': 'gif',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg'
};

module.exports = (req, res, next) => {
    const pureFileBase64Code = req.body.fileBase64Code;
    const uint8Array = toUint8Array(pureFileBase64Code);
    console.log(uint8Array);
    const fileType = getFileType(uint8Array);
    console.log(fileType);
    const fileMimeType = fileType.mime;


    if (!Object(MIME_TYPES_MAP).keys.includes(fileMimeType) ||
        fileType.ext !== MIME_TYPES_MAP[fileMimeType]) {

        res.status(400).json({
            message: 'Invalid file type!'
        });
    }

    next();
};
