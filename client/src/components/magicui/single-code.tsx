'use client';

import { cn } from '@/lib/utils';
import {
  transformerNotationDiff,
  transformerNotationFocus,
  // type Transformer,
} from '@shikijs/transformers';
import { ClipboardCopy, Download, FileIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState, useMemo } from 'react';

interface SingleCodeProps {
  code: string;
  language: string;
  filename: string;
  lightTheme: string;
  darkTheme: string;
  highlightColor?: string;
}

export function SingleCode({
  code,
  language,
  filename,
  lightTheme,
  darkTheme,
  highlightColor = '#ff3333',
}: SingleCodeProps) {
  const { theme, systemTheme } = useTheme();
  const [highlighted, setHighlighted] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const selectedTheme = useMemo(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    return currentTheme === 'dark' ? darkTheme : lightTheme;
  }, [theme, systemTheme, darkTheme, lightTheme]);

  useEffect(() => {
    async function highlightCode() {
      try {
        const { codeToHtml } = await import('shiki');
        const { transformerNotationHighlight } = await import(
          '@shikijs/transformers'
        );

        const transformers: any[] = [
          transformerNotationHighlight({ matchAlgorithm: 'v3' }),
          transformerNotationDiff({ matchAlgorithm: 'v3' }),
          transformerNotationFocus({ matchAlgorithm: 'v3' }),
        ];

        const result = await codeToHtml(code, {
          lang: language,
          theme: selectedTheme,
          transformers,
        });
        setHighlighted(result);
      } catch (error) {
        console.error('Error highlighting code:', error);
        setHighlighted(`<pre>${code}</pre>`);
      }
    }
    highlightCode();
  }, [code, language, selectedTheme]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadFile = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderCode = (content: string, highlightedContent: string) => {
    if (highlightedContent) {
      return (
        <div
          style={{ '--highlight-color': highlightColor } as React.CSSProperties}
          className={cn(
            'h-full w-full overflow-auto bg-background font-mono text-xs',
            '[&>pre]:h-full [&>pre]:!w-screen [&>pre]:py-2',
            '[&>pre>code]:!inline-block [&>pre>code]:!w-full',
            '[&>pre>code>span]:!inline-block [&>pre>code>span]:w-full [&>pre>code>span]:px-4 [&>pre>code>span]:py-0.5',
            '[&>pre>code>.highlighted]:inline-block [&>pre>code>.highlighted]:w-full [&>pre>code>.highlighted]:!bg-[var(--highlight-color)]',
            '[&>pre>code>.add]:bg-[rgba(16,185,129,.16)] [&>pre>code>.remove]:bg-[rgba(244,63,94,.16)]'
          )}
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
        />
      );
    } else {
      return (
        <pre className='h-full overflow-auto break-all bg-background p-4 font-mono text-xs text-foreground'>
          {content}
        </pre>
      );
    }
  };

  return (
    <div className='mx-auto w-full max-w-5xl'>
      <div className='relative w-full overflow-hidden rounded-md border border-border'>
        <div className='code-container'>
          <div className='flex items-center justify-between border-b border-primary/20 bg-accent p-2 text-sm text-foreground'>
            <div className='flex items-center'>
              <FileIcon className='mr-2 h-4 w-4' />
              {filename}
            </div>
            <div className='flex space-x-2'>
              <button
                onClick={copyToClipboard}
                className={`flex items-center rounded-md p-1.5 transition-colors hover:bg-primary/10 ${
                  copySuccess ? 'text-green-500' : 'text-foreground'
                }`}
                title='Copy to clipboard'>
                <ClipboardCopy className='h-4 w-4' />
                {copySuccess && <span className='ml-1.5 text-xs'>Copied!</span>}
              </button>
              <button
                onClick={downloadFile}
                className='rounded-md p-1.5 text-foreground transition-colors hover:bg-primary/10'
                title={`Download as ${filename}`}>
                <Download className='h-4 w-4' />
              </button>
            </div>
          </div>
          {renderCode(code, highlighted)}
        </div>
      </div>
    </div>
  );
}
