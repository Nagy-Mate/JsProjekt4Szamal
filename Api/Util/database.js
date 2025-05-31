import Database from "better-sqlite3";

const db = new Database('./Data/database.sqlite');

db.prepare(`CREATE TABLE IF NOT EXISTS customers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    adress TEXT,
    taxNumber INTEGER
    )`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS issuers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    adress TEXT,
    taxNumber INTEGER
    )`).run();


db.prepare(`CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issuerId INTEGER NOT NULL,
    customerId INTEGER NOT NULL,
    invoiceNumber INTEGER,
    invoiceDate DATE TIME,
    dateOfCompletion DATE TIME,
    paymentDeadline DATE TIME,
    totalAmount INTEGER,
    VATAmount INTEGER,
    FOREIGN KEY (issuerId) REFERENCES issuers(id),
    FOREIGN KEY (customerId) REFERENCES customers(id)
)`).run();

//Customers
export const getCustomers = () => db.prepare(`SELECT * FROM customers`).all();

export const getCustomer = (id) => db.prepare(`SELECT * FROM customers WHERE id = ?`).get(id);

export const saveCustomer = (name, adress, taxNumber) => db.
prepare(`INSERT INTO customers (name, adress, taxNumber) VALUES (?,?,?)`).
run(name, adress, taxNumber);

export const updateCustomer = (id, name, adress, taxNumber) => db.
prepare(`UPDATE customers SET name = ?, adress = ?, taxNumber = ? WHERE id = ?`).
run(name, adress, taxNumber, id);

export const deleteCustomer = (id) => db.prepare(`DELETE FROM customers WHERE id = ?`).run(id);

//Issuers
export const getIssuers = () => db.prepare(`SELECT * FROM issuers`).all();

export const getIssuer = (id) => db.prepare(`SELECT * FROM issuers WHERE id = ?`).get(id);

export const saveIssuer = (name, adress, taxNumber) => db.
prepare(`INSERT INTO issuers (name, adress, taxNumber) VALUES (?,?,?)`).
run(name, adress, taxNumber);

export const updateIssuer = (id, name, adress, taxNumber) => db.
prepare(`UPDATE issuers SET name = ?, adress = ?, taxNumber = ? WHERE id = ?`).
run(name, adress, taxNumber, id);

export const deleteIssuer = (id) => db.prepare(`DELETE FROM issuers WHERE id = ?`).run(id);

//Invoices
export const getInvoices = () => db.prepare(`SELECT * FROM invoices`).all();

export const getInvoicesWithDetails = () =>
  db.prepare(`
    SELECT 
      invoices.*,
      customers.name AS customerName,
      customers.adress AS customerAddress,
      customers.taxNumber AS customerTaxNumber,
      issuers.name AS issuerName,
      issuers.adress AS issuerAddress,
      issuers.taxNumber AS issuerTaxNumber
    FROM invoices
    JOIN customers ON invoices.customerId = customers.id
    JOIN issuers ON invoices.issuerId = issuers.id
  `).all();

export const getInvoice = (id) => db.prepare(`SELECT * FROM invoices WHERE id = ?`).get(id);

export const saveInvoice = (issuerId, customerId, invoiceNumber, invoiceDate, dateOfCompletion, paymentDeadline, totalAmount, VATAmount) => db.
prepare(`INSERT INTO invoices (issuerId, customerId, invoiceNumber, invoiceDate, dateOfCompletion, paymentDeadline, totalAmount, VATAmount) VALUES (?,?,?,?,?,?,?,?)`).
run(issuerId, customerId, invoiceNumber, invoiceDate, dateOfCompletion, paymentDeadline, totalAmount, VATAmount);

export const updateInvoice = (id, issuerId, customerId, invoiceNumber, invoiceDate, dateOfCompletion, paymentDeadline, totalAmount, VATAmount) => db.
prepare(`UPDATE invoices SET issuerId = ?, customerId = ?, invoiceNumber = ?, invoiceDate = ?, dateOfCompletion = ?, paymentDeadline = ?, totalAmount = ?, VATAmount = ?  WHERE id = ?`).
run(issuerId, customerId, invoiceNumber, invoiceDate, dateOfCompletion, paymentDeadline, totalAmount, VATAmount, id);

export const deleteInvoice = (id) => db.prepare(`DELETE FROM invoices WHERE id = ?`).run(id);

export const getNextInvoiceNumber = () => {
    const result = db.prepare(`SELECT MAX(invoiceNumber) as maxNum FROM invoices`).get();
    return (result.maxNum || 1000) + 1;
};

const customers = [
  { id: 1, name: 'Kiss János', adress: 'Debrecen, Alma utca 10.', taxNumber: 11111111 },
  { id: 2, name: 'Nagy Éva', adress: 'Győr, Körte utca 22.', taxNumber: 22222222 },
  { id: 3, name: 'Tóth László', adress: 'Szeged, Barackos út 5.', taxNumber: 33333333 }
];

const issuers = [
  { id: 1, name: 'Demo Issuer Kft.', adress: 'Budapest, Fő utca 1.', taxNumber: 12345678 }
];

const invoices = [
  {
    id: 1,
    issuerId: 1,
    customerId: 1,
    invoiceNumber: 1001,
    invoiceDate: '2024-01-05',
    dateOfCompletion: '2024-01-05',
    paymentDeadline: '2024-01-20',
    totalAmount: 12000,
    VATAmount: 3000
  },
  {
    id: 2,
    issuerId: 1,
    customerId: 1,
    invoiceNumber: 1002,
    invoiceDate: '2024-02-10',
    dateOfCompletion: '2024-02-10',
    paymentDeadline: '2024-02-25',
    totalAmount: 15000,
    VATAmount: 3750
  },
  {
    id: 3,
    issuerId: 1,
    customerId: 1,
    invoiceNumber: 1003,
    invoiceDate: '2024-03-15',
    dateOfCompletion: '2024-03-15',
    paymentDeadline: '2024-03-30',
    totalAmount: 18000,
    VATAmount: 4500
  },

  {
    id: 4,
    issuerId: 1,
    customerId: 2,
    invoiceNumber: 1004,
    invoiceDate: '2024-01-12',
    dateOfCompletion: '2024-01-12',
    paymentDeadline: '2024-01-27',
    totalAmount: 9000,
    VATAmount: 2250
  },
  {
    id: 5,
    issuerId: 1,
    customerId: 2,
    invoiceNumber: 1005,
    invoiceDate: '2024-02-18',
    dateOfCompletion: '2024-02-18',
    paymentDeadline: '2024-03-05',
    totalAmount: 10500,
    VATAmount: 2625
  },
  {
    id: 6,
    issuerId: 1,
    customerId: 2,
    invoiceNumber: 1006,
    invoiceDate: '2024-03-20',
    dateOfCompletion: '2024-03-20',
    paymentDeadline: '2024-04-04',
    totalAmount: 11000,
    VATAmount: 2750
  },

  {
    id: 7,
    issuerId: 1,
    customerId: 3,
    invoiceNumber: 1007,
    invoiceDate: '2024-01-22',
    dateOfCompletion: '2024-01-22',
    paymentDeadline: '2024-02-06',
    totalAmount: 13000,
    VATAmount: 3250
  },
  {
    id: 8,
    issuerId: 1,
    customerId: 3,
    invoiceNumber: 1008,
    invoiceDate: '2024-02-28',
    dateOfCompletion: '2024-02-28',
    paymentDeadline: '2024-03-15',
    totalAmount: 14000,
    VATAmount: 3500
  },
  {
    id: 9,
    issuerId: 1,
    customerId: 3,
    invoiceNumber: 1009,
    invoiceDate: '2024-03-30',
    dateOfCompletion: '2024-03-30',
    paymentDeadline: '2024-04-14',
    totalAmount: 16000,
    VATAmount: 4000
  }
];

//for (const customer of customers) saveCustomer(customer.name, customer.adress, customer.taxNumber); 
//for (const issuer of issuers) saveIssuer(issuer.name, issuer.adress, issuer.taxNumber); 
//for (const invoice of invoices) 
//    saveInvoice(
//    invoice.issuerId,
//    invoice.customerId,
//    invoice.invoiceNumber,
//    invoice.invoiceDate,
//    invoice.dateOfCompletion,
//    invoice.paymentDeadline,
//    invoice.totalAmount,
//    invoice.VATAmount); 