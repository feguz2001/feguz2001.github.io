import React from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, FileText as FilePdf } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ReportToolbar = ({ onExportExcel, onExportPDF }) => {
  const { toast } = useToast();

  const handleExcel = () => {
    if (onExportExcel) onExportExcel();
    else toast({ title: "🚧 En desarrollo", description: "Exportación a Excel no implementada para esta sección.", variant: "default" });
  };

  const handlePDF = () => {
    if (onExportPDF) onExportPDF();
    else toast({ title: "🚧 En desarrollo", description: "Exportación a PDF no implementada para esta sección.", variant: "default" });
  };

  return (
    <div className="flex justify-end space-x-2 mb-4">
      <Button onClick={handleExcel} variant="outline" size="sm" className="text-green-400 border-green-400 hover:bg-green-400/10">
        <FileSpreadsheet className="h-4 w-4 mr-2"/>Exportar Excel
      </Button>
      <Button onClick={handlePDF} variant="outline" size="sm" className="text-red-400 border-red-400 hover:bg-red-400/10">
        <FilePdf className="h-4 w-4 mr-2"/>Exportar PDF
      </Button>
    </div>
  );
};

export default ReportToolbar;
