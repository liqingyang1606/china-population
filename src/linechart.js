import React from "react";
import * as d3 from "d3";

function generateArray (start, end) {
    return Array.from(new Array(end + 1).keys()).slice(start)
}

export function LineChart(props) {
    const {offsetX, offsetY, width, height, provinceOne, provinceTwo} = props;
    const years = generateArray(2005,2020);
    // for(var i = 0; i < 16; i++)
    // {
    //     years[i] = "_" + years[i].toString();
    // }
    //console.log(years);
    const province1 = Object.values(provinceOne).slice(1);
    const province2 = Object.values(provinceTwo).slice(1);
    const p1 = Object.entries(provinceOne).slice(1);
    const p2 = Object.entries(provinceTwo).slice(1);
    for(var i = 0; i < 16; i++)
    {
        p1[i][0] = +p1[i][0].slice(1);
        p2[i][0] = +p2[i][0].slice(1);
    }
    // console.log(p1);
    // console.log(provinceOne);
    // console.log(province1);
    // console.log(d3.max(province2));
    // console.log(d3.max([d3.max(province1),d3.max(province2)]));
    const xScale = d3.scaleBand().range([0, width]).domain(years);
    const yScale = d3.scaleLinear().range([height, 0])
            .domain([0, d3.max([d3.max(province1),d3.max(province2)])]).nice();
    const line = d3.line().x(d => xScale(d[0])).y(d => yScale(d[1]));
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
            <text style={{ textAnchor:'start', fontSize:'18px'}} transform={`translate(10, 0)rotate(0)`}>
                    {"Per capita GDP"}
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
                            {"Years"}
                </text>
            <path d={line(p1)} stroke={"#d7191c"} strokeWidth={3} fill={"none"} />
            <path d={line(p2)} stroke={"#fdae61"} strokeWidth={3} fill={"none"} />
            

            </g>
}

