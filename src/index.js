import React from "react";
import ReactDOM from "react-dom";
import { json, csv, min, max } from "d3";
import { scaleSequential, interpolateBuPu } from "d3";
import * as topojson from "topojson-client";

import { GeoMap } from "./geoMap";

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

//function calculate
// function CalculateGPO(arrA, arrB) {
//     var result = [];
//     for(var i = 0; i < 31; i++)
//     {
//         result.push(arrA[i]/arrB[i]);
//     }
//     return result;
// }

// function component
function App() {
    // hooks
    const [year, setYear] = React.useState('2005');
    // constants
    const WIDTH = 2000;
    const HEIGHT = 2000;
    const margin = {left: 50, right: 50, top: 50, bottom: 50};
    const geoWidth = 1000, geoHeight = 600;  // geo-map size
    // read data
    const map = useMap(mapUrl);  // read map
    const gdpData = useData(gdpUrl);    // read GDP data
    const prpData = useData(prpNbsUrl); // read permanent resident population data
    const gdppoData = useData(gdppoUrl); 
    if(!map || !gdpData || !prpData || !gdppoData) {
        return <pre>Loading ...</pre>;
    }
    // hook related logic
    const changeHandler = (event) => {
        setYear(event.target.value);
    };
    // colormap for geo-map:
    const _key = '_' + year;
    //console.log(gdpData);
    const gdpOneYear = gdpData.map(d => d[_key]);
    const prpOneYear = prpData.map(d => d[_key]);
    const gdppoOneYear = gdppoData.map(d => d[_key]);
    //const gdpPerOne = CalculateGPO(gdpOneYear, prpOneYear);
    // console.log(gdpPerOne);
    // console.log(gdpOneYear);
    const colormap = scaleSequential(interpolateBuPu)
      .domain([min(gdppoOneYear), max(gdppoOneYear)]);  
    // return the whole visualization
    return <div>
        <div>
            <input key="slider" type="range" min='2005' max='2020' value={year} step='1' onChange={changeHandler}/>
            <input key="yearText" type="text" value={year} readOnly/>
        </div>
        <svg width={WIDTH} height={HEIGHT}>
            <g>
                <GeoMap map={map} colormap={colormap} width={geoWidth} height={geoHeight}
                  data={gdppoData} selyear={year} offsetX={margin.left} offsetY={margin.top}/>
            </g>
        </svg>
    </div>
}

ReactDOM.render(<App />, document.getElementById("root"));