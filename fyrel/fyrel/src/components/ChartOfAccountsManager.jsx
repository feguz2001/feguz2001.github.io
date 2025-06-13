import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Save, PlusCircle, XCircle, Edit, Trash2, Briefcase, ListChecks } from 'lucide-react';

const AccountForm = ({ onSave, accountToEdit, clearEdit }) => {
  const [formData, setFormData] = useState({ code: '', name: '', type: 'detail' });
  const { toast } = useToast();
  const isEditing = !!accountToEdit;

  useEffect(() => {
    if (accountToEdit) setFormData(accountToEdit);
    else setFormData({ code: '', name: '', type: 'detail' });
  }, [accountToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast({ title: "Error", description: "Código y Nombre son requeridos.", variant: "destructive" });
      return;
    }
    onSave(formData);
    toast({ title: isEditing ? "¡Cuenta Actualizada!" : "¡Cuenta Agregada!" });
    handleClear();
  };

  const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
  const handleClear = () => {
    setFormData({ code: '', name: '', type: 'detail' });
    if (clearEdit) clearEdit();
  };

  return (
    <Card className="glass-effect border-primary/20 mb-6">
      <CardHeader><CardTitle className="gradient-text text-xl flex items-center">{isEditing ? <Save className="mr-2"/> : <PlusCircle className="mr-2"/>}{isEditing ? 'Editar Cuenta' : 'Agregar Cuenta Contable'}</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input name="code" value={formData.code} onChange={e => handleChange(e.target.name, e.target.value)} placeholder="Código (Ej: 1101.01)" disabled={isEditing} className="bg-background/50"/>
            <Input name="name" value={formData.name} onChange={e => handleChange(e.target.name, e.target.value)} placeholder="Nombre de Cuenta" className="bg-background/50"/>
            <Select value={formData.type} onValueChange={value => handleChange('type', value)}>
              <SelectTrigger className="bg-background/50"><SelectValue/></SelectTrigger>
              <SelectContent><SelectItem value="header">Cabecera</SelectItem><SelectItem value="detail">Detalle</SelectItem></SelectContent>
            </Select>
          </div>
          <CardFooter className="p-0 pt-3 flex justify-end space-x-2">
            {isEditing && <Button type="button" variant="outline" onClick={handleClear} className="hover:bg-destructive/10 text-sm"><XCircle className="mr-1 h-4 w-4"/>Cancelar</Button>}
            <Button type="submit" className="bg-gradient-to-r from-primary to-blue-600 text-white text-sm"><Save className="mr-1 h-4 w-4"/>{isEditing ? 'Guardar' : 'Agregar'}</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

const ChartOfAccountsManager = ({ accounts, onAddAccount, onUpdateAccount, onDeleteAccount }) => {
  const [accountToEdit, setAccountToEdit] = useState(null);
  const { toast } = useToast();

  const handleSave = (accountData) => {
    if (accounts.find(acc => acc.code === accountData.code && (!accountToEdit || acc.code !== accountToEdit.code))) {
        toast({ title: "Error", description: "El código de cuenta ya existe.", variant: "destructive" });
        return;
    }
    if (accountToEdit) onUpdateAccount(accountData);
    else onAddAccount(accountData);
    setAccountToEdit(null);
  };

  const handleDelete = (code) => {
    onDeleteAccount(code);
    toast({ title: "¡Cuenta Eliminada!"});
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <AccountForm onSave={handleSave} accountToEdit={accountToEdit} clearEdit={() => setAccountToEdit(null)} />
      
      <Card className="glass-effect border-primary/20">
        <CardHeader><CardTitle className="gradient-text text-2xl flex items-center"><ListChecks className="mr-2"/>Plan de Cuentas</CardTitle></CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-2 text-primary opacity-50"/>
                <p>No hay cuentas contables. Comienza agregando algunas.</p>
            </div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Nombre</TableHead><TableHead>Tipo</TableHead><TableHead className="text-center">Acciones</TableHead></TableRow></TableHeader>
              <TableBody>
                {accounts.sort((a,b) => a.code.localeCompare(b.code)).map((acc, i) => (
                  <motion.tr key={acc.code} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-primary/5">
                    <TableCell className="font-mono text-xs">{acc.code}</TableCell>
                    <TableCell className="font-medium">{acc.name}</TableCell>
                    <TableCell><span className={`text-xs px-2 py-0.5 rounded-full ${acc.type === 'header' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-sky-500/20 text-sky-400'}`}>{acc.type}</span></TableCell>
                    <TableCell className="text-center space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => setAccountToEdit(acc)} className="text-blue-400 h-7 w-7"><Edit className="h-3.5 w-3.5"/></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive h-7 w-7"><Trash2 className="h-3.5 w-3.5"/></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>¿Eliminar Cuenta?</AlertDialogTitle><AlertDialogDescription>No podrás deshacer esta acción.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(acc.code)} className="bg-destructive">Eliminar</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChartOfAccountsManager;