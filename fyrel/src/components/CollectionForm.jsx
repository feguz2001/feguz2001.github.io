import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { DollarSign, Save, PlusCircle, User, Banknote } from 'lucide-react';

const CollectionForm = ({ clients, invoices, chartOfAccounts, onAddCollection }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    contactId: '',
    invoiceId: '',
    amount: '',
    paymentAccountCode: '', // e.g., Caja, Banco
    description: ''
  });
  const [clientInvoices, setClientInvoices] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (formData.contactId) {
      const filteredInvoices = invoices.filter(inv => inv.contactId === formData.contactId && inv.status === 'pending');
      setClientInvoices(filteredInvoices);
      // If only one pending invoice for client, auto-select it and its amount
      if (filteredInvoices.length === 1) {
        setFormData(prev => ({
          ...prev,
          invoiceId: filteredInvoices[0].id,
          amount: filteredInvoices[0].total.toString(),
          description: `Cobro Factura #${filteredInvoices[0].id}`
        }));
      } else {
        setFormData(prev => ({ ...prev, invoiceId: '', amount: '', description: '' }));
      }
    } else {
      setClientInvoices([]);
      setFormData(prev => ({ ...prev, invoiceId: '', amount: '', description: '' }));
    }
  }, [formData.contactId, invoices]);

  const handleInvoiceSelect = (invoiceId) => {
    const selectedInvoice = clientInvoices.find(inv => inv.id === invoiceId);
    if (selectedInvoice) {
      setFormData(prev => ({
        ...prev,
        invoiceId,
        amount: selectedInvoice.total.toString(),
        description: `Cobro Factura #${selectedInvoice.id}`
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.contactId || !formData.amount || !formData.paymentAccountCode) {
      toast({ title: "Error", description: "Cliente, monto y cuenta de cobro son requeridos.", variant: "destructive" });
      return;
    }
    onAddCollection({ ...formData, amount: parseFloat(formData.amount) });
    toast({ title: "¡Cobro Registrado!" });
    setFormData({ date: new Date().toISOString().split('T')[0], contactId: '', invoiceId: '', amount: '', paymentAccountCode: '', description: '' });
  };

  const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
  
  const cashBankAccounts = chartOfAccounts.filter(acc => acc.type === 'detail' && (acc.code.startsWith('1101') || acc.code.startsWith('1102'))); // Caja y Bancos

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl flex items-center">
            <DollarSign className="mr-2 text-green-400"/>Registrar Cobro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <Input type="date" name="date" value={formData.date} onChange={e => handleChange(e.target.name, e.target.value)} className="bg-background/50 h-10"/>
              <Select name="contactId" value={formData.contactId} onValueChange={val => handleChange('contactId', val)}>
                <SelectTrigger className="bg-background/50 h-10"><SelectValue placeholder="Cliente"/><User className="h-4 w-4 opacity-50 mr-2"/></SelectTrigger>
                <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              <Select name="invoiceId" value={formData.invoiceId} onValueChange={handleInvoiceSelect} disabled={!formData.contactId || clientInvoices.length === 0}>
                <SelectTrigger className="bg-background/50 h-10"><SelectValue placeholder="Factura (Opcional)"/><Banknote className="h-4 w-4 opacity-50 mr-2"/></SelectTrigger>
                <SelectContent>{clientInvoices.map(inv => <SelectItem key={inv.id} value={inv.id}>Fact. {inv.id} - {inv.total.toFixed(2)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input type="number" step="0.01" name="amount" value={formData.amount} onChange={e => handleChange(e.target.name, e.target.value)} placeholder="Monto Cobrado" className="bg-background/50 h-10"/>
              <Select name="paymentAccountCode" value={formData.paymentAccountCode} onValueChange={val => handleChange('paymentAccountCode', val)}>
                <SelectTrigger className="bg-background/50 h-10"><SelectValue placeholder="Cuenta de Ingreso (Caja/Banco)"/></SelectTrigger>
                <SelectContent>{cashBankAccounts.map(acc => <SelectItem key={acc.code} value={acc.code}>{acc.code} - {acc.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Input name="description" value={formData.description} onChange={e => handleChange(e.target.name, e.target.value)} placeholder="Descripción (Ej: Abono Factura #123)" className="bg-background/50 h-10"/>
            <CardFooter className="p-0 pt-4 flex justify-end">
              <Button type="submit" className="bg-gradient-to-r from-green-500 to-teal-500 text-white"><Save className="mr-2 h-4 w-4"/>Registrar Cobro</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CollectionForm;
