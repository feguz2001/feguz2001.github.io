
import { useState, useEffect } from 'react';

const initialChartOfAccounts = [
  { code: '1000', name: 'Activos', type: 'header' },
  { code: '1100', name: 'Activos Corrientes', type: 'header' },
  { code: '1101', name: 'Caja', type: 'detail', balance: 0 },
  { code: '1102', name: 'Bancos', type: 'detail', balance: 0 },
  { code: '1103', name: 'Cuentas por Cobrar Clientes', type: 'detail', balance: 0 },
  { code: '1200', name: 'Inventario', type: 'header' },
  { code: '1201', name: 'Inventario de Mercancías', type: 'detail', balance: 0 },
  { code: '2000', name: 'Pasivos', type: 'header' },
  { code: '2100', name: 'Pasivos Corrientes', type: 'header' },
  { code: '2101', name: 'Cuentas por Pagar Proveedores', type: 'detail', balance: 0 },
  { code: '3000', name: 'Patrimonio', type: 'header' },
  { code: '3101', name: 'Capital Social', type: 'detail', balance: 0 },
  { code: '4000', name: 'Ingresos', type: 'header' },
  { code: '4101', name: 'Ventas', type: 'detail', balance: 0 },
  { code: '4102', name: 'Ingresos por Servicios', type: 'detail', balance: 0 },
  { code: '5000', name: 'Gastos', type: 'header' },
  { code: '5101', name: 'Costo de Ventas', type: 'detail', balance: 0 },
  { code: '5102', name: 'Gastos Operativos', type: 'detail', balance: 0 },
  { code: '5103', name: 'Gastos de Administración', type: 'detail', balance: 0 },
];

export const useAccounting = () => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [contacts, setContacts] = useState([]); 
  const [chartOfAccounts, setChartOfAccounts] = useState(initialChartOfAccounts);
  const [invoices, setInvoices] = useState([]);
  const [manualJournalEntries, setManualJournalEntries] = useState([]);
  const [payments, setPayments] = useState([]); // Pagos a proveedores
  const [collections, setCollections] = useState([]); // Cobros a clientes

  useEffect(() => {
    const savedProducts = localStorage.getItem('accounting-products');
    const savedTransactions = localStorage.getItem('accounting-transactions');
    const savedJournalEntries = localStorage.getItem('accounting-journal-entries');
    const savedContacts = localStorage.getItem('accounting-contacts');
    const savedChartOfAccounts = localStorage.getItem('accounting-chartOfAccounts');
    const savedInvoices = localStorage.getItem('accounting-invoices');
    const savedManualJournalEntries = localStorage.getItem('accounting-manualJournalEntries');
    const savedPayments = localStorage.getItem('accounting-payments');
    const savedCollections = localStorage.getItem('accounting-collections');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedJournalEntries) setJournalEntries(JSON.parse(savedJournalEntries));
    if (savedContacts) setContacts(JSON.parse(savedContacts));
    if (savedChartOfAccounts) setChartOfAccounts(JSON.parse(savedChartOfAccounts));
    else setChartOfAccounts(initialChartOfAccounts);
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices));
    if (savedManualJournalEntries) setManualJournalEntries(JSON.parse(savedManualJournalEntries));
    if (savedPayments) setPayments(JSON.parse(savedPayments));
    if (savedCollections) setCollections(JSON.parse(savedCollections));

  }, []);

  useEffect(() => localStorage.setItem('accounting-products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('accounting-transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('accounting-journal-entries', JSON.stringify(journalEntries)), [journalEntries]);
  useEffect(() => localStorage.setItem('accounting-contacts', JSON.stringify(contacts)), [contacts]);
  useEffect(() => localStorage.setItem('accounting-chartOfAccounts', JSON.stringify(chartOfAccounts)), [chartOfAccounts]);
  useEffect(() => localStorage.setItem('accounting-invoices', JSON.stringify(invoices)), [invoices]);
  useEffect(() => localStorage.setItem('accounting-manualJournalEntries', JSON.stringify(manualJournalEntries)), [manualJournalEntries]);
  useEffect(() => localStorage.setItem('accounting-payments', JSON.stringify(payments)), [payments]);
  useEffect(() => localStorage.setItem('accounting-collections', JSON.stringify(collections)), [collections]);


  const addProduct = (product) => {
    const newProduct = { id: product.code || Date.now().toString(), ...product, stock: product.initialStock || 0, entradas: 0, salidas: 0, createdAt: new Date().toISOString() };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };
  const updateProduct = (updatedProduct) => setProducts(prev => prev.map(p => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p));
  const deleteProduct = (productId) => setProducts(prev => prev.filter(p => p.id !== productId));

  const addTransaction = (transaction) => {
    const newTransaction = { id: Date.now().toString(), ...transaction, date: transaction.date || new Date().toISOString(), createdAt: new Date().toISOString() };
    setTransactions(prev => [...prev, newTransaction]);
    createJournalEntriesForTransaction(newTransaction);
    updateInventory(newTransaction);
    return newTransaction;
  };
  const updateTransaction = (updatedTransaction) => {
    setTransactions(prev => {
      const oldTransaction = prev.find(t => t.id === updatedTransaction.id);
      if (oldTransaction) {
        setJournalEntries(entries => entries.filter(e => e.transactionId !== oldTransaction.id));
        revertInventoryUpdate(oldTransaction);
        createJournalEntriesForTransaction(updatedTransaction);
        updateInventory(updatedTransaction);
      }
      return prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t);
    });
  };
  const deleteTransaction = (transactionId) => {
    const transactionToDelete = transactions.find(t => t.id === transactionId);
    if (transactionToDelete) revertInventoryUpdate(transactionToDelete);
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
    setJournalEntries(prev => prev.filter(e => e.transactionId !== transactionId));
  };

  const updateInventory = (transaction) => {
    const product = products.find(p => p.id === transaction.productId);
    if (!product) return;
    let updatedStock = product.stock, updatedEntradas = product.entradas, updatedSalidas = product.salidas;
    if (transaction.type === 'purchase') { updatedStock += transaction.quantity; updatedEntradas += transaction.quantity; } 
    else if (transaction.type === 'sale') { updatedStock -= transaction.quantity; updatedSalidas += transaction.quantity; }
    updateProduct({ ...product, stock: updatedStock, entradas: updatedEntradas, salidas: updatedSalidas });
  };
  const revertInventoryUpdate = (transaction) => {
    const product = products.find(p => p.id === transaction.productId);
    if (!product) return;
    let revertedStock = product.stock, revertedEntradas = product.entradas, revertedSalidas = product.salidas;
    if (transaction.type === 'purchase') { revertedStock -= transaction.quantity; revertedEntradas -= transaction.quantity; } 
    else if (transaction.type === 'sale') { revertedStock += transaction.quantity; revertedSalidas -= transaction.quantity; }
    updateProduct({ ...product, stock: revertedStock, entradas: revertedEntradas, salidas: revertedSalidas });
  };

  const createJournalEntriesForTransaction = (transaction) => {
    const entries = [];
    const date = new Date(transaction.date).toISOString(); 
    const entryId = `TR-${transaction.id.slice(-4)}`;
    const product = products.find(p => p.id === transaction.productId);
    const costOfSales = product ? product.cost * transaction.quantity : transaction.total * 0.6;
    const contact = contacts.find(c => c.id === transaction.contactId);
    const accountsPayableReceivableAccount = transaction.type === 'sale' ? '1103' : '2101'; // Cuentas por Cobrar : Cuentas por Pagar
    const cashBankAccount = transaction.paymentMethod === 'cash' ? '1101' : '1102'; // Caja o Bancos (simplificado)

    if (transaction.type === 'sale') {
      // Asiento de Venta (devengo)
      entries.push({ id: `${entryId}-S1`, entryId, date, accountCode: accountsPayableReceivableAccount, description: `Venta a ${contact?.name || 'Cliente'} - ${transaction.productName}`, debit: transaction.total, credit: 0, transactionId: transaction.id });
      entries.push({ id: `${entryId}-S2`, entryId, date, accountCode: '4101', description: `Ingreso por venta - ${transaction.productName}`, debit: 0, credit: transaction.total, transactionId: transaction.id });
      // Asiento de Costo de Venta
      entries.push({ id: `${entryId}-CS1`, entryId, date, accountCode: '5101', description: `Costo venta de ${transaction.productName}`, debit: costOfSales, credit: 0, transactionId: transaction.id });
      entries.push({ id: `${entryId}-CS2`, entryId, date, accountCode: '1201', description: `Salida inv. ${transaction.productName}`, debit: 0, credit: costOfSales, transactionId: transaction.id });
    } else if (transaction.type === 'purchase') {
      // Asiento de Compra (devengo)
      entries.push({ id: `${entryId}-P1`, entryId, date, accountCode: '1201', description: `Compra de ${transaction.productName} a ${contact?.name || 'Proveedor'}`, debit: transaction.total, credit: 0, transactionId: transaction.id });
      entries.push({ id: `${entryId}-P2`, entryId, date, accountCode: accountsPayableReceivableAccount, description: `Cuenta por pagar - ${transaction.productName}`, debit: 0, credit: transaction.total, transactionId: transaction.id });
    }
    setJournalEntries(prev => [...prev, ...entries]);
  };
  
  const addManualJournalEntry = (entryDetails) => {
    const entryId = `MA-${Date.now().toString().slice(-4)}`;
    const newEntries = entryDetails.lines.map((line, index) => ({
      id: `${entryId}-${index + 1}`, entryId, date: entryDetails.date, accountCode: line.accountCode,
      description: line.description || entryDetails.description,
      debit: parseFloat(line.debit) || 0, credit: parseFloat(line.credit) || 0, isManual: true
    }));
    setManualJournalEntries(prev => [...prev, ...newEntries]);
    setJournalEntries(prev => [...prev, ...newEntries]);
  };

  const addPayment = (paymentData) => {
    const newPayment = { id: `PAY-${Date.now().toString().slice(-4)}`, ...paymentData, createdAt: new Date().toISOString() };
    setPayments(prev => [...prev, newPayment]);
    
    const entryId = `JE-PAY-${newPayment.id.slice(-4)}`;
    const date = new Date(newPayment.date).toISOString();
    const contact = contacts.find(c => c.id === newPayment.contactId);
    const journalEntry = [
      { id: `${entryId}-1`, entryId, date, accountCode: '2101', description: `Pago a ${contact?.name || 'Proveedor'}`, debit: newPayment.amount, credit: 0, paymentId: newPayment.id },
      { id: `${entryId}-2`, entryId, date, accountCode: newPayment.paymentAccountCode, description: `Salida de ${chartOfAccounts.find(a=>a.code === newPayment.paymentAccountCode)?.name || 'Efectivo/Banco'}`, debit: 0, credit: newPayment.amount, paymentId: newPayment.id }
    ];
    setJournalEntries(prev => [...prev, ...journalEntry]);
    return newPayment;
  };

  const addCollection = (collectionData) => {
    const newCollection = { id: `COL-${Date.now().toString().slice(-4)}`, ...collectionData, createdAt: new Date().toISOString() };
    setCollections(prev => [...prev, newCollection]);

    const entryId = `JE-COL-${newCollection.id.slice(-4)}`;
    const date = new Date(newCollection.date).toISOString();
    const contact = contacts.find(c => c.id === newCollection.contactId);
    const journalEntry = [
      { id: `${entryId}-1`, entryId, date, accountCode: newCollection.paymentAccountCode, description: `Ingreso de ${chartOfAccounts.find(a=>a.code === newCollection.paymentAccountCode)?.name || 'Efectivo/Banco'}`, debit: newCollection.amount, credit: 0, collectionId: newCollection.id },
      { id: `${entryId}-2`, entryId, date, accountCode: '1103', description: `Cobro a ${contact?.name || 'Cliente'}`, debit: 0, credit: newCollection.amount, collectionId: newCollection.id }
    ];
    setJournalEntries(prev => [...prev, ...journalEntry]);
    // Update invoice status if related invoice found
    if (newCollection.invoiceId) {
        setInvoices(prevInvoices => prevInvoices.map(inv => 
            inv.id === newCollection.invoiceId ? { ...inv, status: 'paid' } : inv
        ));
    }
    return newCollection;
  };


  const getGeneralLedger = () => {
    const ledger = {};
    const allEntries = [...journalEntries, ...manualJournalEntries];
    allEntries.forEach(entry => {
      const accountInfo = chartOfAccounts.find(acc => acc.code === entry.accountCode);
      if (!accountInfo) return; 
      if (!ledger[entry.accountCode]) {
        ledger[entry.accountCode] = { accountCode: entry.accountCode, accountName: accountInfo.name, entries: [], totalDebit: 0, totalCredit: 0, balance: 0 };
      }
      ledger[entry.accountCode].entries.push(entry);
      ledger[entry.accountCode].totalDebit += entry.debit;
      ledger[entry.accountCode].totalCredit += entry.credit;
      if (['1', '5'].includes(accountInfo.code.charAt(0))) { // Activos y Gastos: Saldo Deudor
         ledger[entry.accountCode].balance = ledger[entry.accountCode].totalDebit - ledger[entry.accountCode].totalCredit;
      } else { // Pasivos, Patrimonio, Ingresos: Saldo Acreedor
         ledger[entry.accountCode].balance = ledger[entry.accountCode].totalCredit - ledger[entry.accountCode].totalDebit;
      }
    });
    return Object.values(ledger);
  };

  const getFinancialStatements = () => {
    const ledger = getGeneralLedger();
    const assets = ledger.filter(acc => acc.accountCode.startsWith('1'));
    const liabilities = ledger.filter(acc => acc.accountCode.startsWith('2'));
    const equityAccounts = ledger.filter(acc => acc.accountCode.startsWith('3'));
    const totalAssets = assets.reduce((sum, acc) => sum + acc.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, acc) => sum + acc.balance, 0);
    const revenues = ledger.filter(acc => acc.accountCode.startsWith('4'));
    const expenses = ledger.filter(acc => acc.accountCode.startsWith('5'));
    const totalRevenues = revenues.reduce((sum, acc) => sum + acc.balance, 0);
    const totalExpenses = expenses.reduce((sum, acc) => sum + acc.balance, 0);
    const netIncome = totalRevenues - totalExpenses;
    const totalEquityFromAccounts = equityAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalEquity = totalEquityFromAccounts + netIncome;
    const cashAccount = ledger.find(acc => acc.accountCode === '1101'); // Caja
    const bankAccount = ledger.find(acc => acc.accountCode === '1102'); // Bancos
    const cashFlowEntries = [...(cashAccount?.entries || []), ...(bankAccount?.entries || [])].sort((a,b) => new Date(a.date) - new Date(b.date));
    const netCashFlow = (cashAccount?.balance || 0) + (bankAccount?.balance || 0);
    return {
      balanceSheet: { assets, liabilities, equity: equityAccounts, totalAssets, totalLiabilities, totalEquity },
      incomeStatement: { revenues, expenses, totalRevenues, totalExpenses, netIncome },
      cashFlow: { entries: cashFlowEntries, netCashFlow }
    };
  };

  const addContact = (contact) => {
    const newContact = { id: Date.now().toString(), ...contact, createdAt: new Date().toISOString() };
    setContacts(prev => [...prev, newContact]);
    return newContact;
  };
  const updateContact = (updatedContact) => setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
  const deleteContact = (contactId) => setContacts(prev => prev.filter(c => c.id !== contactId));

  const addChartOfAccount = (account) => {
    const newAccount = { ...account, balance: 0 };
    setChartOfAccounts(prev => [...prev, newAccount]);
  };
  const updateChartOfAccount = (updatedAccount) => setChartOfAccounts(prev => prev.map(acc => acc.code === updatedAccount.code ? updatedAccount : acc));
  const deleteChartOfAccount = (accountCode) => setChartOfAccounts(prev => prev.filter(acc => acc.code !== accountCode));

  const addInvoice = (invoiceData) => {
    const newInvoice = { id: `INV-${Date.now().toString().slice(-6)}`, ...invoiceData, status: 'pending', createdAt: new Date().toISOString() };
    setInvoices(prev => [...prev, newInvoice]);
    
    // Create journal entries for invoice
    const entryId = `JE-INV-${newInvoice.id.slice(-4)}`;
    const date = new Date(newInvoice.date).toISOString();
    const contact = contacts.find(c => c.id === newInvoice.contactId);
    const invEntries = [];

    newInvoice.lines.forEach((line, index) => {
        const product = products.find(p => p.id === line.productId);
        const costOfGoodsSold = product ? product.cost * line.quantity : line.total * 0.6; // Estimate if no product
        // Ingreso por Venta y CxC
        invEntries.push({ id: `${entryId}-L${index}-1`, entryId, date, accountCode: '1103', description: `Factura ${newInvoice.id} a ${contact?.name || 'Cliente'} - ${line.productName}`, debit: line.total, credit: 0, invoiceId: newInvoice.id });
        invEntries.push({ id: `${entryId}-L${index}-2`, entryId, date, accountCode: '4101', description: `Venta ${line.productName}`, debit: 0, credit: line.total, invoiceId: newInvoice.id });
        // Costo de Venta y Salida de Inventario
        invEntries.push({ id: `${entryId}-L${index}-3`, entryId, date, accountCode: '5101', description: `Costo Venta ${line.productName}`, debit: costOfGoodsSold, credit: 0, invoiceId: newInvoice.id });
        invEntries.push({ id: `${entryId}-L${index}-4`, entryId, date, accountCode: '1201', description: `Salida Inv. ${line.productName}`, debit: 0, credit: costOfGoodsSold, invoiceId: newInvoice.id });
        
        // Update inventory for each line item sold
        if (product) {
            updateInventory({ type: 'sale', productId: line.productId, quantity: line.quantity });
        }
    });
    setJournalEntries(prev => [...prev, ...invEntries]);
    return newInvoice;
  };
  const updateInvoice = (updatedInvoice) => setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
  const deleteInvoice = (invoiceId) => setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
  
  const addIncome = (incomeData) => {
    const entryId = `JE-INC-${Date.now().toString().slice(-4)}`;
    const date = new Date(incomeData.date).toISOString();
    const contact = contacts.find(c => c.id === incomeData.contactId);
    const journalEntry = [
        { id: `${entryId}-1`, entryId, date, accountCode: incomeData.accountId, description: `Ingreso de ${contact?.name || 'Cliente'} - ${incomeData.description}`, debit: incomeData.amount, credit: 0 },
        { id: `${entryId}-2`, entryId, date, accountCode: '4102', description: `Ingreso por ${incomeData.description}`, debit: 0, credit: incomeData.amount } // Using a generic income account
    ];
    setJournalEntries(prev => [...prev, ...journalEntry]);
    // This is a simplified income, does not create a full transaction or affect inventory.
  };
  const addExpense = (expenseData) => {
    const entryId = `JE-EXP-${Date.now().toString().slice(-4)}`;
    const date = new Date(expenseData.date).toISOString();
    const contact = contacts.find(c => c.id === expenseData.contactId);
    const journalEntry = [
        { id: `${entryId}-1`, entryId, date, accountCode: '5103', description: `Gasto: ${expenseData.description} a ${contact?.name || 'Proveedor'}`, debit: expenseData.amount, credit: 0 }, // Using a generic expense account
        { id: `${entryId}-2`, entryId, date, accountCode: expenseData.accountId, description: `Pago gasto ${expenseData.description}`, debit: 0, credit: expenseData.amount }
    ];
    setJournalEntries(prev => [...prev, ...journalEntry]);
    // This is a simplified expense.
  };

  return {
    products, transactions, journalEntries, contacts, chartOfAccounts, invoices, manualJournalEntries, payments, collections,
    addProduct, updateProduct, deleteProduct,
    addTransaction, updateTransaction, deleteTransaction,
    getGeneralLedger, getFinancialStatements,
    addContact, updateContact, deleteContact,
    addChartOfAccount, updateChartOfAccount, deleteChartOfAccount,
    addInvoice, updateInvoice, deleteInvoice,
    addManualJournalEntry, addIncome, addExpense,
    addPayment, addCollection
  };
};
