const search = document.getElementById('course-search');
if (search) {
  search.closest('.search-box').hidden = false;
  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    const rows = document.querySelectorAll('#course-table tbody tr');
    rows.forEach(row => {
      row.hidden = !row.textContent.toLocaleLowerCase().includes(query);
      if (!row.hidden) count++;
    });
    document.getElementById('course-search-status').textContent = query ? `${count} of ${rows.length} rows shown` : '';
    document.getElementById('course-no-results').hidden = count !== 0;
    document.querySelector('.course-scroll').scrollTop = 0;
  });
}
