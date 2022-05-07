import React from "react";
import ReactDOM from "react-dom";
import { json, csv, min, max } from "d3";
import { scaleSequential, interpolateBuPu } from "d3";
import * as topojson from "topojson-client";

import { GeoMap } from "./geoMap";
import { LineChart } from "./linechart";

// URLs for dataset
const mapUrl = "https://raw.githubusercontent.com/lyyyrx/InformationVisualization_FinalProject/main/SourceData/china-provinces-simplified.json";
const gdpUrl = "https://raw.githubusercontent.com/lyyyrx/InformationVisualization_FinalProject/main/SourceData/china-provinces-GDP.csv";
const prpNbsUrl = "https://raw.githubusercontent.com/lyyyrx/InformationVisualization_FinalProject/main/SourceData/china-provinces-population_NBS.csv";
const gdppoUrl = "https://raw.githubusercontent.com/lyyyrx/InformationVisualization_FinalProject/main/SourceData/china-provinces-GDP_per_one.csv";

// util functions
function useMap(jsonPath) {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        json(jsonPath).then(topoJsonData => {
            setData(topojson.feature(topoJsonData,
                topoJsonData.objects.CHN_adm1))});
    }, []);
    return data;
}
function useData(csvPath){
    const [dataAll, setData] = React.useState(null);
    const yearStart = 2005, yearEnd = 2020;
    React.useEffect(() => {
        csv(csvPath).then(data => {
            data.forEach(d => {
                // TIP: access key using ["key"]
                var _key;
                for(var i = yearStart; i <= yearEnd; i++) {
                    // convert to int value
                    _key = '_' + i;
                    d[_key] = +d[_key];
                }
            });
            setData(data);
        });
    }, []);
    return dataAll;
}
function useDataPortion(csvPath) {
    const [dataAll, setData] = React.useState(null);
    const yearStart = 2005, yearEnd = 2020;
    React.useEffect(() => {
        csv(csvPath).then(data => {
            // convert & compute
            var prpSum = {};
            for(var i = yearStart; i <= yearEnd; i++) {
                prpSum['_' + i] = 0;
            }
            data.forEach(d => {
                var _key;
                for(var i = yearStart; i <= yearEnd; i++) {
                    _key = '_' + i;
                    d[_key] = +d[_key];
                    prpSum[_key] += d[_key];  // sum up
                }
            });
            data.forEach(d => {
                var k1, k2;
                for(var i = yearStart; i <= yearEnd; i++) {
                    k1 = '_' + i;
                    k2 = "por_" + i;
                    d[k2] = d[k1] / prpSum[k1];  // division
                }
            });
            setData(data);
        });
    }, []);
    return dataAll;
}

//function calculate
// function CalculateGPO(arrA, arrB) {
//     var result = [];
//     for(var i = 0; i < 31; i++)
//     {
//         result.push(arrA[i]/arrB[i]);
//     }
//     return result;
// }

function getPortion(dset, selyear) {
    const k1 = '_' + selyear;
    const k2 = "por_" + selyear;
    const selarr = dset.map(d => d[k1]);
    // sum up the population of selected year
    var sum_year = 0;
    for(var i = 0; i < selarr.length; i++) {
        sum_year += selarr[i];
    }
    // compute the porportion
    dset.forEach(d => {
        d[k2] = d[k1] / sum_year;
    });
}

// function component
function App() {
    // hooks
    const [year, setYear] = React.useState('2005');
    const [provinceFirst, setProvinceFirst] = React.useState('Beijing');          //for choosing the province of line chart
    const [provinceSecond,setProvinceSecond] = React.useState('Heilongjiang');  //for choosing the province of line chart
    // constants
    const WIDTH = 2000;
    const HEIGHT = 2000;
    const margin = {left: 50, right: 50, top: 50, bottom: 50, gap: 50};
    const geoWidth = 1000, geoHeight = 600;  // geo-map & line chart size
    // read data
    const map = useMap(mapUrl);  // read map
    const gdpData = useData(gdpUrl);    // read GDP data
    //const prpData = useData(prpNbsUrl); // read permanent resident population data
    const prpData = useDataPortion(prpNbsUrl);  // read permanent resident population and propotion data
    const gdppoData = useData(gdppoUrl);
    if(!map || !gdpData || !prpData || !gdppoData) {
        return <pre>Loading ...</pre>;
    }
    // hook related logic
    const changeHandler = (event) => {
        setYear(event.target.value);
    };
    // Process data for geo-maps:
    const _key = '_' + year;
    const prpOneYear = prpData.map(d => d["por_" + year]);
    const gdppoOneYear = gdppoData.map(d => d[_key]);
    //getPortion(prpData, year);
    const cmapl = scaleSequential(interpolateBuPu)
      .domain([min(prpOneYear), max(prpOneYear)]);  // left colormap
    const cmapr = scaleSequential(interpolateBuPu)
      .domain([min(gdppoOneYear), max(gdppoOneYear)]);  // right colormap
    const xGeoLeft = margin.left;
    const yGeoLeft = margin.top;
    const xGeoRight = xGeoLeft + geoWidth + margin.gap;
    const yGeoRight = margin.top;
    // Process data for line charts:
    const gdppoProvinceFirst = gdppoData.filter(d => d['Province'] === provinceFirst)[0];
    const gdppoProvinceSecond = gdppoData.filter(d => d['Province'] === provinceSecond)[0];
    const prpPortionProvinceFirst = prpData.filter(d => d['Province'] === provinceFirst)[0];
    const prpPortionProvinceSecond = prpData.filter(d => d['Province'] === provinceSecond)[0];
    // console.log(prpPortionProvinceFirst);
    // console.log(prpPortionProvinceSecond);

    // return the whole visualization
    return <div>
        <div>
            <input key="slider" type="range" min='2005' max='2020' value={year} step='1' onChange={changeHandler}/>
            <input key="yearText" type="text" value={year} readOnly/>
        </div>
        <svg width={WIDTH} height={HEIGHT}>
            <g>
                <GeoMap map={map} colormap={cmapl} width={geoWidth} height={geoHeight}
                  data={prpData} offsetX={xGeoLeft} offsetY={yGeoLeft} dkey={"por_"+year}/>
                <GeoMap map={map} colormap={cmapr} width={geoWidth} height={geoHeight}
                  data={gdppoData} offsetX={xGeoRight} offsetY={yGeoRight} dkey={_key}/>
            </g>
        </svg>
        <svg width={1.25*WIDTH} height={HEIGHT}>
            <g>
                <LineChart chartType={"PRP"} offsetX={xGeoLeft + 10} offsetY={yGeoLeft} width={geoWidth} height={geoHeight} 
                    provinceOne={prpPortionProvinceFirst} provinceTwo={prpPortionProvinceSecond} yTag={"Proportion of the resident population"}/>
                <LineChart chartType={"GDP"} offsetX={1250 + 10} offsetY={yGeoRight} width={geoWidth} height={geoHeight} 
                    provinceOne={gdppoProvinceFirst} provinceTwo={gdppoProvinceSecond} yTag={"Per capita GDP (￥10000)"}/>
            </g>
        </svg>
    </div>
}

ReactDOM.render(<App />, document.getElementById("root"));