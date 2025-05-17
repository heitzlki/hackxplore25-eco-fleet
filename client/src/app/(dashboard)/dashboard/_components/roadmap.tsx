'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Connection,
} from '@xyflow/react';
import { useRouter } from 'next/navigation';

import '@xyflow/react/dist/style.css';

import AnnotationNode from '../graph/_graph/_nodes/AnnotationNode';
import InfoNode from '../graph/_graph/_nodes/InfoNode';
import FloatingEdge from '../graph/_graph/_edges/FloatingEdge';
import CenterNode from '../graph/_graph/_nodes/CenterNode';
import RoadmapNode from '../graph/_graph/_nodes/RoadmapNode';
import LoadingNode from '../graph/_graph/_nodes/LoadingNode';
import { useStore } from '@/lib/store';

const nodeTypes = {
  annotation: AnnotationNode,
  custom: InfoNode,
  center: CenterNode,
  roadmap: RoadmapNode,
  loading: LoadingNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

// Original nodes data to keep for reference
const originalNodesData = [
  {
    id: '1',
    data: {
      color: '#38e8b6',
      title: 'PDF Upload',
      info: 'Initial ingestion of PDF documents into the system.',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    data: {
      color: '#42D7B7',
      title: 'Document Parsing',
      info: 'Extract text, structure, and metadata from the PDF.',
    },
    position: { x: 400, y: -100 },
  },
  {
    id: '3',
    data: {
      color: '#4BC7B8',
      title: 'Image Extraction',
      info: 'Identify and extract images from the PDF document.',
    },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    data: {
      color: '#55B6B9',
      title: 'Text Preprocessing',
      info: 'Clean, normalize, and prepare text for further analysis.',
    },
    position: { x: 800, y: -150 },
  },
  {
    id: '5',
    data: {
      color: '#5FA6BA',
      title: 'Image Analysis',
      info: 'Process and analyze extracted images for content and context.',
    },
    position: { x: 800, y: 150 },
  },
  {
    id: '6',
    data: {
      color: '#6895BA',
      title: 'Entity Recognition',
      info: 'Identify named entities, key concepts, and important information.',
    },
    position: { x: 1200, y: -100 },
  },
  {
    id: '7',
    data: {
      color: '#7285BB',
      title: 'Content Classification',
      info: 'Categorize document sections by content type and relevance.',
    },
    position: { x: 1200, y: 100 },
  },
  {
    id: '8',
    data: {
      color: '#7C74BC',
      title: 'Annotation & Labeling',
      info: 'Apply labels, tags, and annotations to document content.',
    },
    position: { x: 1600, y: 0 },
  },
  {
    id: '9',
    data: {
      color: '#8564BD',
      title: 'Knowledge Extraction',
      info: 'Generate structured knowledge and insights from the processed document.',
    },
    position: { x: 2000, y: -100 },
  },
  {
    id: '10',
    data: {
      color: '#8F53BE',
      title: 'Document Indexing',
      info: 'Index processed content for efficient search and retrieval.',
    },
    position: { x: 2000, y: 100 },
  },
];

// Convert to loading nodes with cascading delays
const createLoadingNodes = (completionCallback: any) => {
  // Base delay for the first node
  const baseDelay = 1500;
  // Incremental delay between nodes
  const getRandomDelay = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const stepDelay = getRandomDelay(300, 600); // Random delay between 200ms and 600ms

  return originalNodesData.map((node, index) => ({
    ...node,
    type: 'loading',
    data: {
      ...node.data,
      delay: baseDelay + index * stepDelay,
      onLoadComplete:
        index === originalNodesData.length - 1 ? completionCallback : undefined,
    },
  }));
};

// PDF processing pipeline connections
const initialEdges = [
  { id: '1-2', source: '1', target: '2', animated: true },
  { id: '1-3', source: '1', target: '3', animated: true },
  { id: '2-4', source: '2', target: '4', animated: true },
  { id: '3-5', source: '3', target: '5', animated: true },
  { id: '4-6', source: '4', target: '6', animated: true },
  { id: '4-7', source: '4', target: '7', animated: true },
  { id: '5-7', source: '5', target: '7', animated: true },
  { id: '6-8', source: '6', target: '8', animated: true },
  { id: '7-8', source: '7', target: '8', animated: true },
  { id: '8-9', source: '8', target: '9', animated: true },
  { id: '8-10', source: '8', target: '10', animated: true },
];

export default function Roadmap() {
  const { setSelectedNode } = useStore();
  const router = useRouter();
  const [processingComplete, setProcessingComplete] = useState(false);

  // Function to call when all nodes have completed loading
  const handlePipelineComplete = useCallback(() => {
    console.log('PDF processing pipeline complete');
    setProcessingComplete(true);

    // Navigate to a different route after a short delay
    setTimeout(() => {
      router.push('/dashboard/3d');
    }, 1000);
  }, [router]);

  // Create initial nodes with loading spinners
  const loadingNodes = createLoadingNodes(handlePipelineComplete);
  const [nodes, setNodes, onNodesChange] = useNodesState(loadingNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle node click
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: any) => {
      console.log('Node clicked:', node.data.title);

      // Set the selected node in the store
      setSelectedNode({
        id: node.id,
        title: node.data.title,
        color: node.data.color,
        type: node.type,
        details: {
          // info: node.data.info,
        },
      });
    },
    [setSelectedNode]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* {processingComplete && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <h2 className='text-xl font-bold mb-4'>Processing Complete!</h2>
            <p>Redirecting to results page...</p>
          </div>
        </div>
      )} */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={{ hideAttribution: true }}
        fitView>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
