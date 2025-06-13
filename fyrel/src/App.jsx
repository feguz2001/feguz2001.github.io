import React, { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import Sidebar, { FloatingToggle } from '@/components/Sidebar';
import ProductForm from '@/components/ProductForm';
import ProductList from '@/components/ProductList';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import JournalBook from '@/components/JournalBook';
import GeneralLedger from '@/components/GeneralLedger';
import FinancialStatements from '@/components/FinancialStatements';
import ContactForm from '@/components/ContactForm';
import ClientList from '@/components/ClientList';
import SupplierList from '@/components/SupplierList';
import ChartOfAccountsManager from '@/components/ChartOfAccountsManager';
import ManualJournalEntryForm from '@/components/ManualJournalEntryForm';
import IncomeExpenseForm from '@/components/IncomeExpenseForm';
import InvoiceForm from '@/components/InvoiceForm';
import InvoiceList from '@/components/InvoiceList';
import InvoiceViewModal from '@/components/InvoiceViewModal';
import CollectionForm from '@/components/CollectionForm';
import PaymentForm from '@/components/PaymentForm';
import Login from '@/components/Login'; 
import ReportToolbar from '@/components/ReportToolbar';
import ContactPage from '@/components/ContactPage';
import { useAccounting } from '@/hooks/useAccounting';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, TrendingUp, BookOpen, BarChart3, DollarSign, Package, Menu, Users, Briefcase, FilePlus, ArrowDownCircle, ArrowUpCircle, Receipt, UserCheck, Truck, CreditCard, Coins as HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';


function App() {
  const accounting = useAccounting();
  const { toast } = useToast();
  const {
    products, transactions, journalEntries, contacts, chartOfAccounts, invoices, manualJournalEntries, payments, collections,
    addProduct, updateProduct, deleteProduct,
    addTransaction, updateTransaction, deleteTransaction,
    getGeneralLedger, getFinancialStatements,
    addContact, updateContact, deleteContact,
    addChartOfAccount, updateChartOfAccount, deleteChartOfAccount,
    addInvoice, updateInvoice, deleteInvoice,
    addManualJournalEntry, addIncome, addExpense,
    addPayment, addCollection
  } = accounting;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [productToEdit, setProductToEdit] = useState(null);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [contactToEdit, setContactToEdit] = useState(null);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [currentView, setCurrentView] = useState('login'); 

  useEffect(() => {
    document.title = "FYREL - Sistema Contable";
    const user = localStorage.getItem('accounting-user');
    if (user) {
      setIsAuthenticated(true);
      setCurrentView('app'); 
    } else {
      setCurrentView('login'); 
    }
  }, []);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
    if (status) {
      setCurrentView('app');
    } else { 
        localStorage.removeItem('accounting-user');
        setCurrentView('login');
    }
  };
  
  const handleLogout = () => {
    handleLogin(false);
  };


  const generalLedger = getGeneralLedger();
  const financialStatements = getFinancialStatements();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const clearAllEdits = () => {
    setProductToEdit(null); setTransactionToEdit(null); setContactToEdit(null); setInvoiceToEdit(null);
  };

  const handleSetActiveSection = (section) => { setActiveSection(section); clearAllEdits(); };
  const handleEditProduct = (product) => { setProductToEdit(product); setActiveSection('products'); };
  const handleEditTransaction = (transaction) => { setTransactionToEdit(transaction); setActiveSection('transactions'); };
  const handleEditContact = (contact) => { 
    setContactToEdit(contact); 
    setActiveSection(contact.type === 'client' ? 'clients' : 'suppliers'); 
  };
  const handleEditInvoice = (invoice) => { setInvoiceToEdit(invoice); setActiveSection('invoices'); };
  const handleViewInvoice = (invoice) => setViewingInvoice(invoice);
  
  const clients = contacts.filter(c => c.type === 'client');
  const suppliers = contacts.filter(c => c.type === 'supplier');

  const stats = {
    totalProducts: products.length,
    totalClients: clients.length,
    totalSuppliers: suppliers.length,
    totalTransactions: transactions.length,
    totalSales: invoices.reduce((sum, inv) => sum + inv.total, 0), 
    totalPurchases: transactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.total, 0),
    netIncome: financialStatements.incomeStatement.netIncome,
    cashBalance: financialStatements.cashFlow.netCashFlow,
    totalInvoices: invoices.length,
    totalCollections: collections.reduce((sum, col) => sum + col.amount, 0),
    totalPayments: payments.reduce((sum, pay) => sum + pay.amount, 0),
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount || 0);

  const handleGenericExportExcel = (data, fileName) => {
    exportToExcel(data, fileName);
    toast({ title: "¡Exportado a Excel!", description: `${fileName} exportado.`});
  }
  const handleGenericExportPDF = (title, headers, data) => {
    exportToPDF(title, headers, data);
    toast({ title: "¡Exportado a PDF!", description: `${title} exportado.`});
  }


  if (currentView !== 'app') {
    return <Login currentView={currentView} setCurrentView={setCurrentView} onLogin={handleLogin} />;
  }


  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <StatCard icon={Package} title="Productos" value={stats.totalProducts} color="text-primary" />
            <StatCard icon={UserCheck} title="Clientes" value={stats.totalClients} color="text-blue-400" />
            <StatCard icon={Truck} title="Proveedores" value={stats.totalSuppliers} color="text-purple-400" />
            <StatCard icon={Receipt} title="Facturas" value={stats.totalInvoices} color="text-orange-400" />
            <StatCard icon={TrendingUp} title="Ventas (Fact.)" value={formatCurrency(stats.totalSales)} color="text-green-400" />
            <StatCard icon={HandCoins} title="Cobros" value={formatCurrency(stats.totalCollections)} color="text-teal-400" />
            <StatCard icon={CreditCard} title="Pagos" value={formatCurrency(stats.totalPayments)} color="text-pink-400" />
            <StatCard icon={DollarSign} title="Utilidad Neta" value={formatCurrency(stats.netIncome)} color={stats.netIncome >=0 ? "text-green-400" : "text-red-400"} />
            <StatCard icon={BookOpen} title="Efectivo Total" value={formatCurrency(stats.cashBalance)} color={stats.cashBalance >=0 ? "text-green-400" : "text-red-400"} />
          </motion.div>
        );
      case 'clients':
        return (<div className="space-y-6"><ContactForm onAddContact={addContact} onUpdateContact={updateContact} contactToEdit={contactToEdit} clearEdit={() => setContactToEdit(null)} /><ClientList clients={clients} onEditContact={handleEditContact} onDeleteContact={deleteContact} /></div>);
      case 'suppliers':
        return (<div className="space-y-6"><ContactForm onAddContact={addContact} onUpdateContact={updateContact} contactToEdit={contactToEdit} clearEdit={() => setContactToEdit(null)} /><SupplierList suppliers={suppliers} onEditContact={handleEditContact} onDeleteContact={deleteContact} /></div>);
      case 'chartOfAccounts':
        return (<ChartOfAccountsManager accounts={chartOfAccounts} onAddAccount={addChartOfAccount} onUpdateAccount={updateChartOfAccount} onDeleteAccount={deleteChartOfAccount} />);
      case 'products':
        return (<div className="space-y-6"><ProductForm onAddProduct={addProduct} onUpdateProduct={updateProduct} productToEdit={productToEdit} clearEdit={() => setProductToEdit(null)} /><ProductList products={products} onEditProduct={handleEditProduct} onDeleteProduct={deleteProduct} /></div>);
      case 'transactions':
        return (<div className="space-y-6"><TransactionForm products={products} contacts={contacts} onAddTransaction={addTransaction} onUpdateTransaction={updateTransaction} transactionToEdit={transactionToEdit} clearEdit={() => setTransactionToEdit(null)} /><TransactionList transactions={transactions} contacts={contacts} onEditTransaction={handleEditTransaction} onDeleteTransaction={deleteTransaction} /></div>);
      case 'manualJournalEntries':
        return (<ManualJournalEntryForm chartOfAccounts={chartOfAccounts} onAddManualEntry={addManualJournalEntry} />);
      case 'income':
        return (<IncomeExpenseForm type="income" contacts={clients} chartOfAccounts={chartOfAccounts} onSubmit={addIncome} />);
      case 'expenses':
        return (<IncomeExpenseForm type="expense" contacts={suppliers} chartOfAccounts={chartOfAccounts} onSubmit={addExpense} />);
      case 'invoices':
        return (<div className="space-y-6"><InvoiceForm products={products} contacts={clients} onSaveInvoice={invoiceToEdit ? updateInvoice : addInvoice} invoiceToEdit={invoiceToEdit} clearEdit={() => setInvoiceToEdit(null)} /><InvoiceList invoices={invoices} contacts={contacts} onEditInvoice={handleEditInvoice} onDeleteInvoice={deleteInvoice} onViewInvoice={handleViewInvoice} /></div>);
      case 'collections':
        return (<CollectionForm clients={clients} invoices={invoices} chartOfAccounts={chartOfAccounts} onAddCollection={addCollection} />);
      case 'payments':
        return (<PaymentForm suppliers={suppliers} chartOfAccounts={chartOfAccounts} onAddPayment={addPayment} />);
      case 'journal': 
        return <JournalBook journalEntries={[...journalEntries, ...manualJournalEntries]} />;
      case 'ledger': 
        return <GeneralLedger generalLedger={getGeneralLedger()} />;
      case 'statements': return <FinancialStatements financialStatements={getFinancialStatements()} />;
      case 'contactUs': return <ContactPage />;
      default: return <p>Selecciona una sección</p>;
    }
  };
  
  const StatCard = ({ icon: Icon, title, value, color }) => (
    <motion.div className="glass-effect rounded-xl p-6 text-center card-hover flex flex-col items-center justify-center" whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
      <Icon className={`h-10 w-10 ${color} mb-3`} />
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </motion.div>
  );

  const CurrentContent = renderContent();
  const showReportToolbar = ['clients', 'suppliers', 'products', 'transactions', 'invoices', 'chartOfAccounts'].includes(activeSection);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 financial-grid">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeSection={activeSection} setActiveSection={handleSetActiveSection} onLogout={handleLogout} />
      <FloatingToggle isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 relative">
            {!isSidebarOpen && (<Button variant="ghost" size="icon" onClick={toggleSidebar} className="absolute left-0 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 md:hidden"><Menu className="h-6 w-6" /></Button>)}
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3 animate-float">FYREL</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Tu centro de control financiero</p>
          </motion.div>
          
          {showReportToolbar && (
            <ReportToolbar 
              onExportExcel={() => {
                if (['clients', 'suppliers', 'products', 'transactions', 'invoices', 'chartOfAccounts'].includes(activeSection)) {
                  let dataToExport, titleToExport;
                  if (activeSection === 'clients') {
                      titleToExport = "Lista_Clientes";
                      dataToExport = clients.map(c => ({ Nombre: c.name, TipoIdent: c.idType, Identificacion: c.identification, Email: c.email, Celular: c.phone }));
                  } else if (activeSection === 'suppliers') {
                      titleToExport = "Lista_Proveedores";
                      dataToExport = suppliers.map(s => ({ Nombre: s.name, TipoIdent: s.idType, Identificacion: s.identification, Email: s.email, Celular: s.phone }));
                  } else if (activeSection === 'products') {
                      titleToExport = "Inventario_Productos";
                      dataToExport = products.map(p => ({ Codigo: p.code, Nombre:p.name, Categoria:p.category, StockInicial:p.initialStock, Entradas:p.entradas, Salidas:p.salidas, StockFinal:p.stock, Costo:p.cost, PrecioVenta:p.price }));
                  } else if (activeSection === 'transactions') {
                      titleToExport = "Historial_Transacciones";
                      dataToExport = transactions.slice().reverse().map(t => ({ Fecha: new Date(t.date).toLocaleString(), Tipo: t.type, Producto: t.productName, Cliente_Prov: contacts.find(c=>c.id === t.contactId)?.name || 'N/A', Total: t.total }));
                  } else if (activeSection === 'invoices') {
                      titleToExport = "Lista_Facturas";
                      dataToExport = invoices.slice().reverse().map(i => ({ ID: i.id, Cliente: contacts.find(c=>c.id === i.contactId)?.name || 'N/A', FechaEmision: new Date(i.date).toLocaleDateString(), FechaVenc: new Date(i.dueDate).toLocaleDateString(), Total: i.total, Estado: i.status }));
                  } else if (activeSection === 'chartOfAccounts') {
                      titleToExport = "Plan_de_Cuentas";
                      dataToExport = chartOfAccounts.map(acc => ({ Codigo: acc.code, Nombre: acc.name, Tipo: acc.type }));
                  }
                  if (dataToExport) handleGenericExportExcel(dataToExport, titleToExport);
                  else toast({title: "No hay datos para exportar", variant: "default"});
                } else {
                   toast({title: "Exportación no disponible aquí", variant: "default"});
                }
              }}
              onExportPDF={() => {
                 if (['clients', 'suppliers', 'products', 'transactions', 'invoices', 'chartOfAccounts'].includes(activeSection)) {
                    let dataToExport, headersToExport, titleToExport;
                    if (activeSection === 'clients') {
                        titleToExport = "Lista de Clientes";
                        headersToExport = ["Nombre", "Tipo Ident.", "Identificación", "Email", "Celular"];
                        dataToExport = clients.map(c => [c.name, c.idType, c.identification, c.email || '-', c.phone || '-']);
                    } else if (activeSection === 'suppliers') {
                        titleToExport = "Lista de Proveedores";
                        headersToExport = ["Nombre", "Tipo Ident.", "Identificación", "Email", "Celular"];
                        dataToExport = suppliers.map(s => [s.name, s.idType, s.identification, s.email || '-', s.phone || '-']);
                    } else if (activeSection === 'products') {
                         titleToExport = "Inventario de Productos";
                         headersToExport = ["Código", "Nombre", "Categoría", "Stock Inicial", "Entradas", "Salidas", "Stock Final", "Costo", "P. Venta"];
                         dataToExport = products.map(p => [p.code, p.name, p.category, p.initialStock, p.entradas, p.salidas, p.stock, formatCurrency(p.cost), formatCurrency(p.price)]);
                    } else if (activeSection === 'transactions') {
                         titleToExport = "Historial de Transacciones";
                         headersToExport = ["Fecha", "Tipo", "Producto", "Cliente/Prov.", "Total"];
                         dataToExport = transactions.slice().reverse().map(t => [new Date(t.date).toLocaleString(), t.type, t.productName, contacts.find(c=>c.id === t.contactId)?.name || 'N/A', formatCurrency(t.total)]);
                    } else if (activeSection === 'invoices') {
                         titleToExport = "Lista de Facturas";
                         headersToExport = ["ID", "Cliente", "Fecha Emisión", "Fecha Venc.", "Total", "Estado"];
                         dataToExport = invoices.slice().reverse().map(i => [i.id, contacts.find(c=>c.id === i.contactId)?.name || 'N/A', new Date(i.date).toLocaleDateString(), new Date(i.dueDate).toLocaleDateString(), formatCurrency(i.total), i.status]);
                    } else if (activeSection === 'chartOfAccounts') {
                         titleToExport = "Plan de Cuentas";
                         headersToExport = ["Código", "Nombre", "Tipo"];
                         dataToExport = chartOfAccounts.map(acc => [acc.code, acc.name, acc.type]);
                    }
                    if (dataToExport && headersToExport) handleGenericExportPDF(titleToExport, headersToExport, dataToExport);
                    else toast({title: "No hay datos para exportar", variant: "default"});
                 } else {
                    toast({title: "Exportación no disponible aquí", variant: "default"});
                 }
              }}
            />
          )}

          <AnimatePresence mode="wait">{CurrentContent}</AnimatePresence>
        </div>
      </main>
      
      <InvoiceViewModal 
        isOpen={!!viewingInvoice} 
        onClose={() => setViewingInvoice(null)} 
        invoice={viewingInvoice}
        contacts={contacts}
        products={products}
      />
      <Toaster />
    </div>
  );
}

export default App;