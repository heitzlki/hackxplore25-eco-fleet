'use client';

import { SingleCode } from '@/components/magicui/single-code';
import { useStore } from '@/lib/store';
import { useEffect, useState } from 'react';

// Example XML code as fallback
const exampleCode =
  '<?xml version="1.0" encoding="UTF-8"?>\n<order>\n   <customerId></customerId>\n   <commission>Sägemühle Neubau von 15 MFH mit zwei Tiefgaragen und Technikzentrale</commission>\n   <type>Freihändige Vergabe</type>\n   <shippingConditionId></shippingConditionId>\n   <items>\n      <item>\n         <sku>01.1</sku>\n         <name>Türelement 875 x 2.125 mm</name>\n         <text>Liefern und Einbauen von Innentür-Elementen gemäß vorstehender Beschreibung. Elementgröße für Richtmaß: 875 x 2.125 mm</text>\n         <quantity>140</quantity>\n         <quantityUnit>St</quantityUnit>\n         <price></price>\n         <priceUnit>EUR</priceUnit>\n         <purchasePrice></purchasePrice>\n         <commission></commission>\n      </item>\n      <item>\n         <sku>01.2</sku>\n         <name>Türelement 750 x 2.125 mm</name>\n         <text>Wie Position 01.1 jedoch: Elementgröße für Richtmaß: 750 x 2.125 mm</text>\n         <quantity>1</quantity>\n         <quantityUnit>St</quantityUnit>\n         <price></price>\n         <priceUnit>EUR</priceUnit>\n         <purchasePrice></purchasePrice>\n         <commission></commission>\n      </item>\n      <item>\n         <sku>01.3</sku>\n         <name>Türelement 625 x 2.000 mm</name>\n         <text>Wie Position 01.1 jedoch: mit absenkbarer Bodendichtung. Elementgröße für Richtmaß: 625 x 2.000 mm</text>\n         <quantity>1</quantity>\n         <quantityUnit>St</quantityUnit>\n         <price></price>\n         <priceUnit>EUR</priceUnit>\n         <purchasePrice></purchasePrice>\n         <commission></commission>\n      </item>\n      <item>\n         <sku>01.4</sku>\n         <name>Feuchtraum-Türelement 875 x 2.125 mm</name>\n         <text>Wie Position 01.1 jedoch: mit zusätzlichem Feuchteschutz und Klimaklasse II.</text>\n         <quantity>75</quantity>\n         <quantityUnit>St</quantityUnit>\n         <price></price>\n         <priceUnit>EUR</priceUnit>\n         <purchasePrice></purchasePrice>\n         <commission></commission>\n      </item>\n      <item>\n         <sku>01.5</sku>\n         <name>Feuchtraum-Türelement 750 x 2.125 mm</name>\n         <text>Wie Position 01.1 jedoch: mit zusätzlichem Feuchteschutz und Klimaklasse II. Elementgröße für Richtmaß: 750 x 2.125 mm</text>\n         <quantity>11</quantity>\n         <quantityUnit>St</quantityUnit>\n         <price></price>\n         <priceUnit>EUR</priceUnit>\n         <purchasePrice></purchasePrice>\n         <commission></commission>\n      </item>\n      <item>\n         <sku>01.6</sku>\n         <name>HPL-Beschichtung</name>\n         <text>Alternativposition für Oberflächen: alle Türblätter der vorstehenden Positionen (01.1 - 01.5) mit HPL-Beschichtung.</text>\n         <quantity>228</quantity>\n         <quantityUnit>St</quantityUnit>\n         <price></price>\n         <priceUnit>EUR</priceUnit>\n         <purchasePrice></purchasePrice>\n         <commission></commission>\n      </item>\n      <item>\n         <sku>02.1</sku>\n         <name>Beschläge für Zimmertüren</name>\n         <text>bestehend aus: - Buntbart-Einsteckschloss, Klasse 1, 1-tourig, je 1 Schlüssel - Edelstahl-Rosettengarnitur Türdrücker: FSB 1076, Edelstahl feimatt gebürstet o.glw.</text>\n         <quantity>133</quantity>\n         <quantityUnit>St</quantityUnit>\n         <price></price>\n         <priceUnit>EUR</priceUnit>\n         <purchasePrice></purchasePrice>\n         <commission></commission>\n      </item>\n      <item>\n         <sku>02.2</sku>\n         <name>Beschläge für Zimmertür</name>\n         <text>Wie Position 02.1 jedoch: bestehend aus: - Profilzylinderschloss, 1-tourig, inkl. Schlüssel - Edelstahl-Rosettengarnitur</text>\n         <quantity>1</quantity>\n         <quantityUnit>St</quantityUnit>\n         <price></price>\n         <priceUnit>EUR</priceUnit>\n         <purchasePrice></purchasePrice>\n         <commission></commission>\n      </item>\n      <item>\n         <sku>02.3</sku>\n         <name>Beschläge für Bad- und WC-Türen</name>\n         <text>Wie Position 02.1 jedoch: bestehend aus: - WC-Einsteckschloss, Klasse 1, 1-tourig - Edelstahl-WC-Rosettengarnitur</text>\n         <quantity>95</quantity>\n         <quantityUnit>St</quantityUnit>\n         <price></price>\n         <priceUnit>EUR</priceUnit>\n         <purchasePrice></purchasePrice>\n         <commission></commission>\n      </item>\n      <item>\n         <sku>03.1</sku>\n         <name>Türstopper</name>\n         <text>Türstopper für Wandbefestigung für alle Türen. - Farbe: weiß - Material: Kunststoff - ø ca. 40 mm Bummsinchen o.glw.</text>\n         <quantity>228</quantity>\n         <quantityUnit>St</quantityUnit>\n         <price></price>\n         <priceUnit>EUR</priceUnit>\n         <purchasePrice></purchasePrice>\n         <commission></commission>\n      </item>\n   </items>\n</order>\n';

export default function PDFPage() {
  const { serverResponse } = useStore();
  const [codeToDisplay, setCodeToDisplay] = useState(exampleCode);
  const [fileName, setFileName] = useState('output.xml');

  useEffect(() => {
    if (serverResponse?.xml) {
      setCodeToDisplay(serverResponse.xml);
      if (serverResponse.file?.name) {
        // Use the uploaded file name if available

        const baseName = serverResponse.file.name.split('.')[0] || 'output';
        setFileName(`${baseName}.xml`);
      }
    }
  }, [serverResponse]);

  return (
    <div className='container max-w-7xl mx-auto px-4 py-8 pt-25'>
      <h1 className='text-2xl font-bold mb-6 text-center'>
        Generated XML Output
      </h1>

      {serverResponse?.success && (
        <div className='mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-md text-green-700 dark:text-green-300 max-w-3xl mx-auto'>
          <p className='text-sm text-center'>
            Successfully processed file: {serverResponse.file?.name}
          </p>
        </div>
      )}

      <div className='flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] max-w-7xl mx-auto'>
        {/* PDF Viewer */}
        <div className='w-full lg:w-1/2 bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden h-full'>
          <iframe
            src='/showcase.pdf'
            className='w-full h-full'
            title='PDF Viewer'
          />
        </div>

        {/* XML Code */}
        <div className='w-full lg:w-1/2 h-full overflow-auto'>
          <SingleCode
            code={codeToDisplay}
            language='xml'
            filename={fileName}
            lightTheme='github-light'
            darkTheme='github-dark'
            highlightColor='#ff5500'
          />
        </div>
      </div>
    </div>
  );
}
