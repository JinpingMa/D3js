function createSoccerViz() {
    d3.csv("worldcup.csv", function (data) {
        overallTeamViz(data);
    })
    
    function overallTeamViz(incomingData) {
        d3.select("svg")
            .append("g")
            .attr("id", "teamsG")
            .attr("transform", "translate(50,300)")
            .selectAll("g")
            .data(incomingData)
            .enter()
            .append("g")
            .attr("class", "overallG")
            .attr("transform", function (d, i) {
            return "translate(" + (i * 50) + ",0)"
        });
        
        var teamG = d3.selectAll("g.overallG");
        
        //有动画，circle会变大再变小
        teamG
            .append("circle").attr("r",0)
            .transition()
            .delay(function(d,i){return i*100})
            .duration(500)
            .attr("r",40)
            .transition()
            .duration(500)
            .attr("r",20);
        
        //没有动画的时候
//        teamG
//            .append("circle")
//            .attr("r", 20)
//            .style("fill", "pink")
//            .style("stroke", "black")
//            .style("stroke-width", "1px");
        
        teamG
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", 30)
            .text(function (d) {
            return d.team;
        });
        
        var dataKeys=d3.keys(incomingData[0]).filter(function(el){
            return el!="team" && el!="region";
        }); 
        
        para=document.createElement("p");
        text=document.createTextNode("dataKeys: "+dataKeys);
        para.appendChild(text);
        (document.getElementsByTagName("body"))[0].appendChild(para);
        
        d3.select("#controls").selectAll("button.teams")
            .data(dataKeys).enter()
            .append("button")
            .on("click",buttonClick)
        .html(function(d){return d;});
        
        function buttonClick(datapoint){
            var maxValue=d3.max(incomingData,function(d){
                return parseFloat(d[datapoint]);
            });
            var radiusScale=d3.scale.linear()
            .domain([0,maxValue]).range([2,20]);
            
            d3.selectAll("g.overallG").select("circle").transition().duration(1000)
            .attr("r",function(d){
            return radiusScale(d[datapoint]);
        });
            
//            d3.selectAll("g.overallG").select("circle")
//                .attr("r",function(d){
//                return radiusScale(d[datapoint]);
//            });
        };
        
        teamG.on("mouseover",highlightRegion);
        
        //鼠标停留在某一个circle上是时，其他的与其region相同的显示为红色，其他为灰色
//        function highlightRegion(d){
//            d3.selectAll("g.overallG").select("circle")
//            .style("fill",function(p){
//                //d当然被选中的元素对象数据，p所以的circle中的每一个的元素对象数据
//                return (p.region == d.region) ? "red":"gray";
//            });
//        };
        
        //text也变大
        function highlightRegion(d,i){
           var teamColor=d3.rgb("pink"); d3.select(this).select("text").classed("highlight",true).attr("y",10);
            d3.selectAll("g.overallG").select("circle").style("fill",function(p){
                return (p.region==d.region)?teamColor.darker(.75):teamColor.brighter(.5);
            });
            this.parentElement.appendChild(this);
        }
        
        //鼠标从circle上移开后所有的circle显示为粉色
        teamG.on("mouseout",unHighlight)
        function unHighlight(){
           d3.selectAll("g.overallG").select("circle").style("fill", "pink"); d3.selectAll("g.overallG").select("circle").attr("class","");
            d3.selectAll("g.overallG").select("text")
            .classed("highlight",false).attr("y",40);
        };
//        teamG.on("mouseout", function() {
//            d3.selectAll("g.overallG").select("circle").style("fill", "pink");
//        });
        
        
        teamG.select("text").style("pointer-events","none");//组织text事件
        
    }
}