'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import FillGraph from '../map-dashboard/FillGraph';
import { FillData } from '@/lib/store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  properties?: Record<string, any>;
  fillData: FillData;
  position?: { x?: number; y?: number };
  className?: string;
  onHeightChange?: (height: number) => void; // Add height callback
}

export function MapPopup({ 
  isOpen, 
  onClose, 
  title = "Location Information", 
  description = "No description available", 
  properties = {},
  fillData,
  position = { x: 24, y: 24 },
  className,
  onHeightChange
}: MapPopupProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: position.x || 24, y: position.y || 24 });
  const popupRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // Reset position when popup opens or position changes
  useEffect(() => {
    if (isOpen) {
      setPos({ 
        x: position.x || 24, 
        y: position.y || 24 
      });
    }
  }, [isOpen, position]);

  // Report height changes to parent component if needed
  const [height, setHeight] = useState(0);
  
  useEffect(() => {
    if (popupRef.current && isOpen) {
      // Create a ResizeObserver to monitor size changes
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newHeight = entry.contentRect.height;
          setHeight(newHeight);
          // Call the callback if provided
          if (onHeightChange) {
            onHeightChange(newHeight);
          }
        }
      });
      
      observer.observe(popupRef.current);
      return () => observer.disconnect();
    }
  }, [isOpen, popupRef.current, onHeightChange]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (popupRef.current && e.target === e.currentTarget) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        posX: pos.x,
        posY: pos.y
      };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      // Optional: Restrict horizontal movement to keep the panel on the left side
      // Uncomment the next line to restrict horizontal movement 
      // const newX = Math.max(24, Math.min(200, dragStartRef.current.posX + deltaX));
      
      // For a left-panel format, you may want to only allow vertical dragging
      const newX = dragStartRef.current.posX; // Keep X position fixed
      const newY = dragStartRef.current.posY + deltaY; // Only move vertically
      
      setPos({
        x: newX,
        y: newY
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;
  
  return (
    <Card 
      ref={popupRef}
      className={cn(
        "absolute z-50 shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-2 border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden transition-all duration-300",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        "left-panel-popup", // Add consistent class for styling
        className
      )}
      style={{ 
        left: `${pos.x}px`, 
        top: `${pos.y}px`,
        width: '380px',       // Fixed width for all popups
        height: 'auto',       // Let height adapt to content
        minHeight: '100px',   // Minimum height
        // maxHeight: '320px',   // Maximum height - keep this consistent
        overflow: 'auto',     // Make it scrollable if content is too long
        borderLeft: '4px solid #38e8b6' // Use custom-one color from theme
      }}
    >
      <CardHeader 
        className="cursor-grab" 
        onMouseDown={handleMouseDown}
      >
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="mt-1">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4">
        {Object.entries(properties).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(properties).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{key}</span>
                <span className="text-base">{String(value)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No additional information available</p>
        )}

        <FillGraph chartData={fillData} />
      </CardContent>
    </Card>
  );
}
