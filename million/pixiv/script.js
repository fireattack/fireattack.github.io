document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => renderTable(data));
});

function renderTable(data) {
    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = '';
    const maxTotal = Math.max(...Object.values(data).map(item => item.total));
    const maxR18 = Math.max(...Object.values(data).map(item => item.r18));
    const maxPercentage = Math.max(...Object.values(data).map(item => ((item.r18 / item.total) * 100).toFixed(2)));
    // const maxPercentage = 100; // Percentage is always out of 100

    Object.keys(data).forEach((key, index) => {
        const total = data[key].total;
        const r18 = data[key].r18;
        const percentage = ((r18 / total) * 100).toFixed(2);

        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${index + 1}</td>
        <td><a href="https://www.pixiv.net/tags/${key}/artworks" target="_blank">${key}</a></td>
        <td><div class="bar " style="width: ${(total / maxTotal) * 100}%"><div class="bar-text">${total}</div></div></td>
        <td><div class="bar r18" style="width: ${(r18 / maxR18) * 100}%"><div class="bar-text">${r18}</div></div></td>
        <td><div class="bar r18" style="width: ${(percentage / maxPercentage) * 100}%"><div class="bar-text">${percentage}%</div></div></td>
    `;
        tableBody.appendChild(row);
    });

    // Set initial sorting order indicators
    document.querySelectorAll('th').forEach((th, index) => {
        th.classList.remove('asc', 'desc');
        if (index === 0 || index === 1) {
            th.classList.add('asc');
        } else {
            th.classList.add('desc');
        }
    });
}

function sortTable(columnIndex) {
    const table = document.querySelector('#data-table');
    const rows = Array.from(table.getElementsByTagName("tr")).slice(1);
    const header = table.getElementsByTagName("th")[columnIndex];
    const isAscending = header.classList.contains("current-asc");
    const isDescending = header.classList.contains("current-desc");
    const defaultOrder = header.classList.contains("asc") ? "asc" : header.classList.contains("desc") ? "desc" : "asc";

    const isNumberic = columnIndex !== 1;

    // Remove current-asc and current-desc classes from all headers
    Array.from(table.getElementsByTagName("th")).forEach(th => {
        th.classList.remove("current-asc", "current-desc");
    });

    let sortedRows;
    if (isAscending) {
        // Reverse the current order
        sortedRows = rows.reverse();
        header.classList.add("current-desc");
    } else if (isDescending) {
        // Reverse the current order
        sortedRows = rows.reverse();
        header.classList.add("current-asc");
    } else {
        // Sort by the default order
        sortedRows = rows.sort((a, b) => {
            if (isNumberic) {
                return defaultOrder === "asc"
                    ? parseFloat(a.getElementsByTagName("td")[columnIndex].innerText) - parseFloat(b.getElementsByTagName("td")[columnIndex].innerText)
                    : parseFloat(b.getElementsByTagName("td")[columnIndex].innerText) - parseFloat(a.getElementsByTagName("td")[columnIndex].innerText);
            } else
                return defaultOrder === "asc"
                    ? a.getElementsByTagName("td")[columnIndex].innerText.localeCompare(b.getElementsByTagName("td")[columnIndex].innerText)
                    : b.getElementsByTagName("td")[columnIndex].innerText.localeCompare(a.getElementsByTagName("td")[columnIndex].innerText);
        });

        header.classList.add(defaultOrder === "asc" ? "current-asc" : "current-desc");
    }

    // Append sorted rows to the table body
    const tbody = table.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    sortedRows.forEach(row => tbody.appendChild(row));
}
