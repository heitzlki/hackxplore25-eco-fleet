'use client';

import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className='bg-background text-foreground'>
      <div className='container mx-auto px-4 pt-16 pb-8 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {/* Company Info */}
          <div>
            <h3 className='mb-4 text-xl font-bold text-primary'>PrizmAi</h3>
            <p className='mb-4 text-muted-foreground'>
              Empowering hotels, simplifying travel.
            </p>
            <div className='flex space-x-4'>
              <Link
                href='#'
                className='text-muted-foreground hover:text-foreground'>
                <Facebook size={20} />
              </Link>
              <Link
                href='#'
                className='text-muted-foreground hover:text-foreground'>
                <Twitter size={20} />
              </Link>
              <Link
                href='#'
                className='text-muted-foreground hover:text-foreground'>
                <Instagram size={20} />
              </Link>
              <Link
                href='#'
                className='text-muted-foreground hover:text-foreground'>
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='mb-4 text-xl font-bold'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  Start Journey
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  Become Partner
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className='mb-4 text-xl font-bold'>Contact Us</h3>
            <ul className='space-y-2'>
              {/* <li className='flex items-start'>
                <MapPin size={20} className='mr-2 text-muted-foreground' />
                <span className='text-muted-foreground'>
                  123 Coaching Street, Digital City, 10001
                </span>
              </li>
              <li className='flex items-center'>
                <Phone size={20} className='mr-2 text-muted-foreground' />
                <Link
                  href='tel:+123456789'
                  className='text-muted-foreground hover:text-foreground'>
                  +1 (234) 567-890
                </Link>
              </li> */}
              <li className='flex items-center'>
                <Mail size={20} className='mr-2 text-muted-foreground' />
                <Link
                  href='mailto:info@PrizmAi.com'
                  className='text-muted-foreground hover:text-foreground'>
                  info@PrizmAi.com
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className='mb-4 text-xl font-bold'>Legal</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/terms'
                  className='text-muted-foreground hover:text-foreground'>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href='/privacy'
                  className='text-muted-foreground hover:text-foreground'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/cookies'
                  className='text-muted-foreground hover:text-foreground'>
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/imprint'
                  className='text-muted-foreground hover:text-foreground'>
                  Imprint
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-12 border-t border-border pt-8 text-center'>
          <p className='text-sm text-muted-foreground'>
            &copy; {new Date().getFullYear()} PrizmAi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
