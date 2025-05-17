'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import FillGraph from '../map-dashboard/FillGraph';
import { FillData } from '@/lib/store';

interface MapPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  properties?: Record<string, any>;
  fillData: FillData;
}

export function MapPopup({ 
  isOpen, 
  onClose, 
  title = "Location Information", 
  description = "No description available", 
  properties = {},
  fillData
}: MapPopupProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-[350px] sm:w-[450px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            {description}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          {Object.entries(properties).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(properties).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">{key}</span>
                  <span className="text-base">{String(value)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No additional information available</p>
          )}
        </div>
        
        <FillGraph chartData={fillData} />

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
