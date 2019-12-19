module.exports = (req, res, next) => {
    const fileBase64Code = req.body.fileBase64Code;
    const utilString = ';base64,';
    const indexOfUtilString = fileBase64Code.indexOf(utilString);

    if (~indexOfUtilString) {
        req.body.fileBase64Code = fileBase64Code.slice(indexOfUtilString + utilString.length);
    }

    next();
}