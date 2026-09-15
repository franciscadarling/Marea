const monthYearLabel = document.getElementById('month-year');
const daysGrid = document.getElementById('calendar-days');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');

let currentDate = new Date();
const selectedDates = new Set(); 

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  monthYearLabel.textContent = `${monthNames[month]} ${year}`;

  daysGrid.innerHTML = '';

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('day', 'empty');
    daysGrid.appendChild(emptyCell);
  }


  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('day');
    dayCell.textContent = day;

    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    if (selectedDates.has(dateString)) {
      dayCell.classList.add('selected');
    }

    dayCell.addEventListener('click', () => {
      if (selectedDates.has(dateString)) {
        selectedDates.delete(dateString);
        dayCell.classList.remove('selected');
      } else {
        selectedDates.add(dateString);
        dayCell.classList.add('selected');
      }
      console.log('Fechas seleccionadas:', Array.from(selectedDates));
    });

    daysGrid.appendChild(dayCell);
  }
}
prevBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();