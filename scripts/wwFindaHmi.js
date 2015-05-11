/**
 * Created by ltarozz1 on 07/05/2015.
 */

var allAddrs = [];
var count = 0;
var foundOne = false;

function checkAddress(ip) {

    var url = "http://" + ip + ":8008/RestDataExchange/service/web/GetAHMIInfo";

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.timeout = 20;
    xmlhttp.open('GET', url, false);

    try {

        xmlhttp.send('');

        if(xmlhttp.readyState < 4) {
            return false;
        }

        if(xmlhttp.status !== 200) {
            return false;
        }

        if(xmlhttp.readyState === 4) {
            return true;
        }

    } catch (e) {
        return false;
    }
}

function getaHMIIPs()
{

    if(count==0){
        var i = 0;
        var initIP = "10.11.44";
        for (i = 0; i < 255; i++) {
            var ip = initIP + '.' + i;
            allAddrs.push(ip);
        }
    }

    //var res = checkAddress(allAddrs[count]);
    //postMessage(res);

    if(checkAddress(allAddrs[count])){
        postMessage(allAddrs[count]);

        foundOne = true;

    }

    if(count == (allAddrs.length - 1)){
        if(!foundOne)
            postMessage("Not found.");

        self.close();
    }

    count = count +1;

    setTimeout("getaHMIIPs()",20);
}

getaHMIIPs();