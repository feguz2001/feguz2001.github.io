
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';

const JournalBook = ({ journalEntries }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const groupedEntries = journalEntries.reduce((acc, entry) => {
    if (!acc[entry.entryId]) {
      acc[entry.entryId] = [];
    }
    acc[entry.entryId].push(entry);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl flex items-center gap-2">
            📖 Libro Diario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedEntries).map(([entryId, entries], index) => (
              <motion.div
                key={entryId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-primary/20 rounded-lg p-4 bg-background/30"
              >
                <div className="mb-3">
                  <span className="text-sm text-muted-foreground">Asiento: </span>
                  <span className="font-semibold text-primary">{entryId}</span>
                  <span className="ml-4 text-sm text-muted-foreground">Fecha: </span>
                  <span className="font-medium">{formatDate(entries[0].date)}</span>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cuenta</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Debe</TableHead>
                      <TableHead className="text-right">Haber</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">
                          {entry.accountCode} - {entry.account}
                        </TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell className="text-right text-green-400">
                          {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                        </TableCell>
                        <TableCell className="text-right text-blue-400">
                          {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-2 pt-2 border-t border-primary/20">
                  <div className="flex justify-end space-x-8 text-sm">
                    <span>
                      Total Debe: <span className="text-green-400 font-semibold">
                        {formatCurrency(entries.reduce((sum, e) => sum + e.debit, 0))}
                      </span>
                    </span>
                    <span>
                      Total Haber: <span className="text-blue-400 font-semibold">
                        {formatCurrency(entries.reduce((sum, e) => sum + e.credit, 0))}
                      </span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {journalEntries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay asientos contables registrados</p>
                <p className="text-sm mt-2">Los asientos se crearán automáticamente al registrar transacciones</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JournalBook;
