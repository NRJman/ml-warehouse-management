module.exports = (req, res, next) => {
    const fileBase64Code = req.body.fileBase64Code;
    const utilString = ';base64,';
    const indexIfUtilString = fileBase64Code.indexOf(utilString);

    if (~indexIfUtilString) {
        req.body.fileBase64Code = fileBase64Code.slice(+ utilString.length);
    }

    next();
}