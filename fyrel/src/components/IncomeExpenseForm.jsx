import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Save, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const IncomeExpenseForm = ({ type, contacts, chartOfAccounts, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    contactId: '',
    accountId: '' // Account for contra-entry, e.g., Bank for income, Cash for expense
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.accountId) {
      toast({ title: "Error", description: "Descripción, monto y cuenta son requeridos.", variant: "destructive" });
      return;
    }
    onSubmit({ ...formData, amount: parseFloat(formData.amount) });
    toast({ title: `¡${type === 'income' ? 'Ingreso' : 'Egreso'} Registrado!` });
    setFormData({ date: new Date().toISOString().split('T')[0], description: '', amount: '', contactId: '', accountId: '' });
  };

  const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
  
  const relevantContacts = contacts.filter(c => c.type === (type === 'income' ? 'client' : 'supplier'));
  // Filter accounts: for income, typically cash/bank (assets); for expense, also cash/bank.
  const relevantAccounts = chartOfAccounts.filter(acc => acc.type === 'detail' && acc.code.startsWith('11')); // Example: Cash and Bank accounts

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl flex items-center">
            {type === 'income' ? <ArrowDownCircle className="mr-2 text-green-400"/> : <ArrowUpCircle className="mr-2 text-red-400"/>}
            Registrar {type === 'income' ? 'Ingreso' : 'Egreso'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input type="date" name="date" value={formData.date} onChange={e => handleChange(e.target.name, e.target.value)} className="bg-background/50"/>
              <Input name="description" value={formData.description} onChange={e => handleChange(e.target.name, e.target.value)} placeholder="Descripción" className="bg-background/50"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input type="number" step="0.01" name="amount" value={formData.amount} onChange={e => handleChange(e.target.name, e.target.value)} placeholder="Monto" className="bg-background/50"/>
              <Select name="contactId" value={formData.contactId} onValueChange={val => handleChange('contactId', val)}>
                <SelectTrigger className="bg-background/50"><SelectValue placeholder={type === 'income' ? 'Cliente' : 'Proveedor'}/></SelectTrigger>
                <SelectContent>{relevantContacts.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              <Select name="accountId" value={formData.accountId} onValueChange={val => handleChange('accountId', val)}>
                <SelectTrigger className="bg-background/50"><SelectValue placeholder="Cuenta Afectada (Ej: Caja/Banco)"/></SelectTrigger>
                <SelectContent>{relevantAccounts.map(acc => <SelectItem key={acc.code} value={acc.code}>{acc.code} - {acc.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <CardFooter className="p-0 pt-4 flex justify-end">
              <Button type="submit" className={`bg-gradient-to-r ${type === 'income' ? 'from-green-500 to-teal-500' : 'from-red-500 to-pink-500'} text-white`}>
                <Save className="mr-2 h-4 w-4"/>Registrar {type === 'income' ? 'Ingreso' : 'Egreso'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IncomeExpenseForm;