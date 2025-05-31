const baseUrl = 'http://localhost:8080/invoices/';
const customersUrl = 'http://localhost:8080/customers-select';
const issuersUrl = 'http://localhost:8080/issuers-select';
const nextInvoiceNumberUrl = 'http://localhost:8080/invoices-next-number';

async function fetchData(url) {
    const res = await fetch(url);
    return await res.json();
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('hu-HU');
}

async function displayInvoices() {
    const data = await fetchData(baseUrl);
    const div = document.getElementById("table");

    let table = `<table>
        <tr>
            <th>#</th>
            <th>Számlaszám</th>
            <th>Vevő</th>
            <th>Kiállító</th>
            <th>Dátumok</th>
            <th>Összeg</th>
            <th>Művelet</th>
        </tr>`;

    let i = 1;
    for (const inv of data) {
        table += `
        <tr>
            <td>${i++}</td>
            <td>${inv.invoiceNumber}</td>
            <td>${inv.customerName}<br><small>${inv.customerAddress}</small></td>
            <td>${inv.issuerName}<br><small>${inv.issuerAddress}</small></td>
            <td>
                Számla: ${formatDate(inv.invoiceDate)}<br>
                Teljesítés: ${formatDate(inv.dateOfCompletion)}<br>
                Határidő: ${formatDate(inv.paymentDeadline)}
            </td>
            <td>${inv.totalAmount} Ft<br>ÁFA: ${inv.VATAmount} Ft</td>
            <td>
                <button class="edit" onclick="editInvoice(${inv.id})">✏️</button>
                <button class="delete" onclick="deleteInvoice(${inv.id})">🗑️</button>
            </td>
        </tr>`;
    }

    table += `</table>`;
    div.innerHTML = table;
}

async function createInvoice() {
    const invoice = {
        issuerId: +document.getElementById("issuerId").value,
        customerId: +document.getElementById("customerId").value,
        invoiceNumber: +document.getElementById("invoiceNumber").value,
        invoiceDate: document.getElementById("invoiceDate").value,
        dateOfCompletion: document.getElementById("dateOfCompletion").value,
        paymentDeadline: document.getElementById("paymentDeadline").value,
        totalAmount: +document.getElementById("totalAmount").value,
        VATAmount: +document.getElementById("VATAmount").value
    };

    const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice)
    });

    if (res.ok) {
        document.getElementById("invoiceForm").reset();
        document.getElementById("addFormContainer").style.display = "none";
        displayInvoices();
    } else {
        alert("Hiba a számla létrehozásakor.");
    }
}

async function editInvoice(id) {
    const data = await fetch(baseUrl + id).then(res => res.json());

    document.getElementById("editId").value = id;
    document.getElementById("editInvoiceNumber").value = data.invoiceNumber;
    document.getElementById("editInvoiceDate").value = data.invoiceDate;
    document.getElementById("editDateOfCompletion").value = data.dateOfCompletion;
    document.getElementById("editPaymentDeadline").value = data.paymentDeadline;
    document.getElementById("editTotalAmount").value = data.totalAmount;
    document.getElementById("editVATAmount").value = data.VATAmount;

    await populateSelects(true);

    document.getElementById("editIssuerId").value = data.issuerId;
    document.getElementById("editCustomerId").value = data.customerId;

    document.getElementById("editForm").style.display = "block";
    document.getElementById("editTitleHeading").style.display = "block";
    document.getElementById("editForm").scrollIntoView({ behavior: 'smooth' });
}

async function updateInvoice() {
    const id = document.getElementById("editId").value;

    const invoice = {
        issuerId: +document.getElementById("editIssuerId").value,
        customerId: +document.getElementById("editCustomerId").value,
        invoiceNumber: +document.getElementById("editInvoiceNumber").value,
        invoiceDate: document.getElementById("editInvoiceDate").value,
        dateOfCompletion: document.getElementById("editDateOfCompletion").value,
        paymentDeadline: document.getElementById("editPaymentDeadline").value,
        totalAmount: +document.getElementById("editTotalAmount").value,
        VATAmount: +document.getElementById("editVATAmount").value
    };

    const res = await fetch(baseUrl + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice)
    });

    if (res.ok) {
        document.getElementById("editForm").reset();
        document.getElementById("editForm").style.display = "none";
        document.getElementById("editTitleHeading").style.display = "none";
        displayInvoices();
    } else {
        alert("Hiba a szerkesztéskor.");
    }
}

async function deleteInvoice(id) {
    const confirmDelete = confirm("Biztosan törölni szeretnéd?");
    if (!confirmDelete) return;

    const res = await fetch(baseUrl + id, { method: "DELETE" });
    if (res.ok) displayInvoices();
    else alert("Törlés sikertelen.");
}

function cancelEdit() {
    document.getElementById("editForm").reset();
    document.getElementById("editForm").style.display = "none";
    document.getElementById("editTitleHeading").style.display = "none";
}

function toggleAddForm() {
    const formContainer = document.getElementById("addFormContainer");
    formContainer.style.display = formContainer.style.display === "none" ? "block" : "none";
    if (formContainer.style.display === "block") {
        populateSelects();
    }
}

displayInvoices();

async function populateSelects(isEdit = false) {
    const [customers, issuers, invoiceNumData] = await Promise.all([
        fetchData(customersUrl),
        fetchData(issuersUrl),
        fetchData(nextInvoiceNumberUrl)
    ]);

    if (!isEdit) {
        const customerSelect = document.getElementById("customerId");
        const issuerSelect = document.getElementById("issuerId");
        const invoiceNumberInput = document.getElementById("invoiceNumber");

        customerSelect.innerHTML = customers.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
        issuerSelect.innerHTML = issuers.map(i => `<option value="${i.id}">${i.name}</option>`).join("");
        invoiceNumberInput.value = invoiceNumData.nextInvoiceNumber;
    }

    const editCustomerSelect = document.getElementById("editCustomerId");
    const editIssuerSelect = document.getElementById("editIssuerId");

    if (editCustomerSelect && editIssuerSelect) {
        editCustomerSelect.innerHTML = customers.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
        editIssuerSelect.innerHTML = issuers.map(i => `<option value="${i.id}">${i.name}</option>`).join("");
    }
}