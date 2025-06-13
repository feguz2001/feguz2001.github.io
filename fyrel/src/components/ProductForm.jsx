import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Save, PlusCircle, XCircle } from 'lucide-react';

const ProductForm = ({ onAddProduct, onUpdateProduct, productToEdit, clearEdit }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    price: '',
    cost: '',
    category: '',
    initialStock: ''
  });
  const { toast } = useToast();
  const isEditing = !!productToEdit;

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        code: productToEdit.code || productToEdit.id, // Use code if available, else id
        name: productToEdit.name,
        description: productToEdit.description || '',
        price: productToEdit.price.toString(),
        cost: productToEdit.cost.toString(),
        category: productToEdit.category || '',
        initialStock: (productToEdit.initialStock || productToEdit.stock || 0).toString()
      });
    } else {
      setFormData({ code: '', name: '', description: '', price: '', cost: '', category: '', initialStock: '' });
    }
  }, [productToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.price || !formData.cost || !formData.initialStock) {
      toast({
        title: "Error",
        description: "Por favor completa código, nombre, precio, costo y stock inicial.",
        variant: "destructive"
      });
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      initialStock: parseInt(formData.initialStock)
    };

    if (isEditing) {
      onUpdateProduct({ ...productToEdit, ...productData, id: productToEdit.id });
      toast({ title: "¡Producto Actualizado!", description: `${formData.name} actualizado.` });
    } else {
      onAddProduct(productData);
      toast({ title: "¡Producto Agregado!", description: `${formData.name} agregado.` });
    }
    handleClear();
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClear = () => {
    setFormData({ code: '', name: '', description: '', price: '', cost: '', category: '', initialStock: '' });
    if (clearEdit) clearEdit();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="glass-effect border-primary/20 card-hover">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl flex items-center">
            {isEditing ? <Save className="mr-2 h-6 w-6" /> : <PlusCircle className="mr-2 h-6 w-6" />}
            {isEditing ? 'Editar Producto' : 'Agregar Producto'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código Producto *</Label>
                <Input id="code" name="code" value={formData.code} onChange={handleChange} placeholder="Ej: LAP-001" className="bg-background/50" disabled={isEditing}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Producto *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Laptop Dell XPS 15" className="bg-background/50"/>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Descripción detallada" className="bg-background/50"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Ej: Electrónicos" className="bg-background/50"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="initialStock">Stock Inicial *</Label>
                <Input id="initialStock" name="initialStock" type="number" value={formData.initialStock} onChange={handleChange} placeholder="0" className="bg-background/50" disabled={isEditing}/>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Costo *</Label>
                <Input id="cost" name="cost" type="number" step="0.01" value={formData.cost} onChange={handleChange} placeholder="0.00" className="bg-background/50"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio Venta *</Label>
                <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="0.00" className="bg-background/50"/>
              </div>
            </div>
            <CardFooter className="p-0 pt-4 flex justify-end space-x-2">
              {isEditing && (
                <Button type="button" variant="outline" onClick={handleClear} className="hover:bg-destructive/10 hover:text-destructive">
                  <XCircle className="mr-2 h-4 w-4" /> Cancelar
                </Button>
              )}
              <Button type="submit" className="bg-gradient-to-r from-primary to-blue-600 text-white font-semibold">
                <Save className="mr-2 h-4 w-4" /> {isEditing ? 'Guardar Cambios' : 'Agregar Producto'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductForm;