var express = require('express');
var router = express.Router();

const crudController = require('../app/controllers/crud-controller');

/* GET home page. */
router.get('/get', crudController.getData);
router.get('/get/:id',crudController.getSingle)
router.post('/post',crudController.postData);
router.put('/update/:id',crudController.updateData);
router.delete('/delete/:id',crudController.deleteData);

module.exports = router;
