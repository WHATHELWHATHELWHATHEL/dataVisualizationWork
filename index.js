//Here we must assert the schoolDataObj is loaded
console.log(!!schoolData,"school data failed to load");
console.log(!!util,"util module fail to load");
console.log("schoolData load success");

var provincePositionMap = {
    "Beijing":{
        x:647,
        y:330,
        schoolPositionMap:{}
    },
    "Shanghai":{
        x:762,
        y:485,
        schoolPositionMap:{}
    },
    "Anhui":{
        x:682,
        y:489,
        schoolPositionMap:{}
    },
    "Zhejiang":{
        x:727,
        y:452,
        schoolPositionMap:{}
    },
    "Jiangsu":{
        x:735,
        y:534,
        schoolPositionMap:{}
    },
    "Guangdong":{
        x:638,
        y:669,
        schoolPositionMap:{}
    },
    "Hubei":{
        x:624,
        y:513,
        schoolPositionMap:{}
    },
    "Heilongjiang":{
        x:785,
        y:158,
        schoolPositionMap:{}
    },
    "Fujian":{
        x:719,
        y:594,
        schoolPositionMap:{}
    },
    "Tianjin":{
        x:670,
        y:345,
        schoolPositionMap:{}
    },
    "Shaanxi":{
        x:553,
        y:439,
        schoolPositionMap:{}
    },
    "Shandong":{
        x:739,
        y:367,
        schoolPositionMap:{}
    },
    "Liaoning":{
        x:752,
        y:290,
        schoolPositionMap:{}
    }
}
var provinceData = util.clusterByProvinceName(schoolData);
var provinceSubjectData = [];
provinceData.forEach(function(item,index){
    var temp = {
        provinceName:item.clusterId,
        itemClusteredBySubject:[]
    };
    var items = item.clusterItems;
    temp.itemClusteredBySubject = util.clusterBySubjectName(items);
    provinceSubjectData.push(temp);
});
//省份-全局成绩平均值
var provinceGlobalSocreRenderData = util.generateRenderData(
    provinceSubjectData,
    provincePositionMap,
    function(itemClusterdByCity){
        return itemClusterdByCity.provinceName;
    },
    function(itemClusterdByCity){
        var subJectCluster = itemClusterdByCity.itemClusteredBySubject;
        var sum = 0;
        var count = 0;
        subJectCluster.forEach(function(subjectItem,index){
            var schoolItems = subjectItem.clusterItems;
            schoolItems.forEach(function(schoolItem,index){
                sum += parseFloat(schoolItem.GlobalScores);
                count++;
            });
        });
        return parseInt(sum/count);
    },
    function(itemClusterdByCity){
        return "rgb("+parseInt((Math.random()*255)%155+100)
                 +","+parseInt((Math.random()*255)%155+100)
                 +","+parseInt((Math.random()*255)%155+100)+")";
    }
);

var provinceChemistrySocreRenderData = util.generateRenderData(
    provinceSubjectData,
    provincePositionMap,
    function(itemClusterdByCity){
        return itemClusterdByCity.provinceName;
    },
    function(itemClusterdByCity){
        var subjectCluster = itemClusterdByCity.itemClusteredBySubject;
        var sum = 0;
        var count = 0;
        subjectCluster.forEach(function(subjectItem,index){
            if("Chemistry" === subjectItem.clusterId){
                var schoolItems = subjectItem.clusterItems;
                schoolItems.forEach(function(schoolItem,index){
                    sum += parseFloat(schoolItem.SubjectScores);
                    count++;
                });
            }
        });
        return Math.floor(sum/count);
    },
    function(itemClusterdByCity){
        return "rgb("+parseInt((Math.random()*255)%155+100)
                 +","+parseInt((Math.random()*255)%155+100)
                 +","+parseInt((Math.random()*255)%155+100)+")";
    }
);

//生成全国范围指定科目的渲染数据，如果SubjectName为空，则为全部数据
function generateNationScaleSubjectScoreRenderData(provinceData,provincePositionMap,subjectName){
    var result = util.generateRenderData(
        provinceSubjectData,
        provincePositionMap,
        function(itemClusterdByCity){
            return itemClusterdByCity.provinceName;
        },
        function(itemClusterdByCity){
            var subjectCluster = itemClusterdByCity.itemClusteredBySubject;
            var sum = 0 ;
            var count = 0;
            subjectCluster.forEach(function(subjectItem,index){
                var schoolItems = subjectItem.clusterItems;
                schoolItems.forEach(function(schoolItem,index){
                    if(!subjectName){
                        sum += parseFloat(schoolItem.GlobalScores);
                        count++;
                    }else if(subjectName === subjectItem.clusterId){
                        sum += parseFloat(schoolItem.SubjectScores);
                        count++;
                    }
                });
            });
            return Math.floor(sum/count);
        },
        function(itemClusterdByCity){
            return "rgb("+parseInt((Math.random()*255)%155+100)
                     +","+parseInt((Math.random()*255)%155+100)
                     +","+parseInt((Math.random()*255)%155+100)+")";
        }
    );
    return result;
}

var globalScoreRenderData = generateNationScaleSubjectScoreRenderData(
    provinceData,
    provincePositionMap
);

var chemistryScoreData = generateNationScaleSubjectScoreRenderData(
    provinceData,
    provincePositionMap,
    "Chemistry"
);

function renderToCanvas(renderDataList){
    var mapCanvas = document.getElementById("mapCanvas");
    mapCanvas.innerHTML = "";
    var elementString = "";
    renderDataList.forEach(function(item,index){
        elementString += ([
            '<div id="'+item.name+'_Desc" style="position:absolute;top:'+(parseInt(item.positionY)-15)+'px;left:'+(parseInt(item.positionX)-5)+'px;color:'+item.color+';">',
                item.barData,
            '</div>',
            '<div id="'+item.name+'" style="border:1px solid '+item.color+';border-radius:3px;position:absolute;top:'+(item.positionY)+';left:'+(item.positionX)+';width:6px;height:'+(item.barData)+'px;background-color:'+item.color+';">',
            '</div>'
        ].join(""));
    });
    mapCanvas.innerHTML = elementString;
}
//renderToCanvas(provinceGlobalSocreRenderData);
