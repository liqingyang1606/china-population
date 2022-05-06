import React from "react";
import ReactDOM from "react-dom";
import { json, csv, min, max } from "d3";
import { scaleSequential, interpolateBuPu } from "d3";
import * as topojson from "topojson-client";

import { GeoMap } from "./geoMap";

// URLs for dataset
const mapUrl = "https://raw.githubusercontent.com/lyyyrx/InformationVisualization_FinalProject/main/source/china-provinces-simplified.json";
const gdpUrl = "https://raw.githubusercontent.com/lyyyrx/InformationVisualization_FinalProject/main/source/china-provinces-GDP.csv";

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
    const yearStart = 1992, yearEnd = 2020;
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
// function component
function App() {
    // hooks
    const [year, setYear] = React.useState('2000');
    // constants
    const WIDTH = 2000;
    const HEIGHT = 2000;
    const margin = {left: 50, right: 50, top: 50, bottom: 50};
    const geoWidth = 1000, geoHeight = 600;  // geo-map size
    // read data
    const map = useMap(mapUrl);  // read map
    const gdpData = useData(gdpUrl);
    if(!map || !gdpData) {
        return <pre>Loading ...</pre>;
    }
    // hook related logic
    const changeHandler = (event) => {
        setYear(event.target.value);
    };
    // colormap for geo-map:
    const _key = '_' + year;
    console.log(gdpData);
    const gdpOneYear = gdpData.map(d => d[_key]);
    const colormap = scaleSequential(interpolateBuPu)
      .domain([min(gdpOneYear), max(gdpOneYear)]);
    // return the whole visualization
    return <div>
        <div>
            <input key="slider" type="range" min='1992' max='2020' value={year} step='1' onChange={changeHandler}/>
            <input key="yearText" type="text" value={year} readOnly/>
        </div>
        <svg width={WIDTH} height={HEIGHT}>
            <g>
                <GeoMap map={map} colormap={colormap} width={geoWidth} height={geoHeight}
                  data={gdpData} selyear={year} offsetX={margin.left} offsetY={margin.top}/>
            </g>
        </svg>
    </div>
}

ReactDOM.render(<App />, document.getElementById("root"));