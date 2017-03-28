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
        
        teamG
            .append("circle")
            .attr("r",20);
        
        teamG
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", 30)
            .text(function (d) {
            return d.team;
        });
        
        teamG.insert("image","text")
            .attr("xlink:href",function(d){
            return "images/"+d.team+".png";
        })
            .attr("width","45px").attr("height","20px")
            .attr("x","-22").attr("y","-10");
        
        d3.text("modal.html",function(data){d3.select("body").append("div").attr("id","modal").html(data)});
        
        teamG.on("click",teamClick);
        
        function teamClick(d){
            d3.selectAll("td.data").data(d3.values(d)).html(function(p){return p;});
        }
        
    }
}