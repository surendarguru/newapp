const exp=require("express")
const app=exp();
const path=require("path")
const mc=require("mongodb").MongoClient

require("dotenv").config()
app.use(exp.static(path.join(__dirname,"./dist/project")))

//import the apis
const userApiObj=require("./APIS/userapi")
const notesApiObj=require("./APIS/notesapi")


app.use("/user",userApiObj)
app.use("/notes",notesApiObj)


const dburl=process.env.dburl
mc.connect(dburl,{useNewUrlParser:true,useUnifiedTopology:true})
.then(client=>{
    //get database
    const databaseObj=client.db("keep")
    const userCollectionObj=databaseObj.collection("usercollection")
    const notesCollectionObj=databaseObj.collection("notescollection")
   

    //sharing collection object

    app.set("userCollectionObj",userCollectionObj)
    app.set("notesCollectionObj",notesCollectionObj)
   

    console.log("db server is on")
})
.catch(err=>console.log("err in db",err))

app.use((req,res,next)=>{
    res.send({message:`${req.url} is invalid`});
})

app.use((err,req,res,next)=>{
    res.send({message:"error occurred",reason:err.message})
})


app.listen(process.env.port,()=>console.log("server is on",process.env.port));