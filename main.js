#!/usr/bin/env node

var request = require('request');
var fs = require('fs');

console.log("NodeJs程序执行");

var arguments = process.argv.splice(2);

var corpid ;
var secret ;
var agentid ;
var id;
//天天基金api
var api = 'http://fundgz.1234567.com.cn/js/';
var api_png = 'http://j4.dfcfw.com/charts/pic6/';
//企业微信api
var getToken = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken';
var push_link = "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=";

if(arguments.length==0){
    corpid = fs.readFileSync(__dirname + '/Config/CORPID', 'utf-8'); 
    secret = fs.readFileSync(__dirname + '/Config/SECRET', 'utf-8');
    agentid = fs.readFileSync(__dirname + '/Config/AGENTID', 'utf-8');
    id = fs.readFileSync(__dirname + '/Config/ID', 'utf-8');
    console.log("数据读取成功");
} else {
    corpid = arguments[0]; 
    secret = arguments[1]; 
    agentid = arguments[2]; 
    id = arguments[3]; 
    console.log("数据接收成功");
}
//console.log(id);

function WeChatPush(msg){
    request(getToken + "?corpid="+corpid+"&corpsecret="+secret, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body); 
            var json = JSON.parse(body);
            var token = json['access_token'];

            console.log('token获取成功');
 
            //post方式请求
            var requestData = {
                'touser': '@all',
                'msgtype': 'text',
                'agentid': parseInt(agentid),
                'text': {
                    'content': msg 
                }
            };
            request({
                url: push_link + token,
                method: 'post',
                json: true,
                headers: {
                    'content-type': 'application/json',
                    'Content-type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(requestData)
            }, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body); // 请求成功的处理逻辑
                } else {
                    console.log("通知发送失败"); 
                }
            });
        } else {
            console.log('获取token失败')
        }
    });
}

var bool ; 
do {
    var tmp;
    if(id.indexOf(',')==-1){
        tmp = id;
        bool = false;
    } else {
        tmp = id.substring(0,id.indexOf(','));
       id = id.substring(id.indexOf(',')+1);
        bool = true;
    }
    //console.log("id="+tmp);
    request(api + tmp + '.js?rt=' + (Math.round(new Date().getTime()/1000)), function(error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body); 
            var msg;
            if(body.indexOf('jsonpgz')!= -1){
                var data = body.substring('jsonpgz('.length,body.indexOf(');'));
                var json = JSON.parse(data);
                var name = json['name'];
                var jijin_type = json['gszzl'];
                var jijin_id = json['fundcode'];
                var time = json['gztime'];
                //console.log(data);
                if(name.indexOf('(')!= -1){
                    name = name.replace('(','（');
                }
                if(name.indexOf(')')!= -1){
                    name = name.replace(')','）');
                }
                //console.log('基金名称：'+name);
                //console.log('估算涨幅：'+jijin_type);
                //console.log('预览：'+api_png+jijin_id+'.png');
                //console.log('时间：'+time)

                //console.log('\n\n')

                msg = '名称：'+name+'\n'
                    +'<a href="'+api_png+jijin_id+'.png'+'">估算涨幅：'+jijin_type+'</a>\n'
                    //+'预览：'+api_png+jijin_id+'.png'+'\n'
                    +'时间：'+time;
            } else {
                //console.log('基金id：'+tmp+'\n当前基金天天基金api不支持查询');
                msg = '基金id：'+tmp+'\n当前基金天天基金api不支持查询';
            }
            WeChatPush(msg);
        } else {
            var text = '基金id：'+tmp+'\n当前基金天天基金api不支持查询';
            //console.log(text);
            WeChatPush(text)
        }
    });

} while (bool);


var url = 'http://quan.suning.com/getSysTime.do';
request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        //console.log(body); 
        var json = JSON.parse(body); 
        var time = json['sysTime2'];
        var text = '查询完成\n当前时间：\n'+time;
        WeChatPush(text)
    } else {
        console.log("网络时间获取失败");
    }
});