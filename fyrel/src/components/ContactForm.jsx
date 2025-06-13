import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Save, PlusCircle, XCircle, Users } from 'lucide-react';

const ContactForm = ({ onAddContact, onUpdateContact, contactToEdit, clearEdit }) => {
  const [formData, setFormData] = useState({
    type: 'client', // 'client' or 'supplier'
    idType: 'RUC', // 'RUC', 'CEDULA'
    identification: '',
    name: '',
    email: '',
    phone: ''
  });
  const { toast } = useToast();
  const isEditing = !!contactToEdit;

  useEffect(() => {
    if (contactToEdit) {
      setFormData({
        type: contactToEdit.type,
        idType: contactToEdit.idType,
        identification: contactToEdit.identification,
        name: contactToEdit.name,
        email: contactToEdit.email || '',
        phone: contactToEdit.phone || ''
      });
    } else {
      setFormData({ type: 'client', idType: 'RUC', identification: '', name: '', email: '', phone: '' });
    }
  }, [contactToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.identification || !formData.name) {
      toast({
        title: "Error",
        description: "Identificación y Razón Social/Nombre son requeridos.",
        variant: "destructive"
      });
      return;
    }

    if (isEditing) {
      onUpdateContact({ ...contactToEdit, ...formData });
      toast({ title: "¡Contacto Actualizado!", description: `${formData.name} actualizado.` });
    } else {
      onAddContact(formData);
      toast({ title: "¡Contacto Agregado!", description: `${formData.name} agregado.` });
    }
    handleClear();
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({ type: 'client', idType: 'RUC', identification: '', name: '', email: '', phone: '' });
    if (clearEdit) clearEdit();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="glass-effect border-primary/20 card-hover">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl flex items-center">
            {isEditing ? <Save className="mr-2 h-6 w-6" /> : <PlusCircle className="mr-2 h-6 w-6" />}
            {isEditing ? 'Editar Contacto' : 'Agregar Contacto'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Contacto</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Cliente</SelectItem>
                    <SelectItem value="supplier">Proveedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="idType">Tipo Identificación</Label>
                <Select value={formData.idType} onValueChange={(value) => handleChange('idType', value)}>
                  <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RUC">RUC</SelectItem>
                    <SelectItem value="CEDULA">Cédula</SelectItem>
                    <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                    <SelectItem value="OTRO">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="identification">Identificación *</Label>
              <Input id="identification" name="identification" value={formData.identification} onChange={(e) => handleChange(e.target.name, e.target.value)} className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Razón Social / Nombre *</Label>
              <Input id="name" name="name" value={formData.name} onChange={(e) => handleChange(e.target.name, e.target.value)} className="bg-background/50" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico (opcional)</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={(e) => handleChange(e.target.name, e.target.value)} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Celular (opcional)</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={(e) => handleChange(e.target.name, e.target.value)} className="bg-background/50" />
              </div>
            </div>
            <CardFooter className="p-0 pt-4 flex justify-end space-x-2">
              {isEditing && (
                <Button type="button" variant="outline" onClick={handleClear} className="hover:bg-destructive/10 hover:text-destructive">
                  <XCircle className="mr-2 h-4 w-4" /> Cancelar
                </Button>
              )}
              <Button type="submit" className="bg-gradient-to-r from-primary to-blue-600 text-white font-semibold">
                <Save className="mr-2 h-4 w-4" /> {isEditing ? 'Guardar Cambios' : 'Agregar Contacto'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContactForm;