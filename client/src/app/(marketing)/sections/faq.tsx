'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define interfaces for our data structures
interface Category {
  id: string;
  name: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

type FAQCategories = {
  [key: string]: FAQItem[];
};

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  const categories: Category[] = [
    { id: 'general', name: 'General' },
    { id: 'technical', name: 'Technical' },
    { id: 'integration', name: 'Integration' },
    { id: 'pricing', name: 'Pricing' },
    { id: 'security', name: 'Security' },
  ];

  const faqs: FAQCategories = {
    general: [
      {
        question: 'What is PrizmAi?',
        answer:
          'PrizmAi is an AI-powered platform that transforms PDF documents into structured, actionable data. We help businesses eliminate manual data entry and extract valuable insights from their documents.',
      },
      {
        question: 'What types of documents can PrizmAi process?',
        answer:
          'PrizmAi can process virtually any PDF document, including invoices, contracts, reports, forms, financial statements, and research papers, regardless of format or complexity.',
      },
      {
        question: 'How accurate is your data extraction?',
        answer:
          'Our AI achieves industry-leading accuracy rates exceeding 95% for most document types. For specialized documents, we offer customized models that can reach even higher accuracy levels.',
      },
      {
        question: 'How long does it take to process documents?',
        answer:
          'Most documents are processed within seconds. For complex or large batches, processing may take a few minutes. Our enterprise plans support high-volume processing with minimal latency.',
      },
    ],
    technical: [
      {
        question: 'What technologies does PrizmAi use?',
        answer:
          'PrizmAi leverages deep learning, computer vision, and natural language processing to understand document context and extract meaningful data with high accuracy.',
      },
      {
        question: 'Can PrizmAi handle handwritten text?',
        answer:
          'Yes, PrizmAi can recognize and extract most legible handwritten text, though accuracy varies based on handwriting clarity.',
      },
    ],
    integration: [
      {
        question: 'Can I integrate PrizmAi with my existing systems?',
        answer:
          'Yes, we offer a robust API and pre-built integrations for popular platforms like Salesforce, SAP, Microsoft 365, and Google Workspace. Custom integrations are available for enterprise customers.',
      },
      {
        question: 'How do I get started with integration?',
        answer:
          'Our documentation provides step-by-step guides for API integration. For enterprise customers, we offer dedicated integration support from our technical team.',
      },
    ],
    pricing: [
      {
        question: 'How is PrizmAi priced?',
        answer:
          'We offer tiered pricing based on document volume and feature requirements. Plans start at $99/month for small businesses, with custom enterprise pricing available for high-volume needs.',
      },
      {
        question: 'Is there a free trial?',
        answer:
          'Yes, we offer a 14-day free trial with access to all features and processing for up to 100 documents so you can experience the full power of PrizmAi.',
      },
    ],
    security: [
      {
        question: 'How secure is my data with PrizmAi?',
        answer:
          'We employ bank-level encryption for all data, both in transit and at rest. Our platform is SOC 2 Type II certified, GDPR compliant, and we offer private cloud deployments for organizations with strict security requirements.',
      },
      {
        question: 'Can I delete my data after processing?',
        answer:
          'Yes, you have complete control over your data. You can configure automatic deletion after processing or manually delete documents at any time through your dashboard.',
      },
    ],
  };

  const filteredFaqs: FAQItem[] =
    searchQuery.trim() === ''
      ? faqs[activeCategory]
      : Object.values(faqs)
          .flat()
          .filter(
            (faq) =>
              faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
          );

  // Update active category and reset open accordion item
  const handleTabChange = (value: string) => {
    setActiveCategory(value);
    setOpenItem(undefined);
  };

  return (
    <section className='bg-background py-24'>
      <div className='container mx-auto px-4 lg:px-8'>
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}>
          <h2 className='mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl'>
            Frequently Asked Questions
          </h2>
          <p className='mx-auto max-w-2xl text-xl text-muted-foreground'>
            Find answers to commonly asked questions about our platform.
          </p>
        </motion.div>

        <div className='mx-auto max-w-3xl mb-8'>
          <div className='relative'>
            <Search
              className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground '
              size={20}
            />
            <input
              type='text'
              placeholder='Search questions...'
              className='w-full rounded-lg border py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-2 focus:border-secondary/50'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {searchQuery.trim() === '' ? (
          <div className='mx-auto max-w-3xl'>
            <Tabs
              value={activeCategory}
              onValueChange={handleTabChange}
              className='w-full'>
              <TabsList className='w-full grid-cols-4 mb-8 bg-background border'>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className='bg-background'>
                    <Accordion
                      type='single'
                      collapsible
                      className='w-full'
                      value={openItem}
                      onValueChange={setOpenItem}>
                      {faqs[category.id].map((faq, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}>
                          <AccordionItem
                            value={`${category.id}-item-${index}`}
                            className=''>
                            <AccordionTrigger className='px-6 py-4 text-lg font-medium text-foreground hover:no-underline'>
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className='px-6 pb-4 text-muted-foreground'>
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        </motion.div>
                      ))}
                    </Accordion>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        ) : (
          <div className='mx-auto max-w-3xl'>
            {filteredFaqs.length > 0 ? (
              <div className='bg-background'>
                <Accordion
                  type='single'
                  collapsible
                  className='w-full'
                  value={openItem}
                  onValueChange={setOpenItem}>
                  {filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}>
                      <AccordionItem
                        value={`search-item-${index}`}
                        className='border-b border-border last:border-0'>
                        <AccordionTrigger className='px-6 py-4 text-lg font-medium text-foreground hover:no-underline'>
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className='px-6 pb-4 text-muted-foreground'>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </div>
            ) : (
              <p className='text-center text-muted-foreground'>
                No results found for &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
