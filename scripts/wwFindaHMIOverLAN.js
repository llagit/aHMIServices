/**
 * Created by ltarozz1 on 07/05/2015.
 */
var allAddrs = [];
var count = 0;
var foundOne = false;

function checkForaHMI(){

    //xmlhttp.onreadystatechange = function() {
    //    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //        return true;
    //    }else return false;
    //
    //};

    if (allAddrs.length > 0 ) {

        //postMessage("started with " + allAddrs.length);

        //if(allAddrs[count] == "10.11.22.71")
        //    var l = 2;


        var url = "http://" + allAddrs[count] + ":8008/RestDataExchange/service/web/GetAHMIInfo";
        //var url = "http://10.11.22.71:8008/RestDataExchange/service/web/GetAHMIInfo";

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.timeout = 20;
        xmlhttp.open('GET', url, false);

        try { //xmlhttp.open("GET", url, true);
            xmlhttp.send('');


            if(xmlhttp.readyState < 4) {
                foundOne = false;
            }

            if(xmlhttp.status !== 200) {
                foundOne = false;
            }

            // all is well
            if(xmlhttp.readyState === 4) {
                postMessage(allAddrs[count]);
                foundOne = true;

            }

            //return xmlhttp.responseText;
            //if (xmlhttp.status == 200 || xmlhttp.status == 304) {
                //xmlDoc=xhttp.responseXML;
                //
                //postMessage(allAddrs[count]);
                //foundOne = true;

                //return true;

                //if(xmlDoc==null)
                //{
                //    xmlDoc=loadXMLDoc(defaultXml);
                //}
            //}
        } catch (e) {
            //return false;
            //postMessage(url + " not found!");
        }

        if (count == (allAddrs.length - 1)) {
            if (!foundOne)
                postMessage("Not found.");

            //postMessage("Searched " + count + " - " + allAddrs.length + ". Not found.");

            self.close();
        }

        count = count + 1;
    }
    //postMessage("check");
    setTimeout("checkForaHMI()",20);
}

self.onmessage = function(event) {


    //postMessage("DATA " + event.data);

    allAddrs = JSON.parse(event.data);

    checkForaHMI();
};

//checkForaHMI();