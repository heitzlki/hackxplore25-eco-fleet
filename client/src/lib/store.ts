import { Area, Contact } from '@/types';
import { set } from 'date-fns';
import { create } from 'zustand';




const initialGarbageContainers = () => {

  const fillData: FillData = [
    {
      timestamp: "00:00",
      fillLevel: 0
    },
    {
      timestamp: "01:00",
      fillLevel: 0.5
    },
    {
      timestamp: "02:00",
      fillLevel: 0.75
    },
    {
      timestamp: "03:00",
      fillLevel: 0.9
    },
    {
      timestamp: "04:00",
      fillLevel: 0.95
    },
    {
      timestamp: "05:00",
      fillLevel: 0.9
    },
    {
      timestamp: "06:00",
      fillLevel: 0
    },
    {
      timestamp: "07:00",
      fillLevel: 0.1
    },
    {
      timestamp: "08:00",
      fillLevel: 0.1
    },
    {
      timestamp: "09:00",
      fillLevel: 0.1
    },
    {
      timestamp: "10:00",
      fillLevel: 0.2
    },
    {
      timestamp: "11:00",
      fillLevel: 0.2
    },
    {
      timestamp: "12:00",
      fillLevel: 0.2
    },
    {
      timestamp: "13:00",
      fillLevel: 0.2
    },
    {
      timestamp: "14:00",
      fillLevel: 0.2
    },
    {
      timestamp: "15:00",
      fillLevel: 0.2
    },
    {
      timestamp: "16:00",
      fillLevel: 0.2
    },
    {
      timestamp: "17:00",
      fillLevel: 0.2
    },
    {
      timestamp: "18:00",
      fillLevel: 0.3
    },
    {
      timestamp: "19:00",
      fillLevel: 0.4
    },
    {
      timestamp: "20:00",
      fillLevel: 0.5
    },
    {
      timestamp: "21:00",
      fillLevel: 0.5
    },
    {
      timestamp: "22:00",
      fillLevel: 0.6
    },
    {
      timestamp: "23:00",
      fillLevel: 0.8
    },
    {
      timestamp: "24:00",
      fillLevel: 0.9
    }
  ]

  return [
    { lat: 49.009544, lng: 8.403545, fillData: fillData },
    { lat: 49.009504, lng: 8.404323, fillData: fillData },
    { lat: 49.009014, lng: 8.403469, fillData: fillData },
    { lat: 49.008968, lng: 8.404302, fillData: fillData },
    { lat: 49.008260, lng: 8.403522, fillData: fillData },
    { lat: 49.008241, lng: 8.404078, fillData: fillData },
    { lat: 49.009753, lng: 8.401409, fillData: fillData }
  ]
}


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

// a timeseries which gives us the fill level of the garbage container over the day
export type FillData = {
  timestamp: string;
  fillLevel: number;
}[]

interface LongLatInfo {
  lng: number,
  lat: number,
  fillData: FillData,
}

interface ClientState {
  roadmap: boolean;
  color1: string;
  color2: string;
  graphData: Area[];
  selectedNode: NodeInfo | null;
  serverResponse: ServerResponse | null;
  garbageContainers: LongLatInfo[];
  setGarbageContainers: (garbageContainers: LongLatInfo[]) => void;
  setRoadmap: () => void;
  setGraphData: (graphData: Area[]) => void;
  setColor1: (color: string) => void;
  setColor2: (color: string) => void;
  setSelectedNode: (node: NodeInfo | null) => void;
  setServerResponse: (response: ServerResponse | null) => void;
}

export const useStore = create<ClientState>((set) => ({
  roadmap: false,
  color1: 'hsl(313.2,100%,50%)',
  color2: 'hsl(122.4,100%,58.5%)',
  graphData: [],
  selectedNode: null,
  serverResponse: null, 
  garbageContainers: initialGarbageContainers(),
  setGarbageContainers: (garbageContainers: LongLatInfo[]) => set({ garbageContainers: garbageContainers }),
  setColor1: (color: string) => set({ color1: color }),
  setColor2: (color: string) => set({ color2: color }),
  setGraphData: (graphData: Area[]) => set({ graphData }),
  setSelectedNode: (node: NodeInfo | null) => set({ selectedNode: node }),
  setServerResponse: (response: ServerResponse | null) =>
    set({ serverResponse: response }),
  setRoadmap: () =>
    set((state: { roadmap: boolean }) => ({ roadmap: !state.roadmap })),
}));

