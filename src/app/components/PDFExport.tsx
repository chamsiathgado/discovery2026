import { Download } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import html2pdf from 'html2pdf.js';

export function PDFExport() {
  const handleDownloadPDF = () => {
    const element = document.body;
    const opt = {
      margin: 10,
      filename: 'POC_KEMET_AfricaCharge_Platform.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={handleDownloadPDF}
        size="lg"
        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
      >
        <Download className="w-5 h-5 mr-2" />
        Télécharger le POC en PDF
      </Button>
    </div>
  );
}
