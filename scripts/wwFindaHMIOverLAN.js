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
        var url = "http://" + allAddrs[count] + ":8008/RestDataExchange/service/web/GetAHMIInfo";

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.timeout = 1;
        xmlhttp.open('GET', url, false);

        try { //xmlhttp.open("GET", url, true);
            xmlhttp.send();

            //return xmlhttp.responseText;
            if (xmlhttp.status == 200 || xmlhttp.status == 304) {
                //xmlDoc=xhttp.responseXML;
                //
                postMessage(allAddrs[count]);
                foundOne = true;

                //return true;

                //if(xmlDoc==null)
                //{
                //    xmlDoc=loadXMLDoc(defaultXml);
                //}
            }
        } catch (e) {
            //return false;
            postMessage(url + " not found!");
        }

        if (count == (allAddrs.length - 1)) {
            if (!foundOne)
                postMessage("Searched " + count + " - " + allAddrs.length + ". Not found.");

            self.close();
        }

        count = count + 1;
    }
    setTimeout(checkForaHMI(),200);
}

onmessage = function(event) {
    allAddrs = event.data;
    postMessage("DATA " + allAddrs.length);
};

//checkForaHMI();