import React from "react";
import { geoPath, geoMercator } from "d3-geo";

export function GeoMap(props) {
    const {offsetX, offsetY, map, colormap, width, height, data, selyear} = props;
    let path = geoPath(geoMercator().fitSize([width, height], map));
    //console.log(map.features);
    return <g transform={`translate(${offsetX}, ${offsetY})`}>
        {map.features.map(feature => {
            const province = data.filter(d => d.Province === feature.properties.NAME_1);
            const _key = '_' + selyear;
            if(province[0]) {
                return <path key={feature.properties.NAME_1 + "boundary"} className={"boundary"}
                  d={path(feature)} opacity={1.0}
                  style={{fill:colormap(province[0][_key])}}/>;
            }
            else {
                // in case not found
                return <path key={feature.properties.NAME_1 + "boundary"} className={"boundary"}
                  d={path(feature)} opacity={1.0}/>;
            }
        })}
    </g>;
}