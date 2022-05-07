import React from "react";
import * as d3 from "d3";

function generateArray (start, end) {
    return Array.from(new Array(end + 1).keys()).slice(start)
}

export function LineChart(props) {
    const {chartType, offsetX, offsetY, width, height, provinceOne, provinceTwo, yTag} = props;
    const years = generateArray(2005,2020);
    //process the data
    // if(type === "GDP")
    // {

    // }
    // console.log(provinceOne['Province']);
    // console.log(provinceTwo['Province']);
    var province1 = Object.values(provinceOne).slice(1);
    var province2 = Object.values(provinceTwo).slice(1);
    var p1 = Object.entries(provinceOne).slice(1);
    var p2 = Object.entries(provinceTwo).slice(1);
    //console.log(p1);
    //console.log(p2);
    if(chartType === "PRP")
    {
        province1 = province1.slice(16);
        province2 = province2.slice(16);
        p1 = p1.slice(16).reverse();
        p2 = p2.slice(16).reverse();
        //console.log(p1);
        //console.log(p2);
        for(var i = 0; i < 16; i++)
        {
            p1[i][0] = +p1[i][0].slice(4);
            p2[i][0] = +p2[i][0].slice(4);
        }
    }
    else{
        for(var i = 0; i < 16; i++)
        {
            p1[i][0] = +p1[i][0].slice(1);
            p2[i][0] = +p2[i][0].slice(1);
        }        
    }

    // console.log(p1);
    // console.log(provinceOne);
    // console.log(province1);
    // console.log(province2);
    // console.log(d3.max(province2));
    // console.log(d3.max([d3.max(province1),d3.max(province2)]));
    const xScale = d3.scaleBand().range([0, width]).domain(years);
    const yScale = d3.scaleLinear().range([height, 0])
            .domain([0, d3.max([d3.max(province1),d3.max(province2)])]).nice();
    const line = d3.line().x(d => xScale(d[0])).y(d => yScale(d[1])).curve(d3.curveBasis);
    const xTicks = xScale.domain();
    const yTicks = yScale.ticks();

    return <g transform={`translate(${offsetX},${offsetY})`}>
            <line y2={height} stroke={`black`} />
            {yTicks.map( tickValue => {
                return <g key={tickValue} transform={`translate(-10, ${yScale(tickValue)})`}>
                        <line x2={width} stroke={"gray"} />
                        <text style={{ textAnchor:'end', fontSize:'18px' }}>
                        {tickValue}
                        </text>
                    </g> 
            })}
            <text style={{ textAnchor:'start', fontSize:'18px'}} transform={`translate(10, -5)rotate(0)`}>
                    {yTag}
                </text>
            <line x1={0} y1={height} x2={width} y2={height} stroke={`black`} />
            {xTicks.map( tickValue => {
                return <g key={tickValue} transform={`translate(${xScale(tickValue)}, ${height})`}>
                        <line y2={5} stroke={"black"} />
                        <text style={{ textAnchor:'middle', fontSize:'18px'}} y={20}>
                        {tickValue}
                        </text>
                </g> 
            })}
            <text style={{ textAnchor:'end', fontSize:'18px'}} transform={`translate(${width}, ${height-10})`}>
                            {"Year"}
                </text>
            <path d={line(p1)} stroke={"#2b83ba"} strokeWidth={5} fill={"none"} />
            <path d={line(p2)} stroke={"#fdae61"} strokeWidth={5} fill={"none"} />
            <text style={{ textAnchor:'start', fontSize:'18px'}} transform={`translate(${xScale(2020)}, ${yScale(p1[0][1])})`}>
                            {provinceOne['Province']}
                </text>
            <text style={{ textAnchor:'start', fontSize:'18px'}} transform={`translate(${xScale(2020)}, ${yScale(p2[0][1])})`}>
                            {provinceTwo['Province']}
                </text>
            </g>
}

