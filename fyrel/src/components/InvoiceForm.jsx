import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Receipt, Plus, Trash2, Save, User, CalendarDays, Hash, XCircle } from 'lucide-react';

const InvoiceForm = ({ products, contacts, onSaveInvoice, invoiceToEdit, clearEdit }) => {
  const initialLine = { productId: '', quantity: 1, unitPrice: 0, total: 0 };
  const [formData, setFormData] = useState({
    contactId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default due date 30 days from now
    lines: [initialLine],
    subtotal: 0,
    tax: 0, // Assuming a simple tax model for now
    total: 0,
  });
  const { toast } = useToast();
  const isEditing = !!invoiceToEdit;

  useEffect(() => {
    if (invoiceToEdit) {
      setFormData({
        ...invoiceToEdit,
        date: new Date(invoiceToEdit.date).toISOString().split('T')[0],
        dueDate: new Date(invoiceToEdit.dueDate).toISOString().split('T')[0],
      });
    } else {
      // Reset form
      setFormData({
        contactId: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lines: [initialLine],
        subtotal: 0, tax: 0, total: 0,
      });
    }
  }, [invoiceToEdit]);

  useEffect(() => {
    calculateTotals();
  }, [formData.lines]);

  const calculateTotals = () => {
    const subtotal = formData.lines.reduce((sum, line) => sum + line.total, 0);
    const taxRate = 0.12; // Example 12% tax
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    setFormData(prev => ({ ...prev, subtotal, tax, total }));
  };

  const handleAddLine = () => setFormData(prev => ({ ...prev, lines: [...prev.lines, { ...initialLine }] }));
  const handleRemoveLine = (index) => setFormData(prev => ({ ...prev, lines: prev.lines.filter((_, i) => i !== index) }));
  
  const handleLineChange = (index, field, value) => {
    const newLines = [...formData.lines];
    newLines[index][field] = value;

    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newLines[index].unitPrice = product.price;
        newLines[index].productName = product.name; // Store product name for display
      }
    }
    
    if (field === 'productId' || field === 'quantity' || field === 'unitPrice') {
      const qty = parseFloat(newLines[index].quantity) || 0;
      const price = parseFloat(newLines[index].unitPrice) || 0;
      newLines[index].total = qty * price;
    }
    setFormData(prev => ({ ...prev, lines: newLines }));
  };

  const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.contactId || formData.lines.some(l => !l.productId || l.quantity <= 0)) {
      toast({ title: "Error", description: "Cliente y detalles de línea válidos son requeridos.", variant: "destructive" });
      return;
    }
    onSaveInvoice(formData);
    toast({ title: isEditing ? "¡Factura Actualizada!" : "¡Factura Creada!" });
    if(clearEdit) clearEdit(); else handleClear();
  };
  
  const handleClear = () => {
     setFormData({
        contactId: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lines: [initialLine],
        subtotal: 0, tax: 0, total: 0,
      });
      if (clearEdit) clearEdit();
  }

  const clientContacts = contacts.filter(c => c.type === 'client');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="glass-effect border-primary/20">
        <CardHeader><CardTitle className="gradient-text text-2xl flex items-center"><Receipt className="mr-2"/>{isEditing ? 'Editar Factura' : 'Crear Factura'}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="invoiceDate" className="flex items-center text-xs text-muted-foreground"><CalendarDays className="h-3 w-3 mr-1"/>Fecha Emisión</Label>
                <Input type="date" id="invoiceDate" name="date" value={formData.date} onChange={e => handleChange(e.target.name, e.target.value)} className="bg-background/50 h-9"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="dueDate" className="flex items-center text-xs text-muted-foreground"><CalendarDays className="h-3 w-3 mr-1"/>Fecha Vencimiento</Label>
                <Input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={e => handleChange(e.target.name, e.target.value)} className="bg-background/50 h-9"/>
              </div>
               <div className="space-y-1">
                <Label htmlFor="contactId" className="flex items-center text-xs text-muted-foreground"><User className="h-3 w-3 mr-1"/>Cliente</Label>
                <Select name="contactId" value={formData.contactId} onValueChange={val => handleChange('contactId', val)}>
                  <SelectTrigger className="bg-background/50 h-9"><SelectValue placeholder="Seleccionar Cliente"/></SelectTrigger>
                  <SelectContent>{clientContacts.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Líneas de Factura</Label>
              {formData.lines.map((line, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-center p-2 border border-dashed border-primary/30 rounded-md">
                  <Select value={line.productId} onValueChange={val => handleLineChange(index, 'productId', val)}>
                    <SelectTrigger className="bg-background/50 h-9 text-xs"><SelectValue placeholder="Producto"/></SelectTrigger>
                    <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id} className="text-xs">{p.name} ({p.code})</SelectItem>)}</SelectContent>
                  </Select>
                  <Input type="number" value={line.quantity} onChange={e => handleLineChange(index, 'quantity', e.target.value)} placeholder="Cant." className="bg-background/50 h-9 text-xs text-right"/>
                  <Input type="number" step="0.01" value={line.unitPrice} onChange={e => handleLineChange(index, 'unitPrice', e.target.value)} placeholder="P.Unit." className="bg-background/50 h-9 text-xs text-right" readOnly={!!line.productId}/>
                  <Input type="number" step="0.01" value={line.total.toFixed(2)} placeholder="Total Línea" readOnly className="bg-background/30 text-primary font-semibold h-9 text-xs text-right"/>
                  <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveLine(index)} className="h-8 w-8"><Trash2 className="h-3.5 w-3.5"/></Button>
                </motion.div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddLine} className="text-sm w-full hover:bg-primary/10"><Plus className="mr-2 h-4 w-4"/>Agregar Línea</Button>
            </div>
            
            <div className="flex flex-col items-end space-y-1 pt-4 border-t border-primary/20">
                <div className="flex justify-between w-full max-w-xs text-sm"><span>Subtotal:</span> <span className="font-medium">{formData.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between w-full max-w-xs text-sm"><span>IVA (12%):</span> <span className="font-medium">{formData.tax.toFixed(2)}</span></div>
                <div className="flex justify-between w-full max-w-xs text-lg font-bold text-primary"><span>TOTAL:</span> <span>{formData.total.toFixed(2)}</span></div>
            </div>

            <CardFooter className="p-0 pt-6 flex justify-end space-x-2">
              {isEditing && <Button type="button" variant="outline" onClick={handleClear} className="hover:bg-destructive/10"><XCircle className="mr-1 h-4 w-4"/>Cancelar</Button>}
              <Button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"><Save className="mr-2 h-4 w-4"/>{isEditing ? 'Guardar Cambios' : 'Crear Factura'}</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvoiceForm;