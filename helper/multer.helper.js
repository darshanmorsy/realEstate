const multer = require('multer');
const path = require('path');
const imgpath='/upload/'


var storage = multer.diskStorage({
    
    destination: function (req, file, cb) {

        cb(null, path.join(__dirname, '..', imgpath));

    },
    filename: function (req, file, cb) {

        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + fileExtension);

    }

})


const fileFilter = (req, file, cb) => {
    if (file) {
        cb(null, true);
    } else {  
        cb(null, false);
        return cb(new Error('Not all photo formats are allowed'));
    }
}


const  upload = multer({
    storage: storage,
    limits: { fileSize:1024*1024*20},
    fileFilter: fileFilter
});

module.exports = upload;
