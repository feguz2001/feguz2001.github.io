
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';

const GeneralLedger = ({ generalLedger }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl flex items-center gap-2">
            📊 Libro Mayor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {generalLedger.map((account, index) => (
              <motion.div
                key={account.accountCode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-primary/20 rounded-lg p-4 bg-background/30"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-primary">
                    {account.accountCode} - {account.accountName}
                  </h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    Saldo: <span className={`font-semibold ${account.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(Math.abs(account.balance))} {account.balance >= 0 ? '(Deudor)' : '(Acreedor)'}
                    </span>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Debe</TableHead>
                      <TableHead className="text-right">Haber</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {account.entries.map((entry, entryIndex) => {
                      const runningBalance = account.entries
                        .slice(0, entryIndex + 1)
                        .reduce((sum, e) => sum + e.debit - e.credit, 0);
                      
                      return (
                        <TableRow key={entry.id}>
                          <TableCell>{formatDate(entry.date)}</TableCell>
                          <TableCell>{entry.description}</TableCell>
                          <TableCell className="text-right text-green-400">
                            {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                          </TableCell>
                          <TableCell className="text-right text-blue-400">
                            {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                          </TableCell>
                          <TableCell className={`text-right font-medium ${runningBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(Math.abs(runningBalance))}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                
                <div className="mt-3 pt-3 border-t border-primary/20">
                  <div className="flex justify-end space-x-8 text-sm">
                    <span>
                      Total Debe: <span className="text-green-400 font-semibold">
                        {formatCurrency(account.totalDebit)}
                      </span>
                    </span>
                    <span>
                      Total Haber: <span className="text-blue-400 font-semibold">
                        {formatCurrency(account.totalCredit)}
                      </span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {generalLedger.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay cuentas en el libro mayor</p>
                <p className="text-sm mt-2">Las cuentas aparecerán automáticamente al registrar transacciones</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GeneralLedger;
