import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Key, User, UserPlus, MailQuestion, ShieldQuestion } from 'lucide-react';

const FyrelLogo = () => (
  <svg width="60" height="60" viewBox="0 0 100 100" className="mx-auto mb-4">
    <defs>
      <linearGradient id="loginLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: 'var(--primary)', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity:1}} />
      </linearGradient>
    </defs>
    <path fill="url(#loginLogoGrad)" d="M20,20 H35 V40 H50 V20 H65 V80 H50 V60 H35 V80 H20 Z M70,20 H85 V80 H70 Z" />
  </svg>
);


const Login = ({ currentView, setCurrentView, onLogin }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('accounting-users')) || [];
    const foundUser = users.find(user => (user.username === username || user.email === username) && user.password === password);

    if (foundUser) {
      localStorage.setItem('accounting-user', JSON.stringify({ username: foundUser.username, email: foundUser.email }));
      onLogin(true);
      toast({ title: "¡Bienvenido!", description: "Has iniciado sesión correctamente." });
    } else {
      toast({ title: "Error de inicio de sesión", description: "Usuario o contraseña incorrectos.", variant: "destructive" });
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error de registro", description: "Las contraseñas no coinciden.", variant: "destructive" });
      return;
    }
    if (!email || !username || !password) {
      toast({ title: "Error de registro", description: "Todos los campos son obligatorios.", variant: "destructive" });
      return;
    }

    let users = JSON.parse(localStorage.getItem('accounting-users')) || [];
    if (users.find(user => user.username === username || user.email === email)) {
      toast({ title: "Error de registro", description: "El nombre de usuario o correo ya existe.", variant: "destructive" });
      return;
    }

    users.push({ email, username, password });
    localStorage.setItem('accounting-users', JSON.stringify(users));
    toast({ title: "¡Registro Exitoso!", description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión." });
    setCurrentView('login');
    setEmail(''); setUsername(''); setPassword(''); setConfirmPassword('');
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('accounting-users')) || [];
    const foundUser = users.find(user => user.email === email);

    if (foundUser) {
      const recoveryCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      localStorage.setItem(`recovery-${email}`, recoveryCode); 
      toast({
        title: "Código de Recuperación Enviado (Simulado)",
        description: `Si ${email} está registrado, recibirás un código. Tu código es: ${recoveryCode}`,
        duration: 10000, 
      });
    } else {
      toast({ title: "Recuperación de Contraseña", description: `Si ${email} está registrado, se enviará un código de recuperación.`, variant: "default" });
    }
    setEmail('');
  };


  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="login-username" className="flex items-center text-muted-foreground"><User className="h-4 w-4 mr-2" />Usuario o Correo</Label>
        <Input id="login-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="tu_usuario o tu@correo.com" className="bg-background/50 h-12 text-lg"/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password" className="flex items-center text-muted-foreground"><Key className="h-4 w-4 mr-2" />Contraseña</Label>
        <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-background/50 h-12 text-lg"/>
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold py-3 text-lg rounded-lg transition-all duration-300 transform hover:scale-105">
        <LogIn className="mr-2 h-5 w-5" /> Ingresar
      </Button>
    </form>
  );

  const renderSignupForm = () => (
    <form onSubmit={handleSignupSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="signup-email" className="flex items-center text-muted-foreground"><MailQuestion className="h-4 w-4 mr-2" />Correo Electrónico</Label>
        <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" className="bg-background/50 h-10"/>
      </div>
      <div className="space-y-1">
        <Label htmlFor="signup-username" className="flex items-center text-muted-foreground"><User className="h-4 w-4 mr-2" />Nombre de Usuario</Label>
        <Input id="signup-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="tu_usuario_unico" className="bg-background/50 h-10"/>
      </div>
      <div className="space-y-1">
        <Label htmlFor="signup-password" className="flex items-center text-muted-foreground"><Key className="h-4 w-4 mr-2" />Contraseña</Label>
        <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-background/50 h-10"/>
      </div>
      <div className="space-y-1">
        <Label htmlFor="signup-confirm-password" className="flex items-center text-muted-foreground"><ShieldQuestion className="h-4 w-4 mr-2" />Confirmar Contraseña</Label>
        <Input id="signup-confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="bg-background/50 h-10"/>
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-500/90 hover:to-teal-500/90 text-white font-semibold py-3 text-lg rounded-lg transition-all duration-300 transform hover:scale-105">
        <UserPlus className="mr-2 h-5 w-5" /> Crear Cuenta
      </Button>
    </form>
  );

  const renderForgotPasswordForm = () => (
     <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="forgot-email" className="flex items-center text-muted-foreground"><MailQuestion className="h-4 w-4 mr-2" />Correo Electrónico Registrado</Label>
        <Input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" className="bg-background/50 h-12 text-lg"/>
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-500/90 hover:to-red-500/90 text-white font-semibold py-3 text-lg rounded-lg transition-all duration-300 transform hover:scale-105">
        Enviar Código de Recuperación
      </Button>
    </form>
  );


  let formContent;
  let title;
  let description;
  let footerLinks;

  if (currentView === 'login') {
    formContent = renderLoginForm();
    title = "Iniciar Sesión en FYREL";
    description = "Accede a tu Sistema Contable Integral";
    footerLinks = (
      <>
        <Button variant="link" onClick={() => setCurrentView('signup')} className="text-sm text-primary hover:text-primary/80">¿No tienes cuenta? Crear una</Button>
        <Button variant="link" onClick={() => setCurrentView('forgotPassword')} className="text-sm text-muted-foreground hover:text-foreground">¿Olvidaste tu contraseña?</Button>
      </>
    );
  } else if (currentView === 'signup') {
    formContent = renderSignupForm();
    title = "Crear Cuenta en FYREL";
    description = "Regístrate para empezar a usar el sistema.";
    footerLinks = <Button variant="link" onClick={() => setCurrentView('login')} className="text-sm text-primary hover:text-primary/80">¿Ya tienes cuenta? Iniciar Sesión</Button>;
  } else if (currentView === 'forgotPassword') {
    formContent = renderForgotPasswordForm();
    title = "Recuperar Contraseña de FYREL";
    description = "Ingresa tu correo para recibir un código de recuperación.";
    footerLinks = <Button variant="link" onClick={() => setCurrentView('login')} className="text-sm text-primary hover:text-primary/80">Volver a Iniciar Sesión</Button>;
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 financial-grid p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect border-primary/30 shadow-2xl">
          <CardHeader className="text-center">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <FyrelLogo />
            </motion.div>
            <CardTitle className="gradient-text text-3xl">{title}</CardTitle>
            {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: currentView === 'login' ? 0 : (currentView === 'signup' ? 50 : -50) }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: currentView === 'login' ? 0 : (currentView === 'signup' ? -50 : 50) }}
                transition={{ duration: 0.3 }}
              >
                {formContent}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2 pt-4">
            {footerLinks}
            {currentView === 'login' && <p className="text-xs text-muted-foreground w-full text-center pt-2">Demo: user: admin, pass: admin (o crea una cuenta)</p>}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;