import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Send, Save, PlusCircle, User, Banknote } from 'lucide-react';

const PaymentForm = ({ suppliers, chartOfAccounts, onAddPayment }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    contactId: '', // Proveedor
    amount: '',
    paymentAccountCode: '', // Cuenta de donde sale el dinero (Caja, Banco)
    description: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.contactId || !formData.amount || !formData.paymentAccountCode) {
      toast({ title: "Error", description: "Proveedor, monto y cuenta de pago son requeridos.", variant: "destructive" });
      return;
    }
    onAddPayment({ ...formData, amount: parseFloat(formData.amount) });
    toast({ title: "¡Pago Registrado!" });
    setFormData({ date: new Date().toISOString().split('T')[0], contactId: '', amount: '', paymentAccountCode: '', description: '' });
  };

  const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
  
  const cashBankAccounts = chartOfAccounts.filter(acc => acc.type === 'detail' && (acc.code.startsWith('1101') || acc.code.startsWith('1102'))); // Caja y Bancos

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl flex items-center">
            <Send className="mr-2 text-red-400"/>Registrar Pago a Proveedor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <Input type="date" name="date" value={formData.date} onChange={e => handleChange(e.target.name, e.target.value)} className="bg-background/50 h-10"/>
              <Select name="contactId" value={formData.contactId} onValueChange={val => handleChange('contactId', val)}>
                <SelectTrigger className="bg-background/50 h-10"><SelectValue placeholder="Proveedor"/><User className="h-4 w-4 opacity-50 mr-2"/></SelectTrigger>
                <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input type="number" step="0.01" name="amount" value={formData.amount} onChange={e => handleChange(e.target.name, e.target.value)} placeholder="Monto Pagado" className="bg-background/50 h-10"/>
              <Select name="paymentAccountCode" value={formData.paymentAccountCode} onValueChange={val => handleChange('paymentAccountCode', val)}>
                <SelectTrigger className="bg-background/50 h-10"><SelectValue placeholder="Cuenta de Salida (Caja/Banco)"/></SelectTrigger>
                <SelectContent>{cashBankAccounts.map(acc => <SelectItem key={acc.code} value={acc.code}>{acc.code} - {acc.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Input name="description" value={formData.description} onChange={e => handleChange(e.target.name, e.target.value)} placeholder="Descripción (Ej: Abono Factura Proveedor #XYZ)" className="bg-background/50 h-10"/>
            <CardFooter className="p-0 pt-4 flex justify-end">
              <Button type="submit" className="bg-gradient-to-r from-red-500 to-pink-500 text-white"><Save className="mr-2 h-4 w-4"/>Registrar Pago</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentForm;
