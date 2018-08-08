const redis = require('redis');

const client = redis.createClient();

client.on('error',(err)=>{
    console.log("error",err);
    return err;
})

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
        db.any('SELECT * FROM data')
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

        client.get(userID,(error,result)=>{
            if(result){
                res.send({"user data": JSON.parse(result),"source":"redis-cache"});
            }else{
                db.one('SELECT * FROM data WHERE id = $1',userID)
                .then(data=>{
                    console.log('single data',data);
                    //cache it
                    client.setex(userID,60,JSON.stringify(data));
                    //return result
                    return res.status(200).json(data);
                })
                .catch(err=>{
                    return res.status(501).json(err);
                })
            }
        })

       
    },
    postData: (req,res) =>{
        console.log(req.body.firstName,req.body.age,req.body.address,req.body.sex,'name');
        req.body.age = parseInt(req.body.age);
        db.none("INSERT INTO data (name,age,address,sex)" + "VALUES($1,$2,$3,$4)",[req.body.firstName,req.body.age,req.body.address,req.body.sex]) 
            .then(success=>{

                res.status(200).send('Success!');
            })
            .catch(err=>{
                res.status(501).send('error');
            })
    },
    updateData: (req,res) =>{

        db.none('update data set name=$1, age=$2, address=$3, sex=$4 where id=$5',
        [req.body.name, parseInt(req.body.age), req.body.address, req.body.sex,parseInt(req.params.id)])
        .then(response=>{
            console.log('response update',response);
            return res.status(200).json('This users data has been updated successfully');
        })
        .catch(err=>{
            return res.status(401).json('Invalid Input!');
        });
    },
    deleteData: (req,res) =>{
        let userID = parseInt(req.params.id);
        db.result('delete from data where id=$1',userID)
        .then(result=>{
            console.log('This user has been deleted!',result);
            res.status(200).json('success!!!');
        })
        .catch(error=>{
            res.status(401).json('error!');
        });
    }
}