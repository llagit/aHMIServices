/**
 * Created by ltarozz1 on 07/05/2015.
 */

var allAddrs = [];
var count = 0;
var foundOne = false;

function checkAddress(ip) {

    var url = "http://" + ip + ":8008/RestDataExchange/service/web/GetAHMIInfo";

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.timeout = 1;
    xmlhttp.open('GET', url, false);

    try { //xmlhttp.open("GET", url, true);
        xmlhttp.send();

        //return xmlhttp.responseText;
        if (xmlhttp.status == 200 || xmlhttp.status == 304) {
            //xmlDoc=xhttp.responseXML;

            return true;

            //if(xmlDoc==null)
            //{
            //    xmlDoc=loadXMLDoc(defaultXml);
            //}
        }
    } catch (e) {
        return false;
        //postMessage(url + " not found!");
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

            //postMessage(ip);
        }
        //getClientIPs()
    }

    //var res = checkAddress(allAddrs[count]);
    //postMessage(res);

    if(checkAddress(allAddrs[count])){
        postMessage("Found aHMI at " + allAddrs[count] + " !");
        foundOne = true;

    }

    if(count == (allAddrs.length - 1)){
        if(!foundOne)
            postMessage("Searched " + count + " - " + allAddrs.length + ". Not found.");

        self.close();
    }

    count = count +1;

    setTimeout("getaHMIIPs()",20);
}

//self.onmessage = function(event) {
//    document.getElementById("messages").innerHTML = "Found aHMI IP: " + event.data;
//
//};

getaHMIIPs();