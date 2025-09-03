const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req,file, cb) => {
        const allowedfiletypes = ['image/jpg','image/png','image.jpeg']
        if(!allowedfiletypes.includes(file.mimetype)){
            cb(new Error('invalid file types'));
            return 
        }
        cb(null, './storage');
    },
    filename: (req,file, cb) => {
        cb(null,Date.now() + "-" + file.originalname)
    }

})
module.exports = {
    multer,
    storage
}