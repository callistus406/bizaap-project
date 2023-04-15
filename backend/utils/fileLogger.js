const fs = require('fs');
const path = require('path');

const failedTxlogFilePath = path.join(__dirname, '..', 'logs', 'failed-transactions.log');

function logFailedTransaction(transaction, res) {
  const timestamp = new Date().toISOString().replace('T', ' ').replace(/\..+/, '');
  const logMessage = `${timestamp}, | Transaction Type:${transaction.transaction_type} | Account Number: ${transaction.account_number}  | Transaction Ref: ${transaction.tx_ref} | Customer ID: ${transaction.user_id} | Status: ${transaction.status} | Amount: ${transaction.amount}\n`;
  fs.appendFile(failedTxlogFilePath, logMessage, (err) => {
    if (err) throw err;
    console.log('Failed transaction logged.');
  });
}
const pendingTxlogFilePath = path.join(__dirname, '..', 'logs', 'pending-transactions.log');

function logPendingTransaction(transaction, res) {
  const timestamp = new Date().toISOString().replace('T', ' ').replace(/\..+/, '');
  const logMessage = `${timestamp}, | Transaction Type:${transaction.transaction_type} | Account Number: ${transaction.account_number}  | Transaction Ref: ${transaction.tx_ref} | Customer ID: ${transaction.user_id} | Status: ${transaction.status} | Amount: ${transaction.amount}\n`;
  fs.appendFile(pendingTxlogFilePath, logMessage, (err) => {
    if (err) throw err;
    console.log('Failed transaction logged.');
  });
}
const ErrorlogFilePath = path.join(__dirname, '..', 'logs', 'error-logger.log');

function errorLogger(log) {
  const timestamp = new Date().toISOString().replace('T', ' ').replace(/\..+/, '');
  const logMessage = `${timestamp}, | Exception:${log.error_type}  | Customer ID: ${log.user_id}  |   Source: ${log.source}  | Message: ${log.message}\n`;
  fs.appendFile(ErrorlogFilePath, logMessage, (err) => {
    if (err) throw err;
    console.log('Failed exception logged.');
  });
}

module.exports = { logFailedTransaction, logPendingTransaction, errorLogger };
