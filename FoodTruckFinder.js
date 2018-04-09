#!/usr/bin/env node
const request = require('request');
const columnify = require('columnify');
var program = require('commander');
const redis = require('redis');
const REDIS_PORT  = process.env.REDIS_PORT;
const client = redis.createClient(REDIS_PORT);

main();

function main(){
    program.option('-i, --integer <n>', 'An integer argument for page num', parseInt)
        .parse(process.argv);
    if(program.integer && program.integer >=0){
        client.setex('pageNum', parseInt((new Date().setHours(23, 59, 59, 999)-new Date())/1000), program.integer, function(){
            getData();
        });
    }else{
        checkPageNumExist();
    }

}

function checkPageNumExist(){
    client.exists('pageNum', function(err, reply) {
        if (reply === 1) {
            getData();
        } else {
            client.setex('pageNum', parseInt((new Date().setHours(23, 59, 59, 999)-new Date())/1000), 0, function(){
                getData();
            });

        }
    });

}

function getData(){
    client.get('pageNum', function(err, data){
        const key = 'foodtruck:' + data;
        console.log('Current Page Num: '+ data);
        client.exists(key, function(err, reply) {
            if (reply === 1) {
                getDataFromCache(key);
            } else {
                getDataFromRemote(key);
            }
        });
    });

}

function getDataFromCache(key){
    client.get(key, function(err, data){
        console.log('getDataFromCache... ');
        var currentPageNum = parseInt(key.split(':')[1]);
        increasePageNum(currentPageNum);
        printResult(data);
    });

}

function getDataFromRemote(key){
    console.log('getDataFromRemote... ');
    var currentPageNum = parseInt(key.split(':')[1]);
    const curDate = new Date();
    const curDayofWeek = curDate.getDay();
    const query = 'SELECT applicant, location WHERE dayorder = ' + curDayofWeek +
        ' ORDER By applicant ASC LIMIT 10 OFFSET '+ currentPageNum * 10;
    const url = 'http://data.sfgov.org/resource/bbb8-hzi6.json?$query='+ query;
    request({
        headers: {
            'Accept': 'application/json',
            'X-App-Token': 'B7uOjiwjqOVJ6wqqOkzh68V8o'
        },
        uri: url,
        method: 'GET'
    }, function (err, res, body) {
        //save data to cache
        client.setex(key, parseInt((new Date().setHours(23, 59, 59, 999)-new Date())/1000), body);
        increasePageNum(currentPageNum);
        printResult(body);
    });
}

function increasePageNum(currentPageNum){
    currentPageNum++;
    client.setex('pageNum', parseInt((new Date().setHours(23, 59, 59, 999)-new Date())/1000), currentPageNum);
}

function printResult(obj){
    var resArr = JSON.parse(obj);
    if(resArr && resArr.length>0){
        console.log(columnify(resArr));
    }else{
        console.log('No more data...');
    }
    process.exit(0);
}


