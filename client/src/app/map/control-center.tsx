'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function GreenhouseMonitor() {
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  const gasExchangeData = [
    { day: 'Mon', oxygen: 420, co2: 470 },
    { day: 'Tue', oxygen: 430, co2: 480 },
    { day: 'Wed', oxygen: 448, co2: 495 },
    { day: 'Thu', oxygen: 460, co2: 505 },
    { day: 'Fri', oxygen: 455, co2: 500 },
    { day: 'Sat', oxygen: 450, co2: 495 },
    { day: 'Sun', oxygen: 445, co2: 490 },
  ];

  const temperature = 24.5; // °C
  const humidity = 65; // %
  const waterUsage = 340; // L/day

  // Plant health status
  const plantHealth = [
    { species: 'Lettuce', health: 95 },
    { species: 'Potatoes', health: 87 },
    { species: 'Tomatoes', health: 92 },
    { species: 'Soybeans', health: 80 },
    { species: 'Wheat', health: 88 },
  ];

  return (
    <>
      <Card className='w-full max-w-lg absolute bottom-24 left-4 z-10 pointer-events-auto shadow-lg bg-white-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-90 border border-gray-100'>
        <CardHeader className='border-b border-white/10'>
          <div className='flex items-center'>
            <span className='h-3 w-3 rounded-full bg-blue-500 mr-2'></span>
            <CardTitle className='text-indigo-100'>
              Water Systems Status
            </CardTitle>
          </div>
          <CardDescription
            className='text-indigo-200/70 cursor-pointer hover:text-indigo-200'
            onClick={() => setInfoDialogOpen(true)}>
            Water ice near the Martian poles
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6 pt-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <div className='flex justify-between text-sm mb-1'>
                <span className='text-indigo-100/80'>Temperature</span>
                <span className='font-bold text-indigo-100'>
                  {temperature}°C
                </span>
              </div>
              <div className='h-2 w-full bg-white/30 rounded-full overflow-hidden backdrop-blur-sm'>
                <div
                  className='h-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500'
                  style={{ width: `${(temperature / 40) * 100}%` }}></div>
              </div>
              <div className='flex justify-between text-xs text-indigo-100/60 mt-1'>
                <span>10°C</span>
                <span>25°C</span>
                <span>40°C</span>
              </div>
            </div>

            <div>
              <div className='flex justify-between text-sm mb-1'>
                <span className='text-indigo-100/80'>Humidity</span>
                <span className='font-bold text-indigo-100'>{humidity}%</span>
              </div>
              <div className='w-full bg-white/30 rounded-full h-2.5 overflow-hidden backdrop-blur-sm'>
                <div
                  className='h-full rounded-full bg-white'
                  style={{ width: `${humidity}%` }}></div>
              </div>
            </div>
          </div>

          <div className='backdrop-blur-md p-4 rounded-lg border border-white/20'>
            <h3 className='text-sm font-medium mb-4 text-indigo-100'>
              Weekly Gas Exchange
            </h3>
            <ResponsiveContainer width='100%' height={200}>
              <LineChart
                data={gasExchangeData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  opacity={0.2}
                  stroke='#fff'
                />
                <XAxis dataKey='day' stroke='#fff' />
                <YAxis stroke='#fff' />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='oxygen'
                  stroke='#16a34a'
                  name='O₂ Production (L/day)'
                  strokeWidth={2}
                />
                <Line
                  type='monotone'
                  dataKey='co2'
                  stroke='#64748b'
                  name='CO₂ Absorption (L/day)'
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div className='flex justify-between mb-2'>
              <h3 className='text-sm font-medium text-indigo-100'>
                Plant Health Status
              </h3>
              <div className='text-sm'>
                <span className='text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800'>
                  Water: {waterUsage} L/day
                </span>
              </div>
            </div>
            <div className='space-y-2'>
              {plantHealth.map((plant) => (
                <div key={plant.species} className='flex items-center'>
                  <div className='w-24 text-xs text-indigo-100'>
                    {plant.species}
                  </div>
                  <div className='flex-1'>
                    <div className='w-full bg-white/30 rounded-full h-2.5 overflow-hidden backdrop-blur-sm'>
                      <div
                        className={`h-full rounded-full ${
                          plant.health > 90
                            ? 'bg-green-500'
                            : plant.health > 80
                            ? 'bg-yellow-400'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${plant.health}%` }}></div>
                    </div>
                  </div>
                  <div className='w-12 text-right text-xs text-indigo-100'>
                    {plant.health}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Water Systems Information</AlertDialogTitle>
            <AlertDialogDescription>
              <p className='mb-4'>
                The Water Systems module monitors all aspects of the
                habitat&apos;s water cycle, from purification and distribution
                to plant irrigation and recycling.
              </p>
              <p className='mb-4'>
                This closed-loop system achieves 98% water recovery through
                advanced filtration, vapor recovery, and condensation
                technologies. Water quality is continuously monitored for
                bacterial content, mineral balance, and chemical composition.
              </p>
              <p>
                The system integrates with the habitat&apos;s greenhouse
                operations, automatically adjusting irrigation schedules based
                on plant growth stages and environmental conditions, minimizing
                waste while maximizing crop yields.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
