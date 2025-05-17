import { Area, Contact } from '@/types';
import { create } from 'zustand';
import { ContainerApi } from './api-utils';

// Fetch garbage containers from our API endpoint
const initialGarbageContainers = async () => {
  console.log("Fetching garbage containers from API...");

  try {
    const data = await ContainerApi.getAll();
    console.log("Garbage containers data fetched successfully.");
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching garbage containers:", error);
    // Return a sensible default in case of error
    return [];
  }
};

interface NodeInfo {
  id: string;
  title: string;
  color: string;
  type: string;
  details?: {
    description?: string;
    contacts?: Contact[];
    institution?: string;
    email?: string;
    website?: string;
    rating?: number;
  } | null;
}

interface FileInfo {
  id: number;
  name: string;
  path: string;
  size: number;
  mimetype: string;
}

interface ServerResponse {
  success: boolean;
  message: string;
  file: FileInfo;
  content: string;
  summary: string;
  xml: string;
}

// A timeseries which gives us the fill level of the garbage container over the day
export type FillData = {
  timestamp: string;
  fillLevel: number;
}[];

// Waste type fill levels
export interface WasteTypes {
  glass: number; // -1 means not available
  aluminum: number; // -1 means not available
  general: number; // -1 means not available
}

// Container location interface
export interface ContainerLocation {
  lng: number;
  lat: number;
  waste_types: WasteTypes;
}

// Full container info including fill data
export interface GarbageContainer extends ContainerLocation {
  fillData: FillData;
  index?: number;
}

// Map popup information
export interface PopupInfo {
  title: string;
  description: string;
  properties: Record<string, string | number>;
  fillData: FillData;
}

// Custom point on the map
export interface CustomPoint {
  lng: number;
  lat: number;
}

// Map view state
export interface MapViewState {
  isPopupOpen: boolean;
  popupData: PopupInfo;
  customPoints: CustomPoint[];
  isPlacingMode: boolean;
  isLoadingRoute: boolean;
  center: [number, number];
  zoom: number;
}

interface ClientState {
  roadmap: boolean;
  color1: string;
  color2: string;
  graphData: Area[];
  selectedNode: NodeInfo | null;
  serverResponse: ServerResponse | null;
  garbageContainers: GarbageContainer[];
  // Map view state
  mapViewState: MapViewState;
  isSelectingMarkers: boolean;
  markerElements: HTMLElement[],
  setMarkerElements: (markers: HTMLElement[]) => void;
  setGarbageContainers: (garbageContainers: GarbageContainer[]) => void;
  setRoadmap: () => void;
  setGraphData: (graphData: Area[]) => void;
  setColor1: (color: string) => void;
  setColor2: (color: string) => void;
  setSelectedNode: (node: NodeInfo | null) => void;
  setServerResponse: (response: ServerResponse | null) => void;
  // Map view state actions
  setPopupOpen: (isOpen: boolean) => void;
  setPopupData: (data: PopupInfo) => void;
  addCustomPoint: (point: CustomPoint) => void;
  removeCustomPoint: (pointToRemove: CustomPoint) => void;
  clearCustomPoints: () => void;
  setPlacingMode: (isPlacing: boolean) => void;
  togglePlacingMode: () => void;
  setLoadingRoute: (isLoading: boolean) => void;
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  setIsSelectingMarkers: (isSelecting: boolean) => void;
}

export const useStore = create<ClientState>((set) => {
  // kick off async fetch and update the store once data arrives
  initialGarbageContainers().then((containers) =>
    set({ garbageContainers: containers })
  );

  return {
    roadmap: false,
    color1: 'hsl(313.2,100%,50%)',
    color2: 'hsl(122.4,100%,58.5%)',
    graphData: [],
    selectedNode: null,
    serverResponse: null,
    // start with an empty array; will be replaced when the promise resolves
    garbageContainers: [],
    mapViewState: {
      isPopupOpen: false,
      popupData: {
        title: 'Location Information',
        description: 'No description available',
        properties: {},
        fillData: [],
      },
      customPoints: [],
      isPlacingMode: false,
      isLoadingRoute: false,
      center: [8.388105, 49.001576],
      zoom: 16,
    },
    isSelectingMarkers: false,
    markerElements: [],
    setMarkerElements: (markers: HTMLElement[]) => set({ markerElements: markers }),
    setIsSelectingMarkers: (isSelecting: boolean) => set({ isSelectingMarkers: isSelecting }),
    setGarbageContainers: (garbageContainers: GarbageContainer[]) =>
      set({ garbageContainers }),
    setColor1: (color: string) => set({ color1: color }),
    setColor2: (color: string) => set({ color2: color }),
    setGraphData: (graphData: Area[]) => set({ graphData }),
    setSelectedNode: (node: NodeInfo | null) => set({ selectedNode: node }),
    setServerResponse: (response: ServerResponse | null) =>
      set({ serverResponse: response }),
    setRoadmap: () =>
      set((state) => ({ roadmap: !state.roadmap })),
    setPopupOpen: (isOpen: boolean) =>
      set((state) => ({
        mapViewState: { ...state.mapViewState, isPopupOpen: isOpen },
      })),
    setPopupData: (data: PopupInfo) =>
      set((state) => ({
        mapViewState: { ...state.mapViewState, popupData: data },
      })),
    addCustomPoint: (point: CustomPoint) =>
      set((state) => ({
        mapViewState: {
          ...state.mapViewState,
          customPoints: [...state.mapViewState.customPoints, point],
        },
      })),
    removeCustomPoint: (pointToRemove: CustomPoint) =>
      set((state) => ({
        mapViewState: {
          ...state.mapViewState,
          customPoints: state.mapViewState.customPoints.filter(
            (pt) =>
              pt.lng !== pointToRemove.lng || pt.lat !== pointToRemove.lat
          ),
        },
      })),
    clearCustomPoints: () =>
      set((state) => ({
        mapViewState: { ...state.mapViewState, customPoints: [] },
      })),
    setPlacingMode: (isPlacing: boolean) =>
      set((state) => ({
        mapViewState: { ...state.mapViewState, isPlacingMode: isPlacing },
      })),
    togglePlacingMode: () =>
      set((state) => ({
        mapViewState: {
          ...state.mapViewState,
          isPlacingMode: !state.mapViewState.isPlacingMode,
        },
      })),
    setLoadingRoute: (isLoading: boolean) =>
      set((state) => ({
        mapViewState: { ...state.mapViewState, isLoadingRoute: isLoading },
      })),
    setMapCenter: (center: [number, number]) =>
      set((state) => ({
        mapViewState: { ...state.mapViewState, center },
      })),
    setMapZoom: (zoom: number) =>
      set((state) => ({
        mapViewState: { ...state.mapViewState, zoom },
      })),
  };
});
