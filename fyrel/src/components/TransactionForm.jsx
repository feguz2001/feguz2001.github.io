import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Save, PlusCircle, XCircle, Repeat, Users } from 'lucide-react';

const TransactionForm = ({ products, contacts, onAddTransaction, onUpdateTransaction, transactionToEdit, clearEdit }) => {
  const [formData, setFormData] = useState({
    type: 'sale',
    productId: '',
    productName: '',
    quantity: '',
    unitPrice: '',
    total: '',
    contactId: '',
    date: new Date().toISOString().split('T')[0] 
  });
  const { toast } = useToast();
  const isEditing = !!transactionToEdit;

  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        type: transactionToEdit.type,
        productId: transactionToEdit.productId,
        productName: transactionToEdit.productName,
        quantity: transactionToEdit.quantity.toString(),
        unitPrice: transactionToEdit.unitPrice.toString(),
        total: transactionToEdit.total.toString(),
        contactId: transactionToEdit.contactId || '',
        date: transactionToEdit.date ? new Date(transactionToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({ type: 'sale', productId: '', productName: '', quantity: '', unitPrice: '', total: '', contactId: '', date: new Date().toISOString().split('T')[0] });
    }
  }, [transactionToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.type || !formData.productId || !formData.quantity || !formData.unitPrice) {
      toast({ title: "Error", description: "Tipo, producto, cantidad y precio unitario son requeridos.", variant: "destructive" });
      return;
    }

    const transactionData = {
      ...formData,
      quantity: parseInt(formData.quantity),
      unitPrice: parseFloat(formData.unitPrice),
      total: parseFloat(formData.total),
      date: new Date(formData.date).toISOString() 
    };

    if (isEditing) {
      onUpdateTransaction({ ...transactionToEdit, ...transactionData });
      toast({ title: "¡Transacción Actualizada!" });
    } else {
      onAddTransaction(transactionData);
      toast({ title: "¡Transacción Registrada!" });
    }
    handleClear();
  };

  const handleChange = (name, value) => {
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'quantity' || name === 'unitPrice' || name === 'productId' || name === 'type') {
        const product = products.find(p => p.id === (name === 'productId' ? value : prev.productId));
        const quantity = parseFloat(updated.quantity) || 0;
        let unitPrice = parseFloat(updated.unitPrice) || 0;

        if ((name === 'productId' || name === 'type') && product) {
          unitPrice = updated.type === 'sale' ? product.price : product.cost;
          updated.unitPrice = unitPrice.toString();
          updated.productName = product.name; 
        }
        updated.total = (quantity * unitPrice).toFixed(2);
      }
      return updated;
    });
  };

  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const unitPrice = formData.type === 'sale' ? product.price : product.cost;
      setFormData(prev => ({
        ...prev,
        productId,
        productName: product.name,
        unitPrice: unitPrice.toString(),
        total: ((parseFloat(prev.quantity) || 0) * unitPrice).toFixed(2)
      }));
    }
  };
  
  const handleClear = () => {
    setFormData({ type: 'sale', productId: '', productName: '', quantity: '', unitPrice: '', total: '', contactId: '', date: new Date().toISOString().split('T')[0] });
    if (clearEdit) clearEdit();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <Card className="glass-effect border-primary/20 card-hover">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl flex items-center">
            {isEditing ? <Repeat className="mr-2 h-6 w-6" /> : <PlusCircle className="mr-2 h-6 w-6" />}
            {isEditing ? 'Editar Transacción' : 'Registrar Transacción'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha *</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={(e) => handleChange(e.target.name, e.target.value)} className="bg-background/50"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="sale">Venta</SelectItem><SelectItem value="purchase">Compra</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactId">Cliente/Proveedor</Label>
                <Select value={formData.contactId} onValueChange={(value) => handleChange('contactId', value)}>
                  <SelectTrigger className="bg-background/50"><SelectValue placeholder="Seleccionar contacto" /></SelectTrigger>
                  <SelectContent>
                    {contacts.filter(c => c.type === (formData.type === 'sale' ? 'client' : 'supplier')).map(contact => (
                      <SelectItem key={contact.id} value={contact.id}>{contact.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product">Producto *</Label>
              <Select value={formData.productId} onValueChange={handleProductSelect}>
                <SelectTrigger className="bg-background/50"><SelectValue placeholder="Seleccionar producto" /></SelectTrigger>
                <SelectContent>{products.map(p => (<SelectItem key={p.id} value={p.id}>{p.name} ({p.code})</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad *</Label>
                <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="1" className="bg-background/50"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Precio Unitario *</Label>
                <Input id="unitPrice" name="unitPrice" type="number" step="0.01" value={formData.unitPrice} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="0.00" className="bg-background/50"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="total">Total</Label>
                <Input id="total" name="total" type="number" step="0.01" value={formData.total} readOnly className="bg-background/30 text-primary font-semibold"/>
              </div>
            </div>
            <CardFooter className="p-0 pt-4 flex justify-end space-x-2">
              {isEditing && (<Button type="button" variant="outline" onClick={handleClear} className="hover:bg-destructive/10 hover:text-destructive"><XCircle className="mr-2 h-4 w-4" /> Cancelar</Button>)}
              <Button type="submit" className="bg-gradient-to-r from-green-600 to-primary hover:from-green-600/90 text-white font-semibold">
                <Save className="mr-2 h-4 w-4" /> {isEditing ? 'Guardar Cambios' : 'Registrar'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TransactionForm;