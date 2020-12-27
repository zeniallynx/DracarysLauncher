const { getElementsByTagName } = require("custom-electron-titlebar/lib/common/dom");
const electron = require("electron");
const ipc = electron.ipcRenderer;
var request = require('request');
var fs = require('fs');
var http = require("http");

function downloadFile(file_url , targetPath){
    // Save variable to know progress
    var received_bytes = 0;
    var total_bytes = 0;

    var req = request({
        method: 'GET',
        uri: file_url
    });

    var out = fs.createWriteStream(targetPath);
    req.pipe(out);

    req.on('response', function ( data ) {
        // Change the total bytes value to get progress later.
        total_bytes = parseInt(data.headers['content-length' ]);
    });

    req.on('data', function(chunk) {
        // Update the received bytes
        received_bytes += chunk.length;

        showProgress(received_bytes, total_bytes);
    });

    req.on('end', function() {
        //alert("File succesfully downloaded");
        document.getElementById("install").innerHTML = "Installed";
    });
}

function showProgress(received,total){
    var percentage = (received * 100) / total;
    console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
    document.getElementsByClassName('progress-bar').item(0).setAttribute('aria-valuenow',percentage);
    document.getElementsByClassName('progress-bar').item(0).setAttribute('style','width:'+Number(percentage)+'%');
}


function get_json(url, callback) {
    http.get(url, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var response = JSON.parse(body);
            // call function ----v
            callback(response);
        });
    });
}


function downloadAll() {
    get_json("http://cdn.thelynxcompany.ga/package.json", function (resp) {
        for(var j in resp.files) {
            downloadFile(resp.files[j].url, process.env.APPDATA + "\\" + resp.files[j].location);
        }
    });
}


document.getElementById("install").addEventListener('click',(event)=>{
   console.log("installing...");
   document.getElementById("install").innerHTML = "Downloading...";
   document.getElementById("install").disabled = true;
   downloadAll();
   
   //downloadFile("http://cdn.thelynxcompany.ga/files/library/forge-1.16.4-35.1.4-universal.jar", process.env.APPDATA + "\\" + ".minecraft\\forge-1.16.4-35.1.4-universal.jar");
},false);