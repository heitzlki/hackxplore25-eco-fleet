'use client';

import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BorderBeam } from '@/components/magicui/border-beam';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export type IconProps = React.HTMLAttributes<SVGElement>;

import {
  ArrowUpRight,
  Building,
  Euro,
  Info,
  Mail,
  Package,
  Phone,
  Plus,
  Star,
  User,
  X,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { useStore } from '@/lib/store';

// Define interfaces for the data structure
interface ContactInfo {
  name: string;
  institution?: string;
  email?: string;
}

interface Specification {
  category: string;
  items: string[];
}

interface NodeDetails {
  description?: string;
  specifications?: Specification[];
  warning?: string;
  institution?: string;
  website?: string;
  contacts?: ContactInfo[];
}

interface NodeData {
  id?: string;
  title: string;
  color: string;
  type: string;
  details?: NodeDetails;
}

// Mock data for permanent display when no node is selected
const mockProductData: NodeData = {
  title: 'TVB - Türblatt für Stahlumfassungszarge',
  color: 'hsl(210, 20%, 60%)',
  type: 'product',
  details: {
    description:
      'Technische Vorbemerkungen: Türblatt als stumpf einschlagende Türe mit Einfachfalz und Drückergarnitur.',
    specifications: [
      {
        category: 'TÜRBLATT',
        items: ['Mittellage Röhrenspankern', 'Türblattdicke ca.40mm'],
      },
      // {
      //   category: 'OBERFLÄCHE',
      //   items: [
      //     'weiß lackiert, ähnlich RAL 9016',
      //     'PU-Lack auf Grundierfolie',
      //     'Türblattkanten lackiert mit fugenloser Falzkante',
      //   ],
      // },
      {
        category: 'BESCHLÄGE',
        items: ['verstellbare Bänder, 2-tlg., vernickelt.'],
      },
    ],
    warning:
      'Achtung: Sämtliche Türblätter sind so einzubauen, dass ein Bodenspalt von ca 10mm für die mechanische Wohnraumlüftung gegeben ist!',
    institution: 'Türen & Zargen GmbH',
    website: 'https://tueren-zargen.de',
    contacts: [
      {
        name: 'Beratung & Verkauf',
        institution: 'Türen & Zargen Vertrieb',
        email: 'verkauf@tueren-zargen.de',
      },
    ],
  },
};

export default function InfoWindow() {
  // Use selected node data or mock data
  const displayData: NodeData = mockProductData;
  const { title, color, type, details } = displayData;
  const nodeColor = color || 'hsl(186,100%,50%)';

  return (
    <div className='fixed top-4 left-4 z-50'>
      <Card className='relative w-[380px] overflow-hidden'>
        <CardHeader className=''>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <div
                className='w-4 h-4 rounded-full'
                style={{ backgroundColor: nodeColor }}
              />
              <h3 className='text-lg font-medium'>{title}</h3>
            </div>
          </div>
          <Badge variant='outline' className='w-fit mt-2'>
            {'Technische Spezifikation'}
          </Badge>
        </CardHeader>

        <Separator />

        <CardContent className='pt-2'>
          {details?.description && (
            <div className='mb-4'>
              <p className='text-sm text-muted-foreground mb-1'>Beschreibung</p>
              <p className='text-sm'>{details.description}</p>
            </div>
          )}

          {/* Technical specifications */}
          {details?.specifications && (
            <div className='space-y-4 mb-4'>
              {details.specifications.map((spec, index) => (
                <div key={index} className='space-y-1'>
                  <p className='font-semibold text-sm'>{spec.category}:</p>
                  <ul className='list-inside space-y-1'>
                    {spec.items.map((item, itemIndex) => (
                      <li key={itemIndex} className='text-sm'>
                        - {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Warning notice */}
          {details?.warning && (
            <div className='bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4'>
              <p className='text-sm font-medium text-yellow-800'>
                {details.warning}
              </p>
            </div>
          )}

          {details?.institution && (
            <div className='flex items-start gap-2 mb-2'>
              <Building className='w-4 h-4 mt-0.5 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Hersteller</p>
                <p>{details.institution}</p>
              </div>
            </div>
          )}

          {details?.website && (
            <div className='flex items-start gap-2 mb-2'>
              <ArrowUpRight className='w-4 h-4 mt-0.5 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Website</p>
                <a
                  href={details.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 hover:underline'>
                  {details.website}
                </a>
              </div>
            </div>
          )}

          {details?.contacts && details.contacts.length > 0 && (
            <div className=''>
              <p className='text-sm text-muted-foreground mb-2'>Kontakte</p>
              <div className='space-y-3'>
                {details.contacts.map((contact, idx) => (
                  <div key={idx} className='bg-muted/50 p-3 rounded-lg'>
                    <div className='flex items-center gap-2 mb-1'>
                      <User className='w-4 h-4 text-muted-foreground' />
                      <p className='font-medium'>{contact.name}</p>
                    </div>
                    {contact.institution && (
                      <p className='text-sm text-muted-foreground mb-1'>
                        {contact.institution}
                      </p>
                    )}
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className='text-sm text-blue-500 hover:underline flex items-center gap-1'>
                        <Mail className='w-3 h-3' />
                        {contact.email}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className='pt-0'>
          {
            <Button className='w-full' variant='default'>
              Technische Details anfordern
            </Button>
          }
        </CardFooter>

        <BorderBeam
          duration={6}
          size={200}
          colorFrom={nodeColor}
          colorTo='transparent'
        />
      </Card>
    </div>
  );
}
