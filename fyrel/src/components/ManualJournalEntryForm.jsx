import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { FilePlus, Plus, Trash2, Save } from 'lucide-react';

const ManualJournalEntryForm = ({ chartOfAccounts, onAddManualEntry }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState([{ accountCode: '', description: '', debit: '', credit: '' }]);
  const { toast } = useToast();

  const handleAddLine = () => setLines([...lines, { accountCode: '', description: '', debit: '', credit: '' }]);
  const handleRemoveLine = (index) => setLines(lines.filter((_, i) => i !== index));
  const handleLineChange = (index, field, value) => {
    const newLines = [...lines];
    newLines[index][field] = value;
    setLines(newLines);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalDebit = lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);

    if (lines.some(l => !l.accountCode)) {
      toast({ title: "Error", description: "Todas las líneas deben tener una cuenta seleccionada.", variant: "destructive" });
      return;
    }
    if (totalDebit !== totalCredit || totalDebit === 0) {
      toast({ title: "Error", description: "El total de Débitos debe ser igual al total de Créditos y no ser cero.", variant: "destructive" });
      return;
    }

    onAddManualEntry({ date, description, lines });
    toast({ title: "¡Asiento Manual Agregado!" });
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setLines([{ accountCode: '', description: '', debit: '', credit: '' }]);
  };
  
  const detailAccounts = chartOfAccounts.filter(acc => acc.type === 'detail');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="glass-effect border-primary/20">
        <CardHeader><CardTitle className="gradient-text text-2xl flex items-center"><FilePlus className="mr-2"/>Crear Asiento Contable Manual</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="entryDate">Fecha</Label>
                <Input type="date" id="entryDate" value={date} onChange={e => setDate(e.target.value)} className="bg-background/50"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="entryDescription">Descripción General</Label>
                <Input id="entryDescription" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción del asiento" className="bg-background/50"/>
              </div>
            </div>

            {lines.map((line, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr_1fr_auto] gap-2 items-end p-2 border border-dashed border-primary/30 rounded-md">
                <Select value={line.accountCode} onValueChange={val => handleLineChange(index, 'accountCode', val)}>
                  <SelectTrigger className="bg-background/50 h-9 text-xs"><SelectValue placeholder="Cuenta"/></SelectTrigger>
                  <SelectContent>{detailAccounts.map(acc => <SelectItem key={acc.code} value={acc.code} className="text-xs">{acc.code} - {acc.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input value={line.description} onChange={e => handleLineChange(index, 'description', e.target.value)} placeholder="Desc. línea" className="bg-background/50 h-9 text-xs"/>
                <Input type="number" step="0.01" value={line.debit} onChange={e => handleLineChange(index, 'debit', e.target.value)} placeholder="Debe" className="bg-background/50 h-9 text-xs text-right"/>
                <Input type="number" step="0.01" value={line.credit} onChange={e => handleLineChange(index, 'credit', e.target.value)} placeholder="Haber" className="bg-background/50 h-9 text-xs text-right"/>
                <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveLine(index)} className="h-9 w-9"><Trash2 className="h-4 w-4"/></Button>
              </motion.div>
            ))}
            <Button type="button" variant="outline" onClick={handleAddLine} className="text-sm w-full hover:bg-primary/10"><Plus className="mr-2 h-4 w-4"/>Agregar Línea</Button>
            
            <div className="flex justify-end space-x-4 text-sm font-semibold pt-2">
                <span>Total Debe: <span className="text-green-400">{lines.reduce((s, l) => s + (parseFloat(l.debit) || 0), 0).toFixed(2)}</span></span>
                <span>Total Haber: <span className="text-blue-400">{lines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0).toFixed(2)}</span></span>
            </div>

            <CardFooter className="p-0 pt-4 flex justify-end">
              <Button type="submit" className="bg-gradient-to-r from-primary to-teal-600 text-white"><Save className="mr-2 h-4 w-4"/>Guardar Asiento</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ManualJournalEntryForm;