import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from 'framer-motion';
import { Edit, Trash2, FileText, Eye, Printer } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const InvoiceList = ({ invoices, contacts, onEditInvoice, onDeleteInvoice, onViewInvoice }) => {
  const { toast } = useToast();

  const formatCurrency = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-ES');
  const getContactName = (contactId) => contacts.find(c => c.id === contactId)?.name || 'N/A';

  const handleDelete = (invoiceId) => {
    onDeleteInvoice(invoiceId);
    toast({ title: "¡Factura Eliminada!" });
  };
  
  const handlePrint = (invoice) => {
     toast({ title: "🚧 ¡Función en desarrollo!", description: "La impresión de facturas estará disponible pronto. 🚀"});
  }

  if (invoices.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 glass-effect rounded-lg">
        <FileText className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse-slow" />
        <h3 className="text-2xl font-semibold text-primary mb-2">No hay facturas</h3>
        <p className="text-muted-foreground">Crea facturas para tus clientes.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="glass-effect border-primary/20">
        <CardHeader><CardTitle className="gradient-text text-2xl">Lista de Facturas</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Factura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha Emisión</TableHead>
                <TableHead>Fecha Venc.</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.slice().reverse().map((invoice, index) => (
                <motion.tr key={invoice.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="hover:bg-primary/5">
                  <TableCell className="font-mono text-xs text-muted-foreground">{invoice.id}</TableCell>
                  <TableCell className="font-medium">{getContactName(invoice.contactId)}</TableCell>
                  <TableCell className="text-xs">{formatDate(invoice.date)}</TableCell>
                  <TableCell className="text-xs">{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">{formatCurrency(invoice.total)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                      invoice.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400' // overdue or cancelled
                    }`}>
                      {invoice.status === 'paid' ? 'Pagada' : invoice.status === 'pending' ? 'Pendiente' : 'Vencida'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onViewInvoice(invoice)} className="text-teal-400 h-7 w-7"><Eye className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="icon" onClick={() => onEditInvoice(invoice)} className="text-blue-400 h-7 w-7"><Edit className="h-3.5 w-3.5"/></Button>
                    <Button variant="ghost" size="icon" onClick={() => handlePrint(invoice)} className="text-purple-400 h-7 w-7"><Printer className="h-4 w-4"/></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive h-7 w-7"><Trash2 className="h-3.5 w-3.5"/></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>¿Eliminar Factura?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(invoice.id)} className="bg-destructive">Eliminar</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvoiceList;