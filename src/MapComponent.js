import React, {useEffect, useState} from 'react';
import './style/Map.css';
import 'leaflet/dist/leaflet.css';
import {TileLayer, Tooltip, Polyline, Marker, MapContainer} from 'react-leaflet';
import {DivIcon} from "leaflet/dist/leaflet-src.esm";


export default function MapComponent() {
    const position = [49.77, 4.7179001];

    const zoom = 13;
    const [data, setData] = useState(null);


    useEffect(() => {
        (async () => {
            const result = await fetch(
                '/data.json',
            );

            setData(await result.json());
        })();
    }, []);

    function gerLineColor(line) {
        if (line.ABDuration < 5) {
            return '#68954F';
        }
        if (line.ABDuration < 15) {
            return '#366792';
        }

        return '#DA762F';
    }

    function buildTextIcon(text) {
        return new DivIcon({
            iconSize: [10, 10],
            html: '<p>' + text + '</p>'
        });
    }

    function manageLabelsVisibility(e) {
        document.querySelectorAll('.leaflet-div-icon > p')
            .forEach(p => p.style.visibility = e.target._zoom > 14 ? 'visible' : 'hidden');
    }

    return (
        <MapContainer center={position} zoom={zoom} onZoomEnd={manageLabelsVisibility}>
                <TileLayer
                    attribution=''
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                />
                {data !== null && data.points.map((p, index) => (
                    <Marker key={index} position={[p.lat, p.long]} radius={5} icon={buildTextIcon(p.name)}>
                        <Tooltip>{p.name}</Tooltip>
                    </Marker>
                ))}

                {data !== null && data.lines.map((l, index) => (
                    <Polyline key={index} positions={[[l.latA, l.longA], [l.latB, l.longB]]} color={gerLineColor(l)}
                              weight={2}>
                        <Tooltip>{l.ABDuration + ' minutes'}</Tooltip>
                    </Polyline>
                ))}
        </MapContainer>
    )
}
