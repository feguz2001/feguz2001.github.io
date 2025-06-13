import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from 'framer-motion';
import { Edit, Trash2, Truck, FileSpreadsheet, FileText as FilePdf } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';

const SupplierList = ({ suppliers, onEditContact, onDeleteContact }) => {
  const { toast } = useToast();

  const handleDelete = (contactId) => {
    onDeleteContact(contactId);
    toast({ title: "¡Proveedor Eliminado!", description: "El proveedor ha sido eliminado." });
  };

  const handleExportExcel = () => {
    exportToExcel(suppliers.map(s => ({ 
        Nombre: s.name, 
        TipoIdent: s.idType, 
        Identificacion: s.identification, 
        Email: s.email, 
        Celular: s.phone 
    })), 'Lista_Proveedores');
    toast({ title: "¡Exportado a Excel!", description: "Lista de proveedores exportada." });
  };

  const handleExportPDF = () => {
    exportToPDF(
        'Lista de Proveedores',
        ['Nombre', 'Tipo Ident.', 'Identificación', 'Email', 'Celular'],
        suppliers.map(s => [s.name, s.idType, s.identification, s.email || '-', s.phone || '-'])
    );
    toast({ title: "¡Exportado a PDF!", description: "Lista de proveedores exportada." });
  };

  if (suppliers.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-center py-12 glass-effect rounded-lg">
        <Truck className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse-slow" />
        <h3 className="text-2xl font-semibold text-primary mb-2">No hay proveedores registrados</h3>
        <p className="text-muted-foreground">Agrega proveedores para verlos aquí.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
      <Card className="glass-effect border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="gradient-text text-2xl">Lista de Proveedores</CardTitle>
             <div className="space-x-2">
                <Button onClick={handleExportExcel} variant="outline" size="sm" className="text-green-400 border-green-400 hover:bg-green-400/10"><FileSpreadsheet className="h-4 w-4 mr-2"/>Excel</Button>
                <Button onClick={handleExportPDF} variant="outline" size="sm" className="text-red-400 border-red-400 hover:bg-red-400/10"><FilePdf className="h-4 w-4 mr-2"/>PDF</Button>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre / Razón Social</TableHead>
                <TableHead>Identificación</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Celular</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier, index) => (
                <motion.tr key={supplier.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="hover:bg-primary/5">
                  <TableCell className="font-medium text-foreground">{supplier.name}</TableCell>
                  <TableCell className="text-muted-foreground">{supplier.idType}: {supplier.identification}</TableCell>
                  <TableCell className="text-muted-foreground">{supplier.email || '-'}</TableCell>
                  <TableCell className="text-muted-foreground">{supplier.phone || '-'}</TableCell>
                  <TableCell className="text-center space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onEditContact(supplier)} className="text-blue-400 hover:text-blue-300"><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>Esta acción eliminará permanentemente el proveedor.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(supplier.id)} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
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

export default SupplierList;
