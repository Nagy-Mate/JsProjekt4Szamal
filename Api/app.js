import express from "express";
import cors from "cors";
import * as db from './Util/database.js';

const PORT = 8080;
const app = express();
app.use(express.json());
app.use(cors());

//Customers
app.get('/customers', (req, res)=>{
    try{
        const customers = db.getCustomers();
        res.status(200).json(customers);
    }catch(err){
        res.status(500).json({message: `${err}`});
    }

});

app.get('/customers-select', (req, res) => {
    try {
        const list = db.getCustomers().map(c => ({ id: c.id, name: c.name }));
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.get('/customers/:id', (req, res) =>{
    try{
        const customers = db.getCustomer(req.params.id);
        if(!customers){
            return res.status(404).json({message: 'Customer not found'})
        }
        res.status(200).json(customers);
    }catch(err){
        res.status(500).json({message: `${err}`});
    }
});

app.post('/customers', (req, res)=>{
    try{
        const {name, adress, taxNumber} = req.body;
        if(!name || !adress || !taxNumber){
            return res.status(404).json({message: 'Invalid credentials'})
        }
        const saveCustomer = db.saveCustomer(name, adress, taxNumber);
        if(saveCustomer.changes != 1){
             return res.status(501).json({message: "Customer save failed!"})
        }
        res.status(201).json({id: saveCustomer.lastInsertRowid});
    }catch(err){
        res.status(500).json({message: `${err}`});
    }
});

app.put('/customers/:id', (req, res)=>{
    try{
        const {name, adress, taxNumber} = req.body;
        if(!name || !adress || !taxNumber){
            return res.status(404).json({message: 'Invalid credentials'})
        }
        const updatedCustomer = db.updateCustomer(req.params.id, name, adress, taxNumber);
        if(updatedCustomer.changes != 1){
             return res.status(501).json({message: "Customer update failed!"})
        }
        res.status(200).json({name, adress, taxNumber});
    }catch(err){
        res.status(500).json({message: `${err}`});
    }
});

app.delete('/customers/:id', (req, res)=>{
    try{
        const deletedCustomer = db.deleteCustomer(req.params.id);
        if(deletedCustomer.changes != 1){
             return res.status(501).json({message: "Customer delete failed!"})
        }
        res.status(200).json({message: "Deleted successful"})
    }catch(err){
        res.status(500).json({message: `${err}`});
    }
});

//Issuers
app.get('/issuers', (req, res) => {
    try {
        const issuers = db.getIssuers();
        res.status(200).json(issuers);
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.get('/issuers-select', (req, res) => {
    try {
        const list = db.getIssuers().map(i => ({ id: i.id, name: i.name }));
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.get('/issuers/:id', (req, res) => {
    try {
        const issuer = db.getIssuer(req.params.id);
        if (!issuer) {
            return res.status(404).json({ message: 'Issuer not found' });
        }
        res.status(200).json(issuer);
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.post('/issuers', (req, res) => {
    try {
        const { name, adress, taxNumber } = req.body;
        if (!name || !adress || !taxNumber) {
            return res.status(400).json({ message: 'Invalid input' });
        }
        const result = db.saveIssuer(name, adress, taxNumber);
        if (result.changes !== 1) {
            return res.status(500).json({ message: 'Issuer save failed!' });
        }
        res.status(201).json({ id: result.lastInsertRowid });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.put('/issuers/:id', (req, res) => {
    try {
        const { name, adress, taxNumber } = req.body;
        if (!name || !adress || !taxNumber) {
            return res.status(400).json({ message: 'Invalid input' });
        }
        const result = db.updateIssuer(req.params.id, name, adress, taxNumber);
        if (result.changes !== 1) {
            return res.status(500).json({ message: 'Issuer update failed!' });
        }
        res.status(200).json({ id: req.params.id, name, adress, taxNumber });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.delete('/issuers/:id', (req, res) => {
    try {
        const result = db.deleteIssuer(req.params.id);
        if (result.changes !== 1) {
            return res.status(500).json({ message: 'Issuer delete failed!' });
        }
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

//Invoices
app.get('/invoices', (req, res) => {
    try {
        const invoices = db.getInvoicesWithDetails();
        res.status(200).json(invoices);
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.get('/invoices/:id', (req, res) => {
    try {
        const invoice = db.getInvoice(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json(invoice);
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.post('/invoices', (req, res) => {
    try {
        const {
            issuerId,
            customerId,
            invoiceNumber,
            invoiceDate,
            dateOfCompletion,
            paymentDeadline,
            totalAmount,
            VATAmount
        } = req.body;

        if (
            !issuerId || !customerId || !invoiceNumber ||
            !invoiceDate || !dateOfCompletion || !paymentDeadline ||
            totalAmount == null || VATAmount == null
        ) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        const result = db.saveInvoice(
            issuerId,
            customerId,
            invoiceNumber,
            invoiceDate,
            dateOfCompletion,
            paymentDeadline,
            totalAmount,
            VATAmount
        );

        if (result.changes !== 1) {
            return res.status(500).json({ message: 'Invoice save failed!' });
        }

        res.status(201).json({ id: result.lastInsertRowid });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.put('/invoices/:id', (req, res) => {
    try {
        const {
            issuerId,
            customerId,
            invoiceNumber,
            invoiceDate,
            dateOfCompletion,
            paymentDeadline,
            totalAmount,
            VATAmount
        } = req.body;

        if (
            !issuerId || !customerId || !invoiceNumber ||
            !invoiceDate || !dateOfCompletion || !paymentDeadline ||
            totalAmount == null || VATAmount == null
        ) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        const result = db.updateInvoice(
            req.params.id,
            issuerId,
            customerId,
            invoiceNumber,
            invoiceDate,
            dateOfCompletion,
            paymentDeadline,
            totalAmount,
            VATAmount
        );

        if (result.changes !== 1) {
            return res.status(500).json({ message: 'Invoice update failed!' });
        }

        res.status(200).json({ message: 'Invoice updated', id: req.params.id });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.delete('/invoices/:id', (req, res) => {
    try {
        const result = db.deleteInvoice(req.params.id);
        if (result.changes !== 1) {
            return res.status(500).json({ message: 'Invoice delete failed!' });
        }
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.get('/invoices-next-number', (req, res) => {
    try {
        const next = db.getNextInvoiceNumber();
        res.status(200).json({ nextInvoiceNumber: next });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.listen(PORT, ()=>{
    console.log(`server runs on port: ${PORT}`)
});