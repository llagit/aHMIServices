var allAddrs = [];
var myIP=[];
var workerFindaHMIDefault;
var workerFindaHMIOnLAN;
var line;
var localIPAddressesInfo;

window.onload = function (){

    line = new ProgressBar.Line("#pgContainer",{ color: '#D70932', strokeWidth: 3});

    getClientIPs();

    startWorker();

};

function AddTextInfoOnContentTagAndHideAddAddress(text){

    document.getElementById("setAddr").classList.toggle("collapsed");

    var title = document.getElementById("Content").firstElementChild;

    if(title.id == "TextInfo"){
        title.parentNode.removeChild(title);
    }

    title = document.createElement("H2");
    title.id = "TextInfo";

    var messText = document.createTextNode(text); //"Searching in detected network..."
    title.appendChild(messText);


    document.getElementById("Content").insertBefore(title,document.getElementById("mainPgContainer"));

}


function RemoveTextInfoOnContentTagAndShowAddAddress(){



    document.getElementById("Content").removeChild(document.getElementById("TextInfo"));

    //var title = document.getElementById("Content").firstElementChild;
    //if(title.id != "TextInfo")
    //    return;
    //else
    //    title.parentNode.removeChild(title);


    document.getElementById("setAddr").classList.toggle("collapsed");

}

function checkForaHMIOnGivenIP(IP){

    var url = "http://" + IP + ":8008/RestDataExchange/service/web/GetAHMIInfo";

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, true);


    xmlhttp.onreadystatechange = ( function(x, i) {
        return function() {
            if (x.readyState == 4) {
                if (x.status == 200) {
                    getAHMIInfo(i);
                }
                //else alert("Not found!");
            }

        }
    })(xmlhttp, IP);

    //xmlhttp.onreadystatechange = function() {
    //    if (xmlhttp.readyState == 4) {
    //        if (xmlhttp.status == 200) {
    //            getAHMIInfo("localhost");
    //        } else
    //            alert("Not found!");
    //    }
    //
    //};

    try { //xmlhttp.open("GET", url, true);
        xmlhttp.send('');

        //
        //if(xmlhttp.readyState < 4) {
        //    return false;
        //}
        //
        //if(xmlhttp.status !== 200) {
        //    return false;
        //}
        //
        //// all is well
        //if(xmlhttp.readyState === 4) {
        //    return true;
        //
        //}

        //return xmlhttp.responseText;
        //if (xmlhttp.status == 200 || xmlhttp.status == 304) {
        //xmlDoc=xhttp.responseXML;

        //return true;

    } catch (e) {
        return false;
    }

}


function startWorker() {


    if(typeof(Worker) !== "undefined") {
        if(typeof(workerFindaHMIDefault) == "undefined") {
            workerFindaHMIDefault = new Worker("scripts/wwFindaHmi.js");

            AddTextInfoOnContentTagAndHideAddAddress("Searching in known ip list...");

            document.getElementById("mainPgContainer").classList.remove("collapsed");



        }
        workerFindaHMIDefault.onmessage = function(event) {
            var ans = event.data.split('|')[0];
            var val = event.data.split('|')[1];
            switch (ans){
                case "step":
                    line.animate(Number(val)/event.data.split('|')[2]);
                    break;
                case "Not found.":
                    RemoveTextInfoOnContentTagAndShowAddAddress();
                    document.getElementById("messages").innerHTML = "aHMI not found on know IP addresses...";
                    document.getElementById("mainPgContainer").classList.add("collapsed");
                    break;
                case "IP":
                    RemoveTextInfoOnContentTagAndShowAddAddress();
                    document.getElementById("mainPgContainer").classList.add("collapsed");
                    if(myIP.indexOf(val) == -1)
                        myIP.push(val);
                    getAHMIInfo(val);
                    break;
            }


        };
    } else {
        //document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Workers...";
    }
}

function stopWorker() {
    workerFindaHMIDefault.terminate();
    workerFindaHMIDefault = undefined;
}

function checkForaHMI(){


    if(typeof(Worker) !== "undefined") {
        if(typeof(workerFindaHMIOnLAN) == "undefined") {
            workerFindaHMIOnLAN = new Worker('scripts/wwFindaHMIOverLAN.js');

            AddTextInfoOnContentTagAndHideAddAddress("Searching in detected network (local ip found: " + localIPAddressesInfo + ")...");

            //var pgContainer = document.createElement("DIV");
            //pgContainer.id = "mainPgContainer";
            //var pg = document.createElement("DIV");
            //pg.id = "pgContainer";
            //pgContainer.appendChild(pg);
            //pgContainer.classList.add("progressbar");
            //pgContainer.className = "progressbar";

            document.getElementById("mainPgContainer").classList.remove("collapsed");
            line.set(0);

        }

        workerFindaHMIOnLAN.onmessage = function(event) {
            var ans = event.data.split('|')[0];
            var val = event.data.split('|')[1];
            switch (ans){
                case "step":
                    line.animate(Number(val)/allAddrs.length);
                    break;
                case "Not found.":
                    RemoveTextInfoOnContentTagAndShowAddAddress();
                    document.getElementById("mainPgContainer").classList.add("collapsed");
                    break;
                case "IP":
                    RemoveTextInfoOnContentTagAndShowAddAddress();
                    document.getElementById("mainPgContainer").classList.add("collapsed");
                    if(myIP.indexOf(val) == -1)
                        myIP.push(val);
                    getAHMIInfo(val);
                    break;
            }



            //if(event.data != "Not found.")
            //{
            //    if(myIP.indexOf(event.data) == -1)
            //        myIP.push(event.data);
            //
            //    getAHMIInfo(event.data)
            //}


        };

        // Send all IPs array to web worker....
        workerFindaHMIOnLAN.postMessage(JSON.stringify(allAddrs));

    } else {
        document.getElementById("messages").innerHTML = "Sorry, your browser does not support Web Workers...";
    }

    //xmlhttp.onreadystatechange = function() {
    //    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //        return true;
    //    }else return false;
    //
    //};

    //allAddrs.forEach(function(s))
    //
    //var url = "http://" +  + ":8008/RestDataExchange/service/web/GetAHMIInfo";
    //
    //var xmlhttp = new XMLHttpRequest();
    //xmlhttp.timeout = 1;
    //xmlhttp.open('GET', url, false);
    //
    //try { //xmlhttp.open("GET", url, true);
    //    xmlhttp.send();
    //
    //    //return xmlhttp.responseText;
    //    if (xmlhttp.status == 200 || xmlhttp.status == 304) {
    //        //xmlDoc=xhttp.responseXML;
    //
    //        return true;
    //
    //        //if(xmlDoc==null)
    //        //{
    //        //    xmlDoc=loadXMLDoc(defaultXml);
    //        //}
    //    }
    //} catch (e) {
    //    return false;
    //    //postMessage(url + " not found!");
    //}

}

function setAddr(){

    var text = document.getElementsByName('ipAddr');

    if(myIP.indexOf(text[0].value) == -1)
        myIP.push(text[0].value);

    if(!document.getElementById(text[0].value))
        getAHMIInfo(myIP[myIP.length-1]);
}


function getAHMIInfo(ip) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = (function (x,i) {
        return function () {
            if (x.readyState == 4 && x.status == 200) {
                var myArr = JSON.parse(x.responseText);

                //var thisIp = myIP[myIP.length - 1];

                var out = "<div class='hmi'>";
                out += "<span hidden id='" + i + "' ></span>";
                out += "<h1>aHMI Found!</h1>";
                out += "<p>" + myArr.GetAHMIInfoResult.PcName + "</p>";
                out += "<p>" + myArr.GetAHMIInfoResult.aHMIVersion + "</p>";
                out += "<div id='" + i + "_getLanguages' class='servicesChoice'><button onclick='getLanguages(this)'>Get Languages</button></div>";
                out += "<div id='" + i + "_getMessageHistoryList' class='servicesChoice'><button onclick='getMessageHistoryList(this)'>Get Messages</button></div>";
                out += "<div id='" + i + "_getMachineList' class='servicesChoice'><button onclick='getMachineList(this)'>Get Machine List</button></div>";
                out += "<div id='" + i + "_getCurrentVelocity' class='servicesChoice'><button onclick='getCurrentVelocity(this)'>Get current velocity</button></div>";
                out += "<div id='" + i + "_getNominalVelocity' class='servicesChoice'><button onclick='getNominalVelocity(this)'>Get nominal velocity</button></div>";
                out += "</div>";


                document.getElementById("aHMIList").innerHTML += out;
                document.getElementById("aHMIList").classList.remove('collapsed');

            }
        }

    })(xmlhttp,ip);

    var url = "http://" + ip + ":8008/RestDataExchange/service/web/GetAHMIInfo";
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

function getLanguages(s){

    var ip = s.parentElement.parentElement.firstElementChild.id;

    var url = "http://" + ip + ":8008/RestDataExchange/service/web/GetLanguageList";
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            var ip = xmlhttp.responseURL.split("://")[1].split(":")[0];

            var mainDiv = document.createElement("DIV");
            mainDiv.id = ip + "_ans_getLanguages";

            mainDiv.appendChild(document.createElement('br'));

            myArr.GetLanguageListResult.forEach(function(s){

                var theButton = document.createElement("BUTTON");
                theButton.style.marginRight = "10px";
                EventUtil.addHandler(theButton,'click',function(){
                    setLanguage(ip,theButton);
                });
                var theButtonText = document.createTextNode(s);
                theButton.appendChild(theButtonText);

                mainDiv.appendChild(theButton);

            });

            mainDiv.appendChild(document.createElement('br'));
            mainDiv.appendChild(document.createElement('br'));

            var former = document.getElementById(ip + "_ans_getLanguages");
            if(former) document.getElementById(ip + "_getLanguages").removeChild(former);
            document.getElementById(ip + "_getLanguages").appendChild(mainDiv);
            //
            //
            //
            //var out = "</br></br>";
            //var i;
            //for(i = 0; i < myArr.GetLanguageListResult.length; i++) {
            //    out += '<button style="margin-right: 10px" onclick="setLanguage(this)">' + myArr.GetLanguageListResult[i] + '</button>';
            //}
            //
            //var ip = xmlhttp.responseURL.split("://")[1].split(":")[0];
            ////var node = document.createElement("LI");                 // Create a <li> node
            ////var textnode = document.createTextNode("Water");         // Create a text node
            //
            //document.getElementById(ip + "_getLanguages").innerHTML += out + "</br></br>";
        }

    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function setLanguage(s,e){
    var xmlhttp = new XMLHttpRequest();
    //var url = "http://10.11.28.64:8008/RestDataExchange/service/web/SetCurrentLanguage?language=" + s.innerHTML;
    var url = "http://" + s + ":8008/RestDataExchange/service/web/SetCurrentLanguage?language=" + e.innerHTML;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

function getMessageHistoryList(s){


    var ip = s.parentElement.parentElement.firstElementChild.id;

    var url = "http://" + ip + ":8008/RestDataExchange/service/web/GetMessageHistoryList";
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);

            var out = "";

            myArr.GetMessageHistoryListResult.forEach(function(s){
                out += '<p>' + s + '</p>';
            });

            //for(i = 0; i < myArr.GetMessageHistoryListResult.length; i++) {
            //    out += '<button onclick="setLanguage(this)">' + myArr.GetLanguageListResult[i] + '</button>';
            //}

            var ip = xmlhttp.responseURL.split("://")[1].split(":")[0];
            //var node = document.createElement("LI");                 // Create a <li> node
            //var textnode = document.createTextNode("Water");         // Create a text node

            document.getElementById(ip).parentElement.innerHTML += out;
        }

    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function getMachineList(s){

    var ip = s.parentElement.parentElement.firstElementChild.id;

    var url = "http://" + ip + ":8008/RestDataExchange/service/web/GetMachineList?replyLanguage=English";
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            var ipDetected = xmlhttp.responseURL.split("://")[1].split(":")[0];

            var mainDiv = document.createElement("DIV");
            mainDiv.id = ipDetected + "_ans_getMachineList";

            myArr.GetMachineListResult.forEach(function(s){
                //out += '<p >' + s.Id + '</p>';

                var idTitleTag = document.createElement("H3");
                var idTitle = document.createTextNode("Machine Id and Name:");
                idTitleTag.appendChild(idTitle);

                var idValTag = document.createElement("P");
                var idVal = document.createTextNode("ID: " + s.Id);
                idValTag.appendChild(idVal);

                var nameValTag = document.createElement("P");
                var nameVal = document.createTextNode("Name: " + s.Text);
                nameValTag.appendChild(nameVal);

                mainDiv.appendChild(idTitleTag);
                mainDiv.appendChild(idValTag);
                mainDiv.appendChild(nameValTag);


            });

            //for(i = 0; i < myArr.GetMessageHistoryListResult.length; i++) {
            //    out += '<button onclick="setLanguage(this)">' + myArr.GetLanguageListResult[i] + '</button>';
            //}

            //var node = document.createElement("LI");                 // Create a <li> node
            //var textnode = document.createTextNode("Water");         // Create a text node

            var former = document.getElementById(mainDiv.id);
            if (former) document.getElementById(ipDetected + "_getMachineList").removeChild(former);

            document.getElementById(ipDetected + "_getMachineList").appendChild(mainDiv);
        }

    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function getCurrentVelocity(s) {

    var ip = s.parentElement.parentElement.firstElementChild.id;

    var ans = document.getElementById(ip + "_ans_getCurrentVelocity");
    if(ans) document.getElementById(ip + "_getCurrentVelocity").removeChild(ans);

    var theP = document.createElement("P");
    var thePText = document.createTextNode("Machine?");
    theP.appendChild(thePText);

    var theInput = document.createElement("INPUT");
    theInput.type = "text";
    theInput.name = ip +"_mch_getCurrentVelocity";

    var theButton = document.createElement("BUTTON");
    EventUtil.addHandler(theButton,'click',function(){
        getCurrentVelocityService(ip);
    });
    var theButtonText = document.createTextNode("Ok");
    theButton.appendChild(theButtonText);

    var mainDiv = document.createElement("DIV");
    mainDiv.id = ip + "_quest_getCurrentVelocity";
    mainDiv.appendChild(theP);
    mainDiv.appendChild(theInput);
    mainDiv.appendChild(theButton);

    document.getElementById(ip + "_getCurrentVelocity").appendChild(mainDiv);

}

function getCurrentVelocityService(s) {

    var val = s;
    var mchId = document.getElementsByName(val + "_mch_getCurrentVelocity")[0].value;

    var url = "http://" + val + ":8008/RestDataExchange/service/web/GetCurrentVelocity?machineId=" + mchId;
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            var ip = xmlhttp.responseURL.split("://")[1].split(":")[0];

            var out = myArr.GetCurrentVelocityResult;

            var H3AnswerTitle = document.createElement("H3");
            H3AnswerTitle.appendChild(document.createTextNode("Current Velocity:"));

            var PAnswer = document.createElement("P");
            PAnswer.appendChild(document.createTextNode(out));

            var DivAnswer = document.createElement("DIV");
            DivAnswer.id = ip + "_ans_getCurrentVelocity";

            DivAnswer.appendChild(H3AnswerTitle);
            DivAnswer.appendChild(PAnswer);

            document.getElementById(ip + "_getCurrentVelocity").removeChild(document.getElementById(ip + "_quest_getCurrentVelocity"));
            document.getElementById(ip + "_getCurrentVelocity").appendChild(DivAnswer);
        }

    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function getNominalVelocity(s) {

    var ip = s.parentElement.parentElement.firstElementChild.id;

    var ans = document.getElementById(ip + "_ans_getNominalVelocity");
    if(ans) document.getElementById(ip + "_getNominalVelocity").removeChild(ans);

    var theP = document.createElement("P");
    var thePText = document.createTextNode("Machie?");
    theP.appendChild(thePText);

    var theInput = document.createElement("INPUT");
    theInput.type = "text";
    theInput.name = ip +"_mch_getNominalVelocity";

    var theButton = document.createElement("BUTTON");
    EventUtil.addHandler(theButton,'click',function(){
        getNominalVelocityService(ip);
    });
    var theButtonText = document.createTextNode("Ok");
    theButton.appendChild(theButtonText);

    var mainDiv = document.createElement("DIV");
    mainDiv.id = ip + "_quest_getNominalVelocity";
    mainDiv.appendChild(theP);
    mainDiv.appendChild(theInput);
    mainDiv.appendChild(theButton);

    document.getElementById(ip + "_getNominalVelocity").appendChild(mainDiv);

}

function getNominalVelocityService(s){

    var val = s;
    var mchId = document.getElementsByName(val + "_mch_getNominalVelocity")[0].value;

    var url = "http://" + val + ":8008/RestDataExchange/service/web/GetNominalVelocity?machineId=" + mchId;
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            var ip = xmlhttp.responseURL.split("://")[1].split(":")[0];

            var out = myArr.GetNominalVelocityResult;

            var H3AnswerTitle = document.createElement("H3");
            H3AnswerTitle.appendChild(document.createTextNode("Nominal Velocity:"));

            var PAnswer = document.createElement("P");
            PAnswer.appendChild(document.createTextNode(out));

            var DivAnswer = document.createElement("DIV");
            DivAnswer.id = ip + "_ans_getNominalVelocity";

            DivAnswer.appendChild(H3AnswerTitle);
            DivAnswer.appendChild(PAnswer);

            document.getElementById(ip + "_getNominalVelocity").removeChild(document.getElementById(ip + "_quest_getNominalVelocity"));
            document.getElementById(ip + "_getNominalVelocity").appendChild(DivAnswer);
        }

    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}



function getClientIPs() {
// NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
    var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    if (RTCPeerConnection) (function () {
        var rtc = new RTCPeerConnection({iceServers:[]});
        if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
            rtc.createDataChannel('', {reliable:false});
        }
        rtc.onicecandidate = function (evt) {
            // convert the candidate to SDP so we can run it through our general parser
            // see https://twitter.com/lancestout/status/525796175425720320 for details
            if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
        };
        rtc.createOffer(function (offerDesc) {
            grepSDP(offerDesc.sdp);
            rtc.setLocalDescription(offerDesc);
        }, function (e) { console.warn("offer failed", e); });

        var addrs = Object.create(null);
        addrs["0.0.0.0"] = false;
        function updateDisplay(newAddr) {
            if (newAddr in addrs) return;
            else addrs[newAddr] = true;

            if (addrs[newAddr]) {
                var i = 0;
                var j = 0;
                var initIP = newAddr.split('.')[0] + '.' + newAddr.split('.')[1];
                var min = Math.floor(Number(newAddr.split('.')[2])/10) * 10; // in ip value
                var max = min + 10; // max ip value
                for (i = min; i < max; i++) {
                    for (j = 0; j < 255; j++) {
                        var thisip = initIP + '.' + i + '.' + j;
                        if ((thisip != newAddr) && (allAddrs.indexOf(newAddr) == -1))
                            allAddrs.push(thisip);
                    }
                }
                checkForaHMIOnGivenIP(newAddr);
            }
            var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
            //document.getElementById('id01').textContent = displayAddrs.join(" or perhaps ") || "n/a";
            localIPAddressesInfo = displayAddrs.join(" or perhaps ") || "n/a";
        }

        function grepSDP(sdp) {
            //var hosts = [];
            sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
                if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                    var parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
                        addr = parts[4],
                        type = parts[7];
                    if (type === 'host') updateDisplay(addr);
                } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
                    var parts = line.split(' '),
                        addr = parts[2];
                    updateDisplay(addr);
                }
            });
        }
    })(); else {
        document.getElementById('id01').innerHTML = "WebRTC not available...";
    }
}


