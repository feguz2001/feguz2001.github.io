import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from 'framer-motion';
import { Edit, Trash2, PackageOpen, TrendingUp, TrendingDown, PackageCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProductList = ({ products, onEditProduct, onDeleteProduct }) => {
  const { toast } = useToast();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handleDelete = (productId) => {
    onDeleteProduct(productId);
    toast({ title: "¡Producto Eliminado!", description: "El producto ha sido eliminado." });
  };

  if (products.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-center py-12 glass-effect rounded-lg">
        <PackageOpen className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse-slow" />
        <h3 className="text-2xl font-semibold text-primary mb-2">No hay productos registrados</h3>
        <p className="text-muted-foreground">Agrega productos para verlos aquí y controlar tu inventario.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
      <Card className="glass-effect border-primary/20">
        <CardHeader><CardTitle className="gradient-text text-2xl">Inventario de Productos</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Stock Inicial</TableHead>
                <TableHead className="text-right text-green-400">Entradas</TableHead>
                <TableHead className="text-right text-red-400">Salidas</TableHead>
                <TableHead className="text-right text-primary">Stock Final</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                <TableHead className="text-right">P. Venta</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <motion.tr key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="hover:bg-primary/5">
                  <TableCell className="font-mono text-xs text-muted-foreground">{product.code || product.id}</TableCell>
                  <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.category || '-'}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{product.initialStock || 0}</TableCell>
                  <TableCell className="text-right text-green-400 flex items-center justify-end">
                    <TrendingUp className="h-3 w-3 mr-1"/> {product.entradas || 0}
                  </TableCell>
                  <TableCell className="text-right text-red-400 flex items-center justify-end">
                     <TrendingDown className="h-3 w-3 mr-1"/> {product.salidas || 0}
                  </TableCell>
                  <TableCell className="text-right text-primary font-semibold flex items-center justify-end">
                    <PackageCheck className="h-3 w-3 mr-1"/> {product.stock || 0}
                  </TableCell>
                  <TableCell className="text-right text-orange-400">{formatCurrency(product.cost)}</TableCell>
                  <TableCell className="text-right text-teal-400">{formatCurrency(product.price)}</TableCell>
                  <TableCell className="text-center space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onEditProduct(product)} className="text-blue-400 hover:text-blue-300"><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>Esta acción eliminará permanentemente el producto.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
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

export default ProductList;