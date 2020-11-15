const express = require("express");  
const bodyParser = require("body-parser");  
const fs = require("fs");
const cookieParser = require('cookie-parser');
const app = express();  
//var md5 = require('md5');
const saltedSha256 = require('salted-sha256');


app.use(bodyParser.urlencoded({ extended:  false  }));  
app.use(bodyParser.json()); 
app.use(cookieParser()); 

var userInfo = [
    {uname : 'eunkyo', pwd : '123123' , youtubeAddr : 'https://www.youtube.com/embed/VOAfJbsluTg'},
    {uname : 'gildoung', pwd : '123', youtubeAddr : ''}

]


var sessions = {}



app.get('/',function (req,res) {  
    

    var name = 'guest';
    var youtubeAddr = 'https://www.youtube.com/embed/v64KOxKVLVg';

    if(req.cookies.uname){
        name = req.cookies.uname;
        const targetsession = req.cookies.loginInfo;
        console.log('target :' , targetsession)
        
        console.log(sessions[name])
        if (sessions[name] == targetsession) {
            console.log('session')
            userInfo.forEach(element => {
                if (element.uname == name) {
                    youtubeAddr = element.youtubeAddr;
                    console.log('element.youtubeAddr : ', element.youtubeAddr);
                }

            })
        }


    }
       

    fs.readFile(__dirname + '/view/index.html', 'UTF-8',
         (err, data) => {
            var conv_data = data.replace(/#name#/g, name).replace(/#youtubeAddr#/g, youtubeAddr);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(conv_data);
            res.end();
        }
    )

 
});  

var userCount = 0;
var salt = '%$#$%$#'


app.get('/userinfo',function (req,res) {  

    const inputnuame = req.query.uname;
    const inputpwd = req.query.pwd;

    userInfo.forEach(element =>{
        if(inputnuame == element.uname && inputpwd == element.pwd){
            //creatSession & save

            userCount++;
            const session = saltedSha256(userCount,salt);
            sessions[inputnuame] =  session;

            res.cookie('uname',inputnuame,{
                maxAge:1000000
            });
            res.cookie('loginInfo',session,{
                maxAge:10000
            });
        }
    } )

    res.redirect('/');  
});
//removecookie
app.get('/removecookie',function (req,res) {  
    console.log('removecookie')
    res.clearCookie('uname');
    res.clearCookie('loginInfo');
    res.redirect('/');  
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});