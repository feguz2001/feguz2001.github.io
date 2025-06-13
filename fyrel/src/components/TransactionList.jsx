import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from 'framer-motion';
import { Edit, Trash2, ShoppingBag, UserCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TransactionList = ({ transactions, contacts, onEditTransaction, onDeleteTransaction }) => {
  const { toast } = useToast();

  const formatCurrency = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleDelete = (transactionId) => {
    onDeleteTransaction(transactionId);
    toast({ title: "¡Transacción Eliminada!" });
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'N/A';
  };

  if (transactions.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 glass-effect rounded-lg">
        <ShoppingBag className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse-slow" />
        <h3 className="text-2xl font-semibold text-primary mb-2">No hay transacciones</h3>
        <p className="text-muted-foreground">Realiza ventas o compras para verlas aquí.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="glass-effect border-primary/20">
        <CardHeader><CardTitle className="gradient-text text-2xl">Historial de Transacciones</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Cliente/Prov.</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice().reverse().map((transaction, index) => (
                <motion.tr key={transaction.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-primary/5">
                  <TableCell className="text-muted-foreground text-xs">{formatDate(transaction.date)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${transaction.type === 'sale' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {transaction.type === 'sale' ? 'Venta' : 'Compra'}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{transaction.productName}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    <UserCheck className="h-3 w-3 inline mr-1"/>{getContactName(transaction.contactId)}
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${transaction.type === 'sale' ? 'text-green-400' : 'text-blue-400'}`}>{formatCurrency(transaction.total)}</TableCell>
                  <TableCell className="text-center space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onEditTransaction(transaction)} className="text-blue-400 hover:text-blue-300"><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Eliminará la transacción y asientos asociados.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(transaction.id)} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction></AlertDialogFooter>
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

export default TransactionList;