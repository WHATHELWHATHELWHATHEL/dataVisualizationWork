function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0,len = obj.length; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function getItemClusterIndex(clusters,dataItem,generateClusterIdFunc){
    var result = -1;
    clusters.forEach(function(item,index){
        if(item.clusterId === generateClusterIdFunc(dataItem)){
            result = index;
        }
    });
    return result;
}

var util  = (function(){
    return {
        getBasic:function(){
            return "this is util module provide utilties for this project";
        },
        clusterByConditionFunction:function(data,generateClusterIdFunc){
            var result = [];
            data.forEach(function(item,index){
                var targetClusterIndex = getItemClusterIndex(result,item,generateClusterIdFunc);
                if(-1 === targetClusterIndex){
                    var tempArray = [];
                    tempArray.push(clone(item));
                    result.push({
                        clusterId:generateClusterIdFunc(item),
                        clusterItems:tempArray
                    });
                }else{
                    result[targetClusterIndex].clusterItems.push(clone(item));
                }
            });
            return result;
        },
        clusterBySchoolName:function(data){
            return util.clusterByConditionFunction(
                data,
                function(item){
                    return item.SchoolName;
                }
            );
        },
        clusterBySubjectName:function(data){
            return util.clusterByConditionFunction(
                data,
                function(item){
                    return item.SubjectName;
                }
            );
        },
        clusterByProvinceName:function(data){
            return util.clusterByConditionFunction(
                data,
                function(item){
                    return item.Province;
                }
            );
        },
        clusterByProvinceNameAndSubject:function(data){
            return util.clusterByConditionFunction(
                data,
                function(item){
                    return item.Province+"_"+item.SubjectName;
                }
            );
        },
        generateRenderData:function(data,positionMap,generateClusterIdFunc,generateScoreFunc,generateScoreColorFunc,generateActulDataFunc){
            var result = [];
            data.forEach(function(item,index){
                result.push({
                    name:generateClusterIdFunc(item),
                    positionX:(positionMap[generateClusterIdFunc(item)].x-3)+"px",
                    positionY:(positionMap[generateClusterIdFunc(item)].y-generateScoreFunc(item))+"px",
                    barData:generateScoreFunc(item),
                    actualData:generateActulDataFunc&&generateActulDataFunc(item),
                    color:generateScoreColorFunc(positionMap,item)
                });
            });
            return result;
        }
    };
})();
