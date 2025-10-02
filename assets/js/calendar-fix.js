// Script de corrección para el calendario y horarios
document.addEventListener('DOMContentLoaded', function() {
    
    // Variables del calendario
    let currentDate = new Date();
    let selectedDate = null;
    let selectedTime = null;
    
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    const unavailableDays = [0]; // Domingos no disponibles
    
    // Función para renderizar el calendario
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Actualizar título del mes
        document.getElementById('current-month').textContent = `${months[month]} ${year}`;
        
        // Limpiar semanas anteriores
        const calendarWeeks = document.getElementById('calendar-weeks');
        calendarWeeks.innerHTML = '';
        
        // Primer día del mes y último día del mes
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayWeek = firstDay.getDay();
        
        // Array para almacenar todos los días a mostrar
        const allDays = [];
        
        // Días del mes anterior (para completar la primera semana)
        const prevMonth = new Date(year, month, 0);
        for (let i = firstDayWeek - 1; i >= 0; i--) {
            const dayNum = prevMonth.getDate() - i;
            allDays.push({
                day: dayNum,
                isOtherMonth: true,
                date: new Date(year, month - 1, dayNum)
            });
        }
        
        // Días del mes actual
        for (let day = 1; day <= lastDay.getDate(); day++) {
            allDays.push({
                day: day,
                isOtherMonth: false,
                date: new Date(year, month, day)
            });
        }
        
        // Días del siguiente mes (para completar la última semana)
        const remainingCells = 42 - allDays.length;
        for (let day = 1; day <= remainingCells; day++) {
            allDays.push({
                day: day,
                isOtherMonth: true,
                date: new Date(year, month + 1, day)
            });
        }
        
        // Crear filas de semanas (6 filas de 7 días)
        for (let week = 0; week < 6; week++) {
            const weekRow = document.createElement('div');
            weekRow.className = 'calendar-row week-row';
            
            for (let day = 0; day < 7; day++) {
                const dayIndex = week * 7 + day;
                if (dayIndex < allDays.length) {
                    const dayInfo = allDays[dayIndex];
                    const dayElement = createDayElement(dayInfo.day, dayInfo.isOtherMonth, dayInfo.date);
                    weekRow.appendChild(dayElement);
                }
            }
            
            calendarWeeks.appendChild(weekRow);
        }
    }
    
    // Función para crear elemento de día
    function createDayElement(dayNum, otherMonth, fullDate) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = dayNum;
        
        if (otherMonth) {
            dayElement.classList.add('other-month');
        }
        
        // Verificar si es hoy
        const today = new Date();
        if (fullDate.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Verificar disponibilidad
        if (!otherMonth && isDateAvailable(fullDate)) {
            dayElement.classList.add('available');
            dayElement.addEventListener('click', () => selectDate(fullDate, dayElement));
        } else if (!otherMonth) {
            dayElement.classList.add('unavailable');
        }
        
        return dayElement;
    }
    
    // Función para verificar si una fecha está disponible
    function isDateAvailable(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // No permitir fechas pasadas
        if (date < today) return false;
        
        // No permitir días no disponibles (ej: domingos)
        if (unavailableDays.includes(date.getDay())) return false;
        
        return true;
    }
    
    // Función para seleccionar una fecha
    function selectDate(date, element) {
        // Remover selección anterior
        const previousSelected = document.querySelector('.calendar-day.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        
        // Agregar selección actual
        element.classList.add('selected');
        selectedDate = date;
        
        // Mostrar horarios disponibles
        showAvailableTimes(date);
    }
    
    // Función para mostrar horarios disponibles del calendario
    function showAvailableTimes(date) {
        // Remover contenedor de horarios si existe
        let timesContainer = document.getElementById('times-container');
        if (timesContainer) {
            timesContainer.remove();
        }
        
        // Crear nuevo contenedor de horarios
        timesContainer = document.createElement('div');
        timesContainer.id = 'times-container';
        timesContainer.innerHTML = `
            <h4 style="color: #fff; text-align: center; margin: 20px 0 10px 0;">
                Horarios disponibles para ${date.toLocaleDateString('es-ES')}
            </h4>
            <div class="times-grid"></div>
        `;
        
        const timesGrid = timesContainer.querySelector('.times-grid');
        timesGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
        `;
        
        // Agregar horarios
        availableTimes.forEach(time => {
            const timeButton = document.createElement('button');
            timeButton.textContent = time;
            timeButton.style.cssText = `
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: #fff;
                padding: 10px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            timeButton.addEventListener('mouseover', () => {
                timeButton.style.background = 'rgba(255, 107, 107, 0.6)';
            });
            
            timeButton.addEventListener('mouseout', () => {
                timeButton.style.background = 'rgba(255, 255, 255, 0.2)';
            });
            
            timeButton.addEventListener('click', () => {
                selectTimeFromCalendar(date, time);
            });
            
            timesGrid.appendChild(timeButton);
        });
        
        // Insertar después del calendario
        const calendarContainer = document.getElementById('calendar-container');
        calendarContainer.parentNode.insertBefore(timesContainer, calendarContainer.nextSibling);
    }
    
    // Función para seleccionar horario desde el calendario
    function selectTimeFromCalendar(date, time) {
        selectedDate = date;
        selectedTime = time;
        
        // Actualizar el botón de horarios en el formulario
        const selectedTimeText = document.getElementById('selected-time-text');
        if (selectedTimeText) {
            selectedTimeText.textContent = `${date.toLocaleDateString('es-ES')} - ${time}`;
        }
        
        // Remover contenedor de horarios
        const timesContainer = document.getElementById('times-container');
        if (timesContainer) {
            timesContainer.remove();
        }
        
        alert(`Turno seleccionado:\nFecha: ${date.toLocaleDateString('es-ES')}\nHora: ${time}\n\nAhora completa tus datos en el formulario.`);
    }
    
    // Función para mostrar horarios en el botón desplegable
    function showAvailableTimesInButton() {
        const timesGrid = document.getElementById('times-grid');
        if (!timesGrid) return;
        
        timesGrid.innerHTML = '';
        
        // Generar horarios disponibles
        availableTimes.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;
            
            // Simular algunos horarios no disponibles aleatoriamente
            const isUnavailable = Math.random() < 0.3; // 30% de probabilidad de no estar disponible
            if (isUnavailable) {
                timeSlot.classList.add('unavailable');
                timeSlot.title = 'Horario no disponible';
            } else {
                timeSlot.addEventListener('click', () => selectTimeSlot(time, timeSlot));
            }
            
            timesGrid.appendChild(timeSlot);
        });
    }
    
    // Función para seleccionar un horario del panel
    function selectTimeSlot(time, element) {
        // Remover selección anterior
        const previousSelected = document.querySelector('.time-slot.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        
        // Agregar selección actual
        element.classList.add('selected');
        selectedTime = time;
        
        // Actualizar el texto del botón
        document.getElementById('selected-time-text').textContent = `Horario: ${time}`;
        
        // Cerrar el panel después de un momento
        setTimeout(() => {
            toggleTimesPanel();
        }, 1000);
    }
    
    // Función para alternar el panel de horarios
    function toggleTimesPanel() {
        const panel = document.getElementById('times-panel');
        const button = document.getElementById('show-times-btn');
        
        if (!panel || !button) return;
        
        if (panel.classList.contains('hidden')) {
            panel.classList.remove('hidden');
            button.classList.add('active');
            showAvailableTimesInButton();
        } else {
            panel.classList.add('hidden');
            button.classList.remove('active');
        }
    }
    
    // Event listeners para navegación del calendario
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    // Event listener para el botón de horarios disponibles
    const showTimesBtn = document.getElementById('show-times-btn');
    if (showTimesBtn) {
        showTimesBtn.addEventListener('click', toggleTimesPanel);
    }
    
    // Event listener para el formulario de reserva
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const fullName = formData.get('full_name');
            const phone = formData.get('phone');
            const service = formData.get('service');
            
            // Validaciones
            if (!selectedTime) {
                alert('Por favor, selecciona un horario disponible.');
                return;
            }
            
            if (!fullName || !phone || !service) {
                alert('Por favor, completa todos los campos del formulario.');
                return;
            }
            
            if (phone.length < 8) {
                alert('Por favor, ingresa un número de teléfono válido.');
                return;
            }
            
            // Confirmar reserva
            const serviceText = document.querySelector(`#service option[value="${service}"]`).textContent;
            const dateText = selectedDate ? selectedDate.toLocaleDateString('es-ES') : 'Por definir';
            
            const confirmMessage = `¡Turno confirmado exitosamente!

Detalles de la reserva:
📅 Fecha: ${dateText}
🕐 Hora: ${selectedTime}
👤 Cliente: ${fullName}
📞 Teléfono: ${phone}
💆‍♀️ Servicio: ${serviceText}

Te contactaremos por WhatsApp para confirmar tu turno.`;
            
            alert(confirmMessage);
            
            // Limpiar formulario y selecciones
            this.reset();
            selectedDate = null;
            selectedTime = null;
            document.getElementById('selected-time-text').textContent = 'Ver Horarios Disponibles';
            
            // Cerrar panel si está abierto
            const panel = document.getElementById('times-panel');
            const button = document.getElementById('show-times-btn');
            if (panel && !panel.classList.contains('hidden')) {
                panel.classList.add('hidden');
                button.classList.remove('active');
            }
        });
    }
    
    // Cerrar panel al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        const panel = document.getElementById('times-panel');
        const button = document.getElementById('show-times-btn');
        
        if (button && panel && !button.contains(e.target) && !panel.contains(e.target)) {
            if (!panel.classList.contains('hidden')) {
                panel.classList.add('hidden');
                button.classList.remove('active');
            }
        }
    });
    
    // Renderizar calendario inicial
    renderCalendar();
});