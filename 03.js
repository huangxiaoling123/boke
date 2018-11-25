//引入服务器模块
const express=require('express');
const app=express();
//获取数据库对应模块	//数据库地址
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
//引用文件
const db=require('./model/db.js')
//模板引擎  
const ejs =require('ejs');
app.set('view engine','ejs');

// 读取静态资源
app.use(`/public`,express.static('./public/'))

var num=0;
// post
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//转化id的类型
var ObjectId=require('mongodb').ObjectId


//开始页面 
app.get('/',(req,res)=>{
	db.find('teacher','pros',{},res,(res1)=>{
/*		console.log(res1.length/5)*/
		res.render('list',{list:res1,val:true})
	},{time:-1})	
	//time 反序  	
})

//增加
app.post('/addList',urlencodedParser,(req,res)=>{
	var title=req.body.title;
	var cont=req.body.content;
	var date1 =new Date()
	// num+=num;
	var obj={
		title:title,
		cont:cont,
		time:`${date1.getFullYear()}年${date1.getMonth()+1}月${date1.getDate()}日${date1.getHours()}时`
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

app.listen(8989)