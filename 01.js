const express=require('express');
const app = express();
const db=require('./model/db.js')

//获取数据库对应模块	//数据库地址
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

//模板引擎  
const ejs =require('ejs');
app.set('view engine','ejs');

const http=require('http').Server(app);
//引入socket.io模块   在命令行下载socket.io
const io=require('socket.io')(http)

// session
var session = require('express-session')
// 持久化
var NedbStore = require('nedb-session-store')( session );
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{
  	maxAge:200000
  },
  // 配置持久化
  // store: new NedbStore({
  //     filename: 'path_to_nedb_persistence_file.db'
  //   })
}))

// 读取静态资源
app.use(`/public`,express.static('./public/'))


var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//转化id的类型
var ObjectId=require('mongodb').ObjectId


app.use('/form',express.static('./www/form/'))
app.use('/login',express.static('./www/form/'))


//开始页面 
app.get('/boke',(req,res)=>{
	if (req.session.login) {
			db.find('teacher','pros',{},res,(res1)=>{
				/*console.log(res1.length/5)*/
				res.render('list',{list:res1,val:true,user:req.session.user})
			},{time:-1})	
			//time 反序 
	}else{
		//重新定向
		res.redirect('http://localhost:8989/form/login.html')
	} 	
})

//增加
app.post('/addList',urlencodedParser,(req,res)=>{
	var title=req.body.title;
	var cont=req.body.content;
	var date1 =new Date()
	var obj={
		title:title,
		cont:cont,
		time:`${date1.getFullYear()}-${date1.getMonth()+1}-${date1.getDate()}-${date1.getHours()}:${date1.getMinutes()}:${date1.getSeconds()}`
	}
	db.insert('teacher','pros',obj,res,function(a){
		res.send(obj)
		// res.send(a.ops[0])
		// console.log(a.ops[0])
	})
})

//删除
app.use('/delList',urlencodedParser,(req,res)=>{
	var cont=req.body.content;
	var time=req.body.time1;
	console.log(time)
	var obj={
		cont:cont,
		time:time
	}
	console.log('hello')
	db.delete('teacher','pros',obj,res,function(res1){
		console.log(res1)
		res.send(res1)		
	})
})





app.use('/user',urlencodedParser,(req,res)=>{
	var user=req.body.user;
	console.log(user)
	db.find('teacher','teacher',{"name":user},res,function(res1){
		// console.log(res1);
		if(res1.length==0){
			console.log("进入此步")
			res.send({"status":"ok"})
		}
		else{
			res.send({"status":"用户名已存在"})
		}
	})

})
//登录
app.use('/login1',urlencodedParser,(req,res)=>{
	var user=req.body.user1;
	var pass=req.body.pass1;
	console.log(user)
	db.find('teacher','teacher',{"name":user,"password":pass},res,function(res1){
		console.log(res1);
		if(res1.length!=0){		
			req.session.user=req.body.user1;
			req.session.login=true;	
			res.send({"status":"账号密码正确"})
		}else{
			res.send({"status":"密码错误"})
		}
	})

})
//注册数据
app.use('/regit',urlencodedParser,(req,res)=>{
	var user=req.body.user1;
	var pass1=req.body.pass1;
	console.log('hello')
	db.insert('teacher','teacher',{name:user,password:pass1},res,function(){
		res.send({"status":'数据插入成功'})
	})
})





app.listen(8989)