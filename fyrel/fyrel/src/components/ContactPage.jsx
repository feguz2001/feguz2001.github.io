import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; 
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Formulario de contacto enviado (simulado):", formData);
    toast({
      title: "¡Mensaje Enviado!",
      description: "Gracias por contactarnos. Te responderemos pronto. (Simulación)",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="glass-effect border-primary/20 card-hover">
        <CardHeader>
          <CardTitle className="gradient-text text-3xl flex items-center justify-center">
            <Mail className="mr-3 h-8 w-8 text-primary" />
            Contáctanos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center mb-6">
            ¿Tienes alguna pregunta o comentario? Completa el formulario y nos pondremos en contacto contigo.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center text-muted-foreground">
                <User className="mr-2 h-4 w-4" />Nombre Completo
              </Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Tu nombre" 
                className="bg-background/50 h-11" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />Correo Electrónico
              </Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="tu@correo.com" 
                className="bg-background/50 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center text-muted-foreground">
                <MessageSquare className="mr-2 h-4 w-4" />Mensaje
              </Label>
              <Textarea 
                id="message" 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="Escribe tu mensaje aquí..." 
                className="bg-background/50 min-h-[120px]"
              />
            </div>
            <CardFooter className="p-0 pt-4 flex justify-center">
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold py-3 px-8 text-lg rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Send className="mr-2 h-5 w-5" /> Enviar Mensaje
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContactPage;