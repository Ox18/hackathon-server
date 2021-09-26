
const express = require('express')
const router = express.Router()
const utils = require('../middleware/utils')
var fs = require('fs');
var Path = require('path');
// const { exist } = require('fs')


const showImage = async (req,res) => {
    try {
        var img = req.params.id;
        console.log(img)
        var path = Path.join(__dirname,`/../../public/media/${img}`)
        console.log(path)
        if (fs.existsSync(path)) { 
            res.sendFile(path);
        }else{
            res.status(404).json('File not found')
            
        }
    } catch (error) {
        console.log(error)
        utils.handleError(res, error)
    }
}


router.get(
    '/:id',
    showImage
)

module.exports = router
