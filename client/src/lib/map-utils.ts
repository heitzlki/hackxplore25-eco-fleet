import mapboxgl from 'mapbox-gl';
import { GarbageContainer, WasteTypes, FillData, ContainerLocation } from './store';
import { is } from '@react-three/fiber/dist/declarations/src/core/utils';

// Custom point type
export interface CustomPoint {
  lng: number;
  lat: number;
}

// Define a type for popup data
export interface PopupInfo {
  title: string;
  description: string;
  properties: Record<string, any>;
  fillData: FillData;
}

// Route response type
export interface RouteResponse {
  routes: Array<{
    geometry: {
      coordinates: [number, number][];
    };
    distance?: number;
    duration?: number;
    weight?: number;
  }>;
}

// Helper function to get status text from fill level
export const getStatusFromLevel = (level: number): string => {
  if (level >= 80) return "Nearly Full";
  if (level >= 50) return "Half Full";
  return "Available";
};

// Helper function to calculate maximum fill level from waste types
export const getMaxFillLevel = (wasteTypes: WasteTypes): number => {
  const { glass, aluminum, general } = wasteTypes;
  const availableLevels = [
    glass >= 0 ? glass : 0,
    aluminum >= 0 ? aluminum : 0,
    general >= 0 ? general : 0
  ];
  return Math.max(...availableLevels);
};

// Create a marker for a waste container
export const createContainerMarker = (
  container: GarbageContainer,
  map: mapboxgl.Map,
  onMarkerClick: (popupData: PopupInfo) => void
): mapboxgl.Marker => {
  // Calculate max fill level from waste types
  const { glass, aluminum, general } = container.waste_types;
  const maxFillLevel = getMaxFillLevel(container.waste_types);

  // Determine marker color based on maximum fill level
  let markerColor;
  if (maxFillLevel < 30) {
    markerColor = '#4CAF50'; // Green for low fill level
  } else if (maxFillLevel < 70) {
    markerColor = '#FF9800'; // Orange for medium fill level
  } else {
    markerColor = '#F44336'; // Red for high fill level
  }

  // Create a container element for the marker
  const el = document.createElement('div');
  el.style.width = '24px';
  el.style.height = '24px';
  el.style.borderRadius = '50%';
  el.style.backgroundColor = markerColor;
  el.style.border = '2px solid white';
  el.style.boxShadow = '0 5px 10px rgba(0,0,0,0.3)';

  // Add waste type indicators
  const availableTypes = [];
  if (glass >= 0) availableTypes.push('G');
  if (aluminum >= 0) availableTypes.push('A');
  if (general >= 0) availableTypes.push('W');

  if (availableTypes.length > 0) {
    const typeIndicator = document.createElement('div');
    typeIndicator.style.position = 'absolute';
    typeIndicator.style.top = '10px';
    typeIndicator.style.right = '-24px';
    typeIndicator.style.backgroundColor = 'rgb(22, 22, 22)';
    typeIndicator.style.color = 'white';
    typeIndicator.style.fontSize = '8px';
    typeIndicator.style.fontWeight = 'bold';
    typeIndicator.style.padding = '3px 10px';
    typeIndicator.style.borderRadius = '6px';
    typeIndicator.style.transition = 'opacity 0.4s ease-in-out';
    typeIndicator.textContent = availableTypes.join('');
    typeIndicator.setAttribute('data-type-indicator', 'true');
    // Initially hide the type indicator
    typeIndicator.style.opacity = '0';
    typeIndicator.style.display = 'none';
    el.appendChild(typeIndicator);
  }

  // Create marker with custom element
  const marker = new mapboxgl.Marker({ element: el })
    .setLngLat([container.lng, container.lat])
    .addTo(map);

  // Add click handler for the marker
  marker.getElement().addEventListener('click', () => {
    // Create base properties for popup
    const properties: Record<string, any> = {
      "Longitude": container.lng,
      "Latitude": container.lat,
      "Max Fill Level": `${maxFillLevel}%`,
      //"containerIndex": container.index !== undefined ? container.index : null,
    };

    // Add waste type information
    // Glass
    if (glass >= 0) {
      properties["Glass"] = `${glass}%`;
      // properties["Glass Status"] = getStatusFromLevel(glass);
    }

    // Aluminum
    if (aluminum >= 0) {
      properties["Aluminum"] = `${aluminum}%`;
      // properties["Aluminum Status"] = getStatusFromLevel(aluminum);
    }

    // General waste
    if (general >= 0) {
      properties["General Waste"] = `${general}%`;
      // properties["General Status"] = getStatusFromLevel(general);
    }

    // Generate description based on available waste types
    const availableTypeNames = [];
    if (glass >= 0) availableTypeNames.push("Glass");
    if (aluminum >= 0) availableTypeNames.push("Aluminum");
    if (general >= 0) availableTypeNames.push("General Waste");

    const description = availableTypeNames.length > 0
      ? `Container accepting: ${availableTypeNames.join(", ")}`
      : "Container details";

    // Send popup data to handler
    onMarkerClick({
      title: "Waste Container",
      description: description,
      properties: properties,
      fillData: container.fillData
    });
  });

  return marker;
};

// Create a waypoint marker for route planning
export const createWaypointMarker = (
  lng: number,
  lat: number,
  index: number,
  container: GarbageContainer | undefined,
  map: mapboxgl.Map,
  onMarkerClick: (popupData: PopupInfo) => void
): mapboxgl.Marker => {
  // Calculate max fill level from waste types
  const maxFillLevel = container ? getMaxFillLevel(container.waste_types) : 0;

  // Create a marker element with an index label - make it more visible since we're fading other markers
  const el = document.createElement('div');
  el.style.backgroundColor = '#f20000';
  el.style.width = '28px';
  el.style.height = '28px';
  el.style.borderRadius = '50%';
  el.style.border = '2px solid white';
  el.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  el.style.display = 'flex';
  el.style.justifyContent = 'center';
  el.style.alignItems = 'center';
  el.style.color = '#fff';
  el.style.fontSize = '12px';
  el.style.fontWeight = 'bold';
  el.style.zIndex = '100'; // Ensure it's above other markers
  el.textContent = (index + 1).toString();
  // Add a pulse animation for better visibility
  el.style.animation = 'pulse-waypoint 2s infinite';
  // Add styles for the pulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse-waypoint {
      0% { box-shadow: 0 0 0 0 rgba(242, 0, 0, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(242, 0, 0, 0); }
      100% { box-shadow: 0 0 0 0 rgba(242, 0, 0, 0); }
    }
  `;
  document.head.appendChild(style);

  // Add a data attribute to identify this as a waypoint marker
  el.setAttribute('data-waypoint', 'true');

  const marker = new mapboxgl.Marker({ element: el })
    .setLngLat([lng, lat])
    .addTo(map);

  marker.getElement().addEventListener('click', () => {
    // Create base properties
    const waypointProperties: Record<string, any> = {
      "Longitude": lng,
      "Latitude": lat,
      "Order": index + 1,
      "Max Fill Level": maxFillLevel ? `${maxFillLevel}%` : 'Unknown',
      "containerIndex": container?.index !== undefined ? container.index : null,
      // "Status": getStatusFromLevel(maxFillLevel)
    };

    // Add waste type information if available
    let description = `Waypoint ${index + 1}${maxFillLevel ? ` - Max Fill Level: ${maxFillLevel}%` : ''}`;

    if (container && container.waste_types) {
      const { glass, aluminum, general } = container.waste_types;

      // Glass
      if (glass >= 0) {
        waypointProperties["Glass"] = `${glass}%`;
        // waypointProperties["Glass Status"] = getStatusFromLevel(glass);
      }

      // Aluminum
      if (aluminum >= 0) {
        waypointProperties["Aluminum"] = `${aluminum}%`;
        // waypointProperties["Aluminum Status"] = getStatusFromLevel(aluminum);
      }

      // General waste
      if (general >= 0) {
        waypointProperties["General Waste"] = `${general}%`;
        // waypointProperties["General Status"] = getStatusFromLevel(general);
      }

      // Enhanced description with waste types
      const availableTypes = [];
      if (glass >= 0) availableTypes.push("Glass");
      if (aluminum >= 0) availableTypes.push("Aluminum");
      if (general >= 0) availableTypes.push("General Waste");

      if (availableTypes.length > 0) {
        description = `Waypoint ${index + 1} - Accepts: ${availableTypes.join(", ")}`;
      }
    }

    // Send popup data to handler
    onMarkerClick({
      title: "Waypoint",
      description: description,
      properties: waypointProperties,
      fillData: container ? container.fillData : []
    });
  });

  return marker;
};

// Create a custom point marker
export const createCustomPointMarker = (
  point: CustomPoint,
  pointIndex: number,
  map: mapboxgl.Map,
  isPlacingMode: boolean,
  onMarkerClick: (popupData: PopupInfo) => void,
  onRemovePoint?: (point: CustomPoint, marker: mapboxgl.Marker) => void
): mapboxgl.Marker => {
  const { lng, lat } = point;

  // Create a container for the marker with a custom attribute
  const markerContainer = document.createElement('div');
  markerContainer.className = 'custom-marker-container';
  markerContainer.setAttribute('data-custom-point', 'true');

  // Create the marker dot
  const markerDot = document.createElement('div');
  markerDot.className = 'custom-marker-dot';
  markerDot.style.backgroundColor = '#888';
  markerDot.style.width = '20px';
  markerDot.style.height = '20px';
  markerDot.style.borderRadius = '50%';
  markerDot.style.border = '2px solid white';
  markerDot.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
  markerDot.style.transition = 'all 0.2s ease-in-out';
  markerDot.style.cursor = 'pointer';

  // Add hover effect
  markerDot.addEventListener('mouseenter', () => {
    markerDot.style.backgroundColor = '#555';
    markerDot.style.transform = 'scale(1.1)';
    // Show delete instruction
    const deleteHint = document.createElement('div');
    deleteHint.textContent = 'Click to delete';
    deleteHint.style.position = 'absolute';
    deleteHint.style.top = '-25px';
    deleteHint.style.left = '50%';
    deleteHint.style.transform = 'translateX(-50%)';
    deleteHint.style.backgroundColor = 'rgba(0,0,0,0.7)';
    deleteHint.style.color = 'white';
    deleteHint.style.padding = '3px 6px';
    deleteHint.style.borderRadius = '4px';
    deleteHint.style.fontSize = '10px';
    deleteHint.style.whiteSpace = 'nowrap';
    deleteHint.className = 'delete-hint';
    markerContainer.appendChild(deleteHint);
  });

  markerDot.addEventListener('mouseleave', () => {
    markerDot.style.backgroundColor = '#888';
    markerDot.style.transform = 'scale(1)';
    // Remove delete hint
    const hint = markerContainer.querySelector('.delete-hint');
    if (hint) markerContainer.removeChild(hint);
  });

  // Add the dot to the container
  markerContainer.appendChild(markerDot);

  // Add marker to map
  const marker = new mapboxgl.Marker({ element: markerContainer })
    .setLngLat([lng, lat])
    .addTo(map);

  // Add click handler for the marker
  marker.getElement().addEventListener('click', (event) => {
    event.stopPropagation();

    console.log('Marker clicked:', point);
    console.log(isPlacingMode);
    if (isPlacingMode) {
      if (onRemovePoint) {
        // Show a brief "removing" animation
        markerDot.style.backgroundColor = '#e74c3c';
        markerDot.style.transform = 'scale(0.8)';

        // Short delay to show the animation
        setTimeout(() => {
          // Call the callback to remove this point
          onRemovePoint(point, marker);
        }, 200);
      } else {
        // Default behavior if no removal callback provided
        onMarkerClick({
          title: "Custom Point",
          description: "User-defined location point",
          properties: {
            "Longitude": lng.toFixed(6),
            "Latitude": lat.toFixed(6),
            "Point #": pointIndex + 1
          },
          fillData: []
        });
      }
    }
  });

  return marker;
};

// Generate CSV content from custom points
export const generateCSVFromPoints = (points: CustomPoint[]): string => {
  let csvContent = "id,longitude,latitude\n";
  
  points.forEach((point, index) => {
    csvContent += `${index + 1},${point.lng.toFixed(6)},${point.lat.toFixed(6)}\n`;
  });
  
  return csvContent;
};

// Create a download link for CSV data
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Set up and trigger download
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Remove all custom point markers from the map
export const clearCustomPointMarkers = (): number => {
  // Find all marker elements on the page
  const markers = document.querySelectorAll('.mapboxgl-marker');
  let removedCount = 0;
  
  // Loop through each marker and remove custom ones
  markers.forEach(marker => {
    // Check if this marker has our custom attribute
    const customContainer = marker.querySelector('.custom-marker-dot');
    if (customContainer) {
      marker.remove();
      removedCount++;
    }
  });
  
  return removedCount;
};

// Add a route layer to the map
export const addRouteToMap = (
  map: mapboxgl.Map,
  routeData: RouteResponse,
  layerId: string
): void => {
  // Remove existing route layer if it exists
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
    map.removeSource(layerId);
  }

  if (routeData.routes && routeData.routes.length > 0) {
    // Add the route to the map
    map.addSource(layerId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeData.routes[0].geometry.coordinates
        }
      }
    });

    map.addLayer({
      id: layerId,
      type: 'line',
      source: layerId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#f20000',
        'line-width': 8,
        'line-opacity': 1
      }
    });
  }
};

// Remove a route layer from the map
export const removeRouteFromMap = (
  map: mapboxgl.Map,
  layerId: string
): void => {
  // Remove route layer and source if they exist
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
    map.removeSource(layerId);
  }
};