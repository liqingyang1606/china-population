import React from "react";
import { XAxis, YAxis } from "./axes";
import { scaleLinear, scaleBand, area, max, min, curveBasis } from "d3";

export function BarChart(props) {
    const { offsetX, offsetY, data, gdpdata, height, width, selyear, selectedProvince, setSelectedProvince } = props;
        const _key = '_' + selyear;
        const xScale = scaleBand().range([0, width])
            .domain(data.map(d => d.Province))
        const yScale1 = scaleLinear().range([height/2, 0])
            .domain([0, max(data, d => d[_key])])
            .nice();
        const yScale2 = scaleLinear().range([0, height/2])
            .domain([0, max(gdpdata, d => d[_key])])
            .nice();
        const getColor1 = (selectedProvince, Province) => {
                return selectedProvince&&Province===selectedProvince ? "red" : "#99d594";
            };
        const getColor2 = (selectedProvince, Province) => {
                return selectedProvince&&Province===selectedProvince ? "blue" : "#fc8d59";
            };
    
    return <g transform={`translate(${offsetX}, ${offsetY})`} >
        <text style={{ textAnchor:'start', fontSize:'15px'}} transform={`translate(${width/3}, 0)`}>
                {"Total resident population"}
        </text>
        {<line y2={height/2} stroke='black'/>}
            {yScale1.ticks(5).map(tickValue => 
                <g key={tickValue+"up"} transform={`translate(-10, ${yScale1(tickValue)})`}>
                    <line x2={10} stroke='black' />
                    <text style={{ textAnchor:'end', fontSize:'10px' }} >
                        {tickValue}
                    </text>
                </g>
            )}
            { data.map( d =>
                <rect key={d.Province+"barUp"} x={xScale(d.Province)} y={yScale1(d[_key])}
                width={xScale.bandwidth()} height={height/2-yScale1(d[_key])} stroke="black" 
                fill={getColor1(selectedProvince, d.Province)} 
                onMouseEnter={() => setSelectedProvince(d.Province)} 
                onMouseOut={()=> setSelectedProvince(null)} />  
            ) }
            <XAxis xScale={xScale} height={height} width={width} />

        <g transform={`translate(${0}, ${height/2})`}>
            <text style={{ textAnchor:'start', fontSize:'15px'}} transform={`translate(${width*2/5}, ${height/2+50})`}>
            {"GDP per capita"}
            </text>
            {gdpdata.map( d =>
                <rect key={d.Province+"barDown"} x={xScale(d.Province)} y={0}
                width={xScale.bandwidth()} height={yScale2(d[_key])} stroke="black" 
                fill={getColor2(selectedProvince, d.Province)}
                onMouseEnter={() => setSelectedProvince(d.Province)} 
                onMouseOut={()=> setSelectedProvince(null)} />
                )}
            {<line y2={height/2} stroke='black'/>}
            {yScale2.ticks(5).reverse().map(tickValue => 
                <g key={tickValue+"down"} transform={`translate(-10, ${yScale2(tickValue)})`}>
                    <line x2={10} stroke='black' />
                    <text style={{ textAnchor:'end', fontSize:'10px' }} >
                        {tickValue}
                    </text>
                </g>
            )}
        </g>
    </g>
}