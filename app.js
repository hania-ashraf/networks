var bodyParser = require('body-parser')
var session = require('express-session')
var port = process.env.PORT || 3000
const fs = require('fs')
var express = require('express');
var path = require('path');
const { ppid } = require('process');
const { json } = require('express');
const { get } = require('http');
var app = express();

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views') )
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({secret: 'shush',resave:false,saveUninitialized:false}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public'))); //images and videos! their directory where to find images and videos 

 
app.get('/home', function(req,res){
  res.render('home');



});

app.post('/home', function(req,res){
   

});
app.get('/registration',function(req,res) {
  res.render('registration');
});

function checkregistration(user,file){
  for(let i =0 ;i<file.length;i++){
      if((file[i].username==user.username )) {
          return true
      }
  }
  return false
}
function checklogin(user,file){
  for(let i =0 ;i<file.length;i++){
      if((file[i].username==user.username && file[i].password==user.password )) {
          return true
      }
  }
  return false
}
app.get('/', function(req,res)
{
  res.render('login');

});

app.post('/register',function(req,res)
{
  var input={
    username:req.body.username,
    password: req.body.password,
    wanttoreadlist:[]  
  }


  
    var x= fs.readFileSync('database.json')
    var array=JSON.parse(x)
    var check= checkregistration(input,array)
    var i=0 
    if(check)
      {
        
        res.render('errormessage')
      }

      else
      {
   
      array.push(input)
      fs.writeFileSync('database.json',JSON.stringify(array))
      res.render('home')
      }
  
});
app.post('/', function(req,res){
  var input={
    username:req.body.username,
    password: req.body.password,
    wanttoreadlist:[]

  }
var database= fs.readFileSync('database.json')
if(input.username=='' || input.password=='')

{
  res.render('incorrectdata'); //make it in the registration, use alert or any error message technique 
}
else 
{
var bool= checklogin(input,JSON.parse(database))
  if(bool== true)
  {
     req.session.name = input.username
      res.render('home');
  }
    else{
      res.render('incorrectpassword') //error message, wrong password or username 
      
  }
}
});
app.get('/novel',function(req,res){
 res.render('novel')
});
app.get('/poetry',function(req,res){
  res.render('poetry')
 });
 app.get('/fiction',function(req,res){
  res.render('fiction')
 });

 app.get('/flies',function(req,res){
  res.render('flies')
 });


 app.post('/flies',function(req,res){
   res.render('readlist')
 });



 app.get('/grapes',function(req,res){
  res.render('grapes')
 });


 app.post('grapes',function(req,res){
  res.render('readlist')
});
 app.get('/leaves',function(req,res){
  res.render('leaves')
 });

 app.post('leaves',function(req,res){
  res.render('readlist')
});
 app.get('/sun',function(req,res){
  res.render('sun')
 });

 app.post('sun',function(req,res){
 
});
 app.get('/dune',function(req,res){
  res.render('dune')
 });

 app.post('/dune',function(req,res){
  res.render('readlist')
   
});
 app.get('/mockingbird',function(req,res){
  res.render('mockingbird')
 });


 app.post('mockingbird',function(req,res){
  res.render('readlist')
});




  function checkreadlist(user,file,book)
{
   for(let i=0; i<file.length;i++)
   { 
     if(file[i].username==user){
     for(let j=0; j<file[i].wanttoreadlist.length;j++)
     {
      if(file[i].wanttoreadlist[j]==book)
      {
        return true;
      }
      
     }
    }
   }
  return false;
}
 
 

app.post('/readlist',function(req,res){

  var read= fs.readFileSync('database.JSON')
   var check =checkreadlist(req.session.name,JSON.parse(read),req.body.page);
   console.log(req.body.page);
   console.log(check);
   var read1= JSON.parse(read)

   if(check)
   {
      res.render('bookexists.ejs')
   }
   else
   {
     for( let i=0; i<read1.length;i++)
       {
         
         if(read1[i].username==req.session.name)
         {

          read1[i].wanttoreadlist.push(req.body.page);
          console.log(read1[i].wanttoreadlist);
          fs.writeFileSync('database.json',JSON.stringify(read1)); 
          res.redirect('readlist');
         
           }
          
         }
        }       
} );


 



app.get('/readlist',function(req,res){
  var x=fs.readFileSync('database.json')
var y=JSON.parse(x)
var list=[]
for(let i=0;i<y.length;i++){
  if(req.session.name==y[i].username){
    list=y[i].wanttoreadlist
  }

}
var books= [{name: 'Lord of the flies',page:'flies'}, {name: 'Dune',page: 'dune'}, {name:'The Grapes of Wrath',page: 'grapes'},{name:'Leaves of Grass',page:'leaves'},{name:'The Sun and Her Flowers',page:'sun'}, {name:'To Kill a Mocking bird',page:'mockingbird'}];

var array=[];
for(let j=0;j<list.length;j++){
for(let i=0;i<books.length;i++){
  var name=books[i].name;
  var z= name.toLowerCase();
 var input= list[j];
 var s= input.toLowerCase();
 if(z.includes(s)){
   array.push( books[i]);
 

 }
}}
if(array.length==0){
  res.render('notexists');

}
else{
  console.log('allooo');
 res.render('readlist', {books:array});
}

 });
      

  




app.post('/search',function(req,res)
{
 var books= [{name: 'Lord of the flies',page:'flies'}, {name: 'Dune',page: 'dune'}, {name:'The Grapes of Wrath',page: 'grapes'},{name:'Leaves of Grass',page:'leaves'},{name:'The Sun and Her Flowers',page:'sun'}, {name:'To Kill a Mocking bird',page:'mockingbird'}];

var array=[];
for(let i=0;i<books.length;i++){
  var name=books[i].name;
  var x= name.toLowerCase();
 var input= req.body.Search;
 var y= input.toLowerCase();
 if(x.includes(y)){
   array.push( books[i]);
 

 }

}
if(array.length==0){
  res.render('notexists');

}
else{
  console.log(array);
 res.render('searchresults', {books:array});
}
});





if(process.env.PORT){
  app.listen(process.env.PORT,function()
  
   {console.log("server started")});
  }
  else{
    app.listen(3000,function()
  
    {console.log("server started")});

  }
 












