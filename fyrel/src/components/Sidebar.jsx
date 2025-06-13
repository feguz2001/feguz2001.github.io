import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Briefcase, Package, ShoppingCart, BookOpen, BarChart3, FileText, ChevronsLeft, ChevronsRight, Settings, FilePlus, ArrowDownCircle, ArrowUpCircle, Receipt, UserCheck, Truck, CreditCard, Coins as HandCoins, LogOut, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const navItemsPrimary = [
  { name: 'Panel', icon: BarChart3, section: 'dashboard' },
  { name: 'Clientes', icon: UserCheck, section: 'clients' },
  { name: 'Proveedores', icon: Truck, section: 'suppliers' },
  { name: 'Cuentas Cont.', icon: Briefcase, section: 'chartOfAccounts' },
  { name: 'Productos', icon: Package, section: 'products' },
];
const navItemsTransactions = [
  { name: 'Transacciones', icon: ShoppingCart, section: 'transactions' },
  { name: 'Facturación', icon: Receipt, section: 'invoices' },
  { name: 'Cobros', icon: HandCoins, section: 'collections' },
  { name: 'Pagos', icon: CreditCard, section: 'payments' },
  { name: 'Ingresos Varios', icon: ArrowDownCircle, section: 'income' },
  { name: 'Egresos Varios', icon: ArrowUpCircle, section: 'expenses' },
  { name: 'Asientos Man.', icon: FilePlus, section: 'manualJournalEntries' },
];
const navItemsReports = [
  { name: 'Libro Diario', icon: BookOpen, section: 'journal' },
  { name: 'Libro Mayor', icon: FileText, section: 'ledger' },
  { name: 'Estados Financ.', icon: BarChart3, section: 'statements' },
];
const navItemsSupport = [
  { name: 'Contacto', icon: MessageCircle, section: 'contactUs'}
];

const FyrelLogo = () => (
  <svg width="36" height="36" viewBox="0 0 100 100" className="mr-2">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: 'var(--primary)', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity:1}} />
      </linearGradient>
    </defs>
    <path fill="url(#logoGrad)" d="M20,20 H35 V40 H50 V20 H65 V80 H50 V60 H35 V80 H20 Z M70,20 H85 V80 H70 Z" />
  </svg>
);


const Sidebar = ({ isOpen, toggleSidebar, activeSection, setActiveSection, onLogout }) => {
  const { toast } = useToast(); 

  const NavSection = ({ title, items }) => (
    <div className="mb-3">
      {title && <h4 className="text-xs text-muted-foreground uppercase tracking-wider px-3 py-1 mb-1">{title}</h4>}
      <ul>
        {items.map((item, index) => (
          <motion.li
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * index + 0.2 }}
            className="mb-1"
          >
            <Button
              variant={activeSection === item.section ? 'secondary' : 'ghost'}
              className={`w-full justify-start text-left text-sm py-2 ${
                activeSection === item.section 
                  ? 'bg-primary/20 text-primary font-semibold' 
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
              }`}
              onClick={() => setActiveSection(item.section)}
            >
              <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
              {item.name}
            </Button>
          </motion.li>
        ))}
      </ul>
    </div>
  );


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-full w-64 bg-slate-800/80 backdrop-blur-md p-4 z-50 flex flex-col shadow-2xl border-r border-primary/20"
        >
          <div className="flex items-center justify-between mb-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center"
            >
              <FyrelLogo />
              <h2 className="text-2xl font-bold gradient-text">
                FYREL
              </h2>
            </motion.div>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-muted-foreground hover:text-foreground">
              <ChevronsLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <nav className="flex-grow overflow-y-auto custom-scrollbar">
            <NavSection items={navItemsPrimary} />
            <NavSection title="Movimientos" items={navItemsTransactions} />
            <NavSection title="Reportes" items={navItemsReports} />
            <NavSection title="Ayuda" items={navItemsSupport} />
          </nav>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-auto pt-4 border-t border-primary/10"
          >
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-primary/10 hover:text-foreground mb-1" onClick={() => toast({ title: "🚧 En desarrollo", description: "La configuración no está implementada aún.", variant: "default" })}>
              <Settings className="mr-3 h-5 w-5" />
              Configuración
            </Button>
            <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300">
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar Sesión
            </Button>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export const FloatingToggle = ({ isOpen, toggleSidebar }) => {
  if (isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed top-4 left-4 z-[60]"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="bg-slate-800/80 backdrop-blur-md text-primary hover:bg-primary/20 hover:text-primary rounded-full shadow-lg border-primary/30"
      >
        <ChevronsRight className="h-6 w-6" />
      </Button>
    </motion.div>
  );
};

export default Sidebar;