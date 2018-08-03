const initializationOptions = {
    error(err,e) {
        if(e.cn) console.log('connection error',error.message);
        if(e.query){
            console.log('query wahala',e.query);
            if(e.params) console.log('params wahala',e.params);
        }
        if(e.ctx) console.log('transaction wahala',e.ctx);

    }
}
const pgp = require('pg-promise')(initializationOptions);
const connectionString = process.env.DATABASE_URL;

const db = pgp(connectionString);

db.connect()
    .then(obj=>{
        console.log('success!!!');
        obj.done();
    })
    .catch(err=>{
        console.log('error');
    })

module.exports = {
    getData : (req,res)=>{
        db.any('SELECT * FROM user')
          .then(data=>{
              console.log('get all the data',data);
              return res.status(200).json(data);
          })
          .catch(err=>{
              return res.status(501).json(err);
          })
    },
    getSingle : (req,res)=>{
        const userID = parseInt(req.params.id);
        db.one('SELECT * FROM user WHERE id = $1',userID)
            .then(data=>{
                console.log('single data',data);
                return res.status(200).json(data);
            })
            .catch(err=>{
                return res.status(501).json(err);
            })
    },
    postData: (req,res) =>{
        req.body.age = parseInt(req.body.age);
        db.none(`insert into user(name,age,address,sex)' + 
                'values(${name},${age},${address},${sex})`,req.body)
            .then(success=>{
                res.status(200).send('Success!');
            })
            .catch(err=>{
                res.status(501).send('error');
            })
    },
    updateData: (req,res) =>{
        db.none('update user')
    },
    deleteData: (req,res) =>{

    }
}