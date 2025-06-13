
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const FinancialStatements = ({ financialStatements }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const { balanceSheet, incomeStatement, cashFlow } = financialStatements;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl flex items-center gap-2">
            📈 Estados Financieros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="balance" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-background/50">
              <TabsTrigger value="balance">Balance General</TabsTrigger>
              <TabsTrigger value="income">Estado de Resultados</TabsTrigger>
              <TabsTrigger value="cashflow">Flujo de Efectivo</TabsTrigger>
              <TabsTrigger value="equity">Cambios en Patrimonio</TabsTrigger>
            </TabsList>

            <TabsContent value="balance" className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-primary">BALANCE GENERAL</h2>
                  <p className="text-sm text-muted-foreground">Al {new Date().toLocaleDateString('es-ES')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Activos */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-400 border-b border-green-400/30 pb-2">
                      ACTIVOS
                    </h3>
                    <Table>
                      <TableBody>
                        {balanceSheet.assets.map((asset) => (
                          <TableRow key={asset.accountCode}>
                            <TableCell>{asset.accountName}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(Math.abs(asset.balance))}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2 border-primary/50">
                          <TableCell className="font-bold text-primary">TOTAL ACTIVOS</TableCell>
                          <TableCell className="text-right font-bold text-primary">
                            {formatCurrency(balanceSheet.totalAssets)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pasivos y Patrimonio */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-red-400 border-b border-red-400/30 pb-2">
                      PASIVOS
                    </h3>
                    <Table>
                      <TableBody>
                        {balanceSheet.liabilities.map((liability) => (
                          <TableRow key={liability.accountCode}>
                            <TableCell>{liability.accountName}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(Math.abs(liability.balance))}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t border-muted">
                          <TableCell className="font-semibold">TOTAL PASIVOS</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(balanceSheet.totalLiabilities)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    <h3 className="text-lg font-semibold text-blue-400 border-b border-blue-400/30 pb-2 mt-6">
                      PATRIMONIO
                    </h3>
                    <Table>
                      <TableBody>
                        {balanceSheet.equity.map((equity) => (
                          <TableRow key={equity.accountCode}>
                            <TableCell>{equity.accountName}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(Math.abs(equity.balance))}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell>Utilidad del Ejercicio</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(incomeStatement.netIncome)}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-t-2 border-primary/50">
                          <TableCell className="font-bold text-primary">TOTAL PATRIMONIO</TableCell>
                          <TableCell className="text-right font-bold text-primary">
                            {formatCurrency(balanceSheet.totalEquity)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="income" className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-primary">ESTADO DE RESULTADOS</h2>
                  <p className="text-sm text-muted-foreground">Del 1 de enero al {new Date().toLocaleDateString('es-ES')}</p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={2} className="font-semibold text-green-400 text-lg">
                          INGRESOS
                        </TableCell>
                      </TableRow>
                      {incomeStatement.revenues.map((revenue) => (
                        <TableRow key={revenue.accountCode}>
                          <TableCell className="pl-6">{revenue.accountName}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(Math.abs(revenue.balance))}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t border-muted">
                        <TableCell className="font-semibold">TOTAL INGRESOS</TableCell>
                        <TableCell className="text-right font-semibold text-green-400">
                          {formatCurrency(incomeStatement.totalRevenues)}
                        </TableCell>
                      </TableRow>

                      <TableRow className="mt-4">
                        <TableCell colSpan={2} className="font-semibold text-red-400 text-lg pt-6">
                          GASTOS
                        </TableCell>
                      </TableRow>
                      {incomeStatement.expenses.map((expense) => (
                        <TableRow key={expense.accountCode}>
                          <TableCell className="pl-6">{expense.accountName}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(Math.abs(expense.balance))}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t border-muted">
                        <TableCell className="font-semibold">TOTAL GASTOS</TableCell>
                        <TableCell className="text-right font-semibold text-red-400">
                          {formatCurrency(incomeStatement.totalExpenses)}
                        </TableCell>
                      </TableRow>

                      <TableRow className="border-t-2 border-primary/50">
                        <TableCell className="font-bold text-primary text-lg">
                          UTILIDAD NETA
                        </TableCell>
                        <TableCell className={`text-right font-bold text-lg ${incomeStatement.netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(incomeStatement.netIncome)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="cashflow" className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-primary">ESTADO DE FLUJOS DE EFECTIVO</h2>
                  <p className="text-sm text-muted-foreground">Del 1 de enero al {new Date().toLocaleDateString('es-ES')}</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-background/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-4">Movimientos de Efectivo</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Descripción</TableHead>
                          <TableHead className="text-right">Entrada</TableHead>
                          <TableHead className="text-right">Salida</TableHead>
                          <TableHead className="text-right">Saldo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cashFlow.entries.map((entry, index) => {
                          const runningBalance = cashFlow.entries
                            .slice(0, index + 1)
                            .reduce((sum, e) => sum + e.debit - e.credit, 0);
                          
                          return (
                            <TableRow key={entry.id}>
                              <TableCell>{formatDate(entry.date)}</TableCell>
                              <TableCell>{entry.description}</TableCell>
                              <TableCell className="text-right text-green-400">
                                {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                              </TableCell>
                              <TableCell className="text-right text-red-400">
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
                  </div>

                  <div className="bg-primary/10 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-primary mb-2">Efectivo Neto</h3>
                    <p className={`text-3xl font-bold ${cashFlow.netCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(Math.abs(cashFlow.netCashFlow))}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {cashFlow.netCashFlow >= 0 ? 'Flujo Positivo' : 'Flujo Negativo'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="equity" className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-primary">ESTADO DE CAMBIOS EN EL PATRIMONIO</h2>
                  <p className="text-sm text-muted-foreground">Del 1 de enero al {new Date().toLocaleDateString('es-ES')}</p>
                </div>

                <div className="max-w-3xl mx-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Concepto</TableHead>
                        <TableHead className="text-right">Capital Social</TableHead>
                        <TableHead className="text-right">Utilidades Retenidas</TableHead>
                        <TableHead className="text-right">Utilidad del Ejercicio</TableHead>
                        <TableHead className="text-right">Total Patrimonio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Saldo Inicial</TableCell>
                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(0)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Utilidad del Ejercicio</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className={`text-right font-medium ${incomeStatement.netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(incomeStatement.netIncome)}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${incomeStatement.netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(incomeStatement.netIncome)}
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-t-2 border-primary/50">
                        <TableCell className="font-bold text-primary">Saldo Final</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(0)}</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(0)}</TableCell>
                        <TableCell className={`text-right font-bold ${incomeStatement.netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(incomeStatement.netIncome)}
                        </TableCell>
                        <TableCell className={`text-right font-bold text-primary ${incomeStatement.netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(incomeStatement.netIncome)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FinancialStatements;
