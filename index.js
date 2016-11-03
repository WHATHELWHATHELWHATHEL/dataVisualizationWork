//Here we must assert the schoolDataObj is loaded
console.log(!!schoolData,"school data failed to load");
console.log(!!util,"util module fail to load");
console.log("schoolData load success");

var provincePositionMap = {
    "Beijing":{
        x:1,
        y:1,
        schoolPositionMap:{}
    },
    "Shanghai":{
        x:2,
        y:2,
        schoolPositionMap:{}
    },
    "Anhui":{
        x:3,
        y:3,
        schoolPositionMap:{}
    },
    "Zhejiang":{
        x:4,
        y:4,
        schoolPositionMap:{}
    },
    "Jiangsu":{
        x:5,
        y:5,
        schoolPositionMap:{}
    },
    "Guangdong":{
        x:6,
        y:6,
        schoolPositionMap:{}
    },
    "Hubei":{
        x:7,
        y:7,
        schoolPositionMap:{}
    },
    "Heilongjiang":{
        x:8,
        y:8,
        schoolPositionMap:{}
    },
    "Fujian":{
        x:9,
        y:9,
        schoolPositionMap:{}
    },
    "Tianjin":{
        x:10,
        y:10,
        schoolPositionMap:{}
    },
    "Shaanxi":{
        x:11,
        y:11,
        schoolPositionMap:{}
    },
    "Shandong":{
        x:12,
        y:12,
        schoolPositionMap:{}
    },
    "Liaoning":{
        x:13,
        y:13,
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
