import * as React from 'react';
import { useState } from 'react';
import ReactMapGL, { FlyToInterpolator, Marker, _useMapControl as useMapControl } from '@goongmaps/goong-map-react';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface MapProps {
    title: string;
    lat: number;
    long: number;
}

const Map: React.FC<MapProps> = ({ lat, long, title }) => {
  const viewport = ({
    zoom: 14,
    width: "100%",
    height: "100%",
    });

  return (
    <ReactMapGL
    {...viewport}
    goongApiAccessToken="4dAgWahZ3jW5LsZCiYikMTvVUOYpd2jcmxz3kyLA"
    height="100%"
    width="100%"
    latitude={lat}
    longitude={long}
    >
        <Marker latitude={lat} longitude={long} offsetLeft={-20} offsetTop={-10}>
            <div className="text-3xl text-red-500">
                <FaMapMarkerAlt />
                <p className="text-xs">{title}</p>
            </div>
        </Marker>
    </ReactMapGL>
  );
}

export default Map;