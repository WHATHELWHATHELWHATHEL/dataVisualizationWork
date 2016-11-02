var fs = require("fs");

function readFile(){
    return new Promise(function(resolve,error){
        fs.readFile("rawData.csv","utf-8",function(err,data){
            if(!!err){
                error&&error(err);
            }else{
                resolve&&resolve(data);
            }
        });
    });
}
function parseCSVToJS(data){
    return new Promise(function(resolve,error){
        var result = [];
        var lines = data.split("\n");
        lines.forEach(function(item,index){
            var parsedLine = item.replace(/,\s/g,"_");
            var dataItems = parsedLine.split(",");
            if(dataItems.length >= 7){
                var tempObj = {
                    SchoolName:dataItems[0],
                    Location:(function(locationString){
                        locationString = locationString.replace(/"/g,"");
                        return locationString.split("_");
                    })(dataItems[1]),
                    GlobalRanking:dataItems[2],
                    GlobalScores:dataItems[3],
                    SubjectName:dataItems[4],
                    SubjectRanking:dataItems[5],
                    SubjectScores:dataItems[6]
                };
                result.push(tempObj);
            }
        });
        resolve&&resolve(result);
    });
}

function writeFileToDataJS(data){
    return new Promise(function(resolve,error){
        var dataString = JSON.stringify(data);
        dataString = "var schoolData="+dataString;
        fs.writeFile("data.js",dataString,function(err){
            error&&error(err);
        });
        resolve&&resolve();
    });
}

readFile().then(parseCSVToJS).then(writeFileToDataJS).catch(function(e){
    console.log("error occur:"+e);
});;
