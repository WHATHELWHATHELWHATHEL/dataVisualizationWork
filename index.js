//Here we must assert the schoolDataObj is loaded
console.log(!!schoolData,"school data failed to load");
console.log(!!util,"util module fail to load");
console.log("schoolData load success");

var provincePositionMap = {
    "Beijing":{
        x:647,
        y:330,
        schoolPositionMap:{},
        color:"(0,0,0)"
    },
    "Shanghai":{
        x:762,
        y:485,
        schoolPositionMap:{},
        color:"(120,0,0)"
    },
    "Anhui":{
        x:682,
        y:489,
        schoolPositionMap:{},
        color:"(0,120,0)"
    },
    "Zhejiang":{
        x:727,
        y:452,
        schoolPositionMap:{},
        color:"(0,0,120)"
    },
    "Jiangsu":{
        x:735,
        y:534,
        schoolPositionMap:{},
        color:"(120,60,60)"
    },
    "Guangdong":{
        x:638,
        y:669,
        schoolPositionMap:{},
        color:"(60,120,60)"
    },
    "Hubei":{
        x:624,
        y:513,
        schoolPositionMap:{},
        color:"(60,60,120)"
    },
    "Heilongjiang":{
        x:785,
        y:158,
        schoolPositionMap:{},
        color:"(0,120,120)"
    },
    "Fujian":{
        x:719,
        y:594,
        schoolPositionMap:{},
        color:"(120,0,120)"
    },
    "Tianjin":{
        x:670,
        y:345,
        schoolPositionMap:{},
        color:"(120,120,0)"
    },
    "Shaanxi":{
        x:553,
        y:439,
        schoolPositionMap:{},
        color:"(60,0,0)"
    },
    "Shandong":{
        x:739,
        y:367,
        schoolPositionMap:{},
        color:"(0,60,0)"
    },
    "Liaoning":{
        x:752,
        y:290,
        schoolPositionMap:{},
        color:"(0,0,60)"
    }
}
var subjectMap = (function(){
    var result = {};
    schoolData.forEach(function(item,index){
        result[""+item.SubjectName] = "1";
    });
    return result;
})();
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

//生成全国省份-成绩的关联
function generateProvinceAverageScoreBySubject(subjectName){
    return util.generateRenderData(
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
                if(subjectName === "GlobalScore"){
                    var schoolItems = subjectItem.clusterItems;
                    schoolItems.forEach(function(schoolItem,index){
                        sum += parseFloat(schoolItem.GlobalScores);
                        count++;
                    });
                }
                if(subjectName === subjectItem.clusterId){
                    var schoolItems = subjectItem.clusterItems;
                    schoolItems.forEach(function(schoolItem,index){
                        sum += parseFloat(schoolItem.SubjectScores);
                        count++;
                    });
                }
            });
            return Math.floor(sum/count);
        },
        function(positionMap,itemClusterdByCity){
            return "rgb"+positionMap[""+itemClusterdByCity.provinceName].color+";";
        }
    );
}
var lowestRank = (function(){
    var result = 0;
    schoolData.forEach(function(item,index){
        if(item.GlobalRanking >= result ){
            result = parseFloat(item.GlobalRanking);
        }
    });
    return result;
})();
var lowestRankBySubject = (function(){
    var result = {};
    $.each(subjectMap,function(key,value){
        result[""+key] = 0;
        $.each(schoolData,function(index,item){
            if(item.SubjectName === key){
                if(parseFloat(item.SubjectRanking) >= result[""+key]){
                    result[""+key] = parseFloat(item.SubjectRanking);
                }
            }
        });
    });
    return result;
})();
//生成全国省份-排名的关联
function generateProvinceAverageRankBySubject(subjectName){
    return util.generateRenderData(
        provinceSubjectData,
        provincePositionMap,
        function(itemClusterdByCity){
            return itemClusterdByCity.provinceName;
        },
        function(itemClusterdByCity){
            var subjectCluster = itemClusterdByCity.itemClusteredBySubject;
            var sum = 0;
            var count = 0;
            var temp = (function(){
                if(subjectName === "GlobalScore"){
                    return lowestRank;
                }else{
                    return lowestRankBySubject[""+subjectName];
                }
            })();
            var highestSingleRank = 0;
            var lowestSingleRank = 100000;
            subjectCluster.forEach(function(subjectItem,index){
                if(subjectName === "GlobalScore"){
                    var schoolItems = subjectItem.clusterItems;
                    schoolItems.forEach(function(schoolItem,index){
                        sum += parseFloat((schoolItem.GlobalRanking));
                        count++;
                        if(parseFloat(schoolItem.GlobalRanking) > highestSingleRank){
                            highestSingleRank = parseFloat(schoolItem.GlobalRanking);
                        }
                        if(parseFloat(schoolItem.GlobalRanking) < lowestSingleRank){
                            lowestSingleRank = parseFloat(schoolItem.GlobalRanking);
                        }
                    });
                }
                if(subjectName === subjectItem.clusterId){
                    var schoolItems = subjectItem.clusterItems;
                    schoolItems.forEach(function(schoolItem,index){
                        sum += parseFloat((schoolItem.SubjectRanking));
                        count++;
                        if(parseFloat(schoolItem.SubjectRanking) > highestSingleRank){
                            highestSingleRank = parseFloat(schoolItem.SubjectRanking);
                        }
                        if(parseFloat(schoolItem.SubjectRanking) < lowestSingleRank){
                            lowestSingleRank = parseFloat(schoolItem.SubjectRanking);
                        }
                    });
                }
            });
            return Math.floor((temp/(sum/count))*3);
        },
        function(positionMap,itemClusterdByCity){
            return "rgb"+positionMap[""+itemClusterdByCity.provinceName].color+";";
        },
        function(itemClusterdByCity){
            var subjectCluster = itemClusterdByCity.itemClusteredBySubject;
            var sum = 0;
            var count = 0;
            subjectCluster.forEach(function(subjectItem,index){
                if(subjectName === "GlobalScore"){
                    var schoolItems = subjectItem.clusterItems;
                    schoolItems.forEach(function(schoolItem,index){
                        sum += parseFloat((schoolItem.GlobalRanking));
                        count++;
                    });
                }
                if(subjectName === subjectItem.clusterId){
                    var schoolItems = subjectItem.clusterItems;
                    schoolItems.forEach(function(schoolItem,index){
                        sum += parseFloat((schoolItem.SubjectRanking));
                        count++;
                    });
                }
            });
            return Math.floor((sum/count));
        }
    );
}




function renderToCanvas(renderDataList){
    var mapCanvas = document.getElementById("mapCanvas");
    mapCanvas.innerHTML = "";
    var elementString = "";
    renderDataList.forEach(function(item,index){
        if(!item.name||!item.barData){
            return;
        }
        elementString += ([
            '<div id="'+item.name+'_Desc" style="position:absolute;top:'+(parseInt(item.positionY)-15+item.barData)+'px;left:'+(parseInt(item.positionX)-5)+'px;color:'+item.color+';">',
                item.barData,
            '</div>',
            '<div id="'+item.name+'" style="border:1px solid '+item.color+';border-radius:3px;position:absolute;top:'+(parseInt(item.positionY)+item.barData)+'px;left:'+(item.positionX)+';height:1px;;width:6px;background-color:'+item.color+';">',
            '</div>'
        ].join(""));
    });
    mapCanvas.innerHTML = elementString;
    //插入之后，使用jquery来把各个柱子的渲染动画做出来
    renderDataList.forEach(function(item,index){
        if(!item.name||!item.barData){
            return;
        }
        $("#"+item.name+"_Desc").animate({
            top:parseInt(item.positionY)-15+'px'
        });
        $("#"+item.name).animate({
            height:item.barData+'px',
            top:parseInt(item.positionY)
        });
    });
}

function renderRankToCanvas(renderDataList){
    var mapCanvas = document.getElementById("mapCanvas");
    mapCanvas.innerHTML = "";
    var elementString = "";
    renderDataList.forEach(function(item,index){
        if(!item.name||!item.barData){
            return;
        }
        elementString += ([
            '<div id="'+item.name+'_Desc" style="position:absolute;top:'+(parseInt(item.positionY)-15+item.barData)+'px;left:'+(parseInt(item.positionX)-5)+'px;color:'+item.color+';">',
                parseInt(item.actualData),
            '</div>',
            '<div id="'+item.name+'" style="border:1px solid '+item.color+';border-radius:3px;position:absolute;top:'+(parseInt(item.positionY)+item.barData)+'px;left:'+(item.positionX)+';height:1px;;width:6px;background-color:'+item.color+';">',
            '</div>'
        ].join(""));
    });
    mapCanvas.innerHTML = elementString;
    //插入之后，使用jquery来把各个柱子的渲染动画做出来
    renderDataList.forEach(function(item,index){
        if(!item.name||!item.barData){
            return;
        }
        $("#"+item.name+"_Desc").animate({
            top:parseInt(item.positionY)-15+'px'
        });
        $("#"+item.name).animate({
            height:item.barData+'px',
            top:parseInt(item.positionY)
        });
    });
}

//点击事件处理部分
document.addEventListener("click",function(eventObj){
    var targetId = eventObj.target.id;
    var dataArray = targetId.split("-");
    if("nation" === dataArray[0]){
        //第二个参数表示渲染的科目数据
        if("score" === dataArray[1]){
            renderToCanvas(
                generateProvinceAverageScoreBySubject(dataArray[2])
            );
        }else if("rank" === dataArray[1]){
            renderRankToCanvas(
                generateProvinceAverageRankBySubject(dataArray[2])
            );
        }
        $(".Buttons").removeClass("Choosen");
        $(eventObj.target).addClass("Choosen");
    }else{
        switch(dataArray[1]){

        }
    }
});

$("#scoreButton").click(function(e){
    $("#scoreButton").animate({
        color:"#ffffff",
        backgroundColor:"#000000"
    });
    $("#rankButton").animate({
        color:"#000000",
        backgroundColor:"#ffffff"
    });
    $("#rankButtons").hide(1000);
    $("#scoreButtons").toggle(1000);
});
$("#rankButton").click(function(e){
    $("#rankButton").animate({
        color:"#ffffff",
        backgroundColor:"#000000"
    });
    $("#scoreButton").animate({
        color:"#000000",
        backgroundColor:"#ffffff"
    });
    $("#scoreButtons").hide(1000);
    $("#rankButtons").toggle(1000);
});

$(document).ready(function(){
    $("#scoreButton").click();
    $("#rankButtons").click();
    $("#scoreButton").click();
});
