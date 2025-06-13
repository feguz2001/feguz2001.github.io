import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';


const InvoiceViewModal = ({ isOpen, onClose, invoice, contacts, products }) => {
  const { toast } = useToast();
  if (!invoice) return null;

  const formatCurrency = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-ES');
  const getContactName = (contactId) => contacts.find(c => c.id === contactId)?.name || 'N/A';
  const getProductName = (productId) => products.find(p => p.id === productId)?.name || 'Producto Desconocido';

  const handlePrint = () => {
    toast({ title: "🚧 ¡Función en desarrollo!", description: "La impresión de facturas estará disponible pronto. 🚀"});
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl glass-effect text-foreground">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl">Factura #{invoice.id}</DialogTitle>
          <DialogDescription>
            Cliente: {getContactName(invoice.contactId)} | Fecha: {formatDate(invoice.date)} | Vence: {formatDate(invoice.dueDate)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">P. Unitario</TableHead>
                <TableHead className="text-right">Total Línea</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lines.map((line, index) => (
                <TableRow key={index}>
                  <TableCell>{line.productName || getProductName(line.productId)}</TableCell>
                  <TableCell className="text-right">{line.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(line.unitPrice)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(line.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col items-end space-y-1 mt-4 pt-4 border-t border-primary/20">
          <div className="flex justify-between w-full max-w-xs text-sm"><span>Subtotal:</span> <span className="font-medium">{formatCurrency(invoice.subtotal)}</span></div>
          <div className="flex justify-between w-full max-w-xs text-sm"><span>IVA (12%):</span> <span className="font-medium">{formatCurrency(invoice.tax)}</span></div>
          <div className="flex justify-between w-full max-w-xs text-lg font-bold text-primary"><span>TOTAL:</span> <span>{formatCurrency(invoice.total)}</span></div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4"/>Imprimir</Button>
          <DialogClose asChild><Button>Cerrar</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceViewModal;