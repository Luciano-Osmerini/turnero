/*
	JV Spa Urbano - Sistema de Turnos Online
*/

(function() {
	"use strict";

	var $body = document.querySelector('body');

	// Methods/polyfills.
	window.canUse=function(p){if(!window._canUse)window._canUse=document.createElement("div");var e=window._canUse.style,up=p.charAt(0).toUpperCase()+p.slice(1);return p in e||"Moz"+up in e||"Webkit"+up in e||"O"+up in e||"ms"+up in e};

	// Play initial animations on page load.
	window.addEventListener('load', function() {
		window.setTimeout(function() {
			$body.classList.remove('is-preload');
		}, 100);
	});

	// Slideshow Background.
	(function() {
		var settings = {
			images: {
				'images/bg01.jpg': 'center',
				'images/bg02.jpg': 'center',
				'images/bg03.jpg': 'center'
			},
			delay: 6000
		};

		var	pos = 0, lastPos = 0,
			$wrapper, $bgs = [], $bg, k;

		$wrapper = document.createElement('div');
		$wrapper.id = 'bg';
		$body.appendChild($wrapper);

		for (k in settings.images) {
			$bg = document.createElement('div');
			$bg.style.backgroundImage = 'url("' + k + '")';
			$bg.style.backgroundPosition = settings.images[k];
			$wrapper.appendChild($bg);
			$bgs.push($bg);
		}

		$bgs[pos].classList.add('visible');
		$bgs[pos].classList.add('top');

		if ($bgs.length == 1 || !canUse('transition'))
			return;

		window.setInterval(function() {
			lastPos = pos;
			pos++;
			if (pos >= $bgs.length) pos = 0;
			
			$bgs[lastPos].classList.remove('top');
			$bgs[pos].classList.add('visible');
			$bgs[pos].classList.add('top');

			window.setTimeout(function() {
				$bgs[lastPos].classList.remove('visible');
			}, settings.delay / 2);
		}, settings.delay);
	})();

	// Sistema de Turnos Online
	const BookingSystem = {
		currentDate: new Date(),
		selectedDate: null,
		selectedTime: null,
		currentStep: 1,
		
		// Horarios base (se filtran según el día)
		baseTimes: [
			'09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
			'12:00', '12:30', '13:00', '13:30',
			'14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
			'17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
		],

		// Función para obtener horarios disponibles según el día
		getAvailableTimesForDay: function(date) {
			const dayOfWeek = date.getDay(); // 0=domingo, 1=lunes, ..., 6=sábado
			
			switch(dayOfWeek) {
				case 1: // Lunes - de 14:00 a 19:30
					return this.baseTimes.filter(time => {
						const hour = parseInt(time.split(':')[0]);
						return hour >= 14 && hour <= 19;
					});
					
				case 2: // Martes - de 09:00 a 18:00
					return this.baseTimes.filter(time => {
						const hour = parseInt(time.split(':')[0]);
						return hour >= 9 && hour < 18;
					});
					
				case 3: // Miércoles - de 14:00 a 19:30
					return this.baseTimes.filter(time => {
						const hour = parseInt(time.split(':')[0]);
						return hour >= 14 && hour <= 19;
					});
					
				case 4: // Jueves - de 09:00 a 18:00
					return this.baseTimes.filter(time => {
						const hour = parseInt(time.split(':')[0]);
						return hour >= 9 && hour < 18;
					});
					
				case 5: // Viernes - de 09:00 a 16:00
					return this.baseTimes.filter(time => {
						const hour = parseInt(time.split(':')[0]);
						return hour >= 9 && hour < 16;
					});
					
				case 6: // Sábado - CERRADO (Jessica no trabaja sábados)
					return [];
					
				default: // Domingo - cerrado
					return [];
			}
		},

		// Días de la semana que está abierto (1=lunes a 5=viernes)
		workingDays: [1, 2, 3, 4, 5],

		// Sistema de gestión de turnos con Firebase
		getStoredAppointments: async function() {
			try {
				if (!window.firebaseDb) {
					console.log('Firebase no disponible, usando localStorage como respaldo');
					const appointments = localStorage.getItem('jvSpaAppointments');
					return appointments ? JSON.parse(appointments) : [];
				}

				const { collection, getDocs } = window.firebaseModules;
				const appointmentsRef = collection(window.firebaseDb, 'appointments');
				const querySnapshot = await getDocs(appointmentsRef);
				
				const appointments = [];
				querySnapshot.forEach((doc) => {
					appointments.push({ id: doc.id, ...doc.data() });
				});
				
				return appointments;
			} catch (e) {
				console.error('Error al leer turnos de Firebase:', e);
				// Fallback a localStorage
				const appointments = localStorage.getItem('jvSpaAppointments');
				return appointments ? JSON.parse(appointments) : [];
			}
		},

		saveAppointment: async function(appointmentData) {
			try {
				const newAppointment = {
					date: appointmentData.date,
					time: appointmentData.time,
					clientName: appointmentData.clientName,
					clientPhone: appointmentData.clientPhone,
					service: appointmentData.service,
					createdAt: new Date().toISOString()
				};

				if (!window.firebaseDb) {
					console.log('Firebase no disponible, guardando en localStorage');
					const appointments = JSON.parse(localStorage.getItem('jvSpaAppointments') || '[]');
					newAppointment.id = Date.now();
					appointments.push(newAppointment);
					localStorage.setItem('jvSpaAppointments', JSON.stringify(appointments));
					return newAppointment;
				}

				const { collection, addDoc } = window.firebaseModules;
				const appointmentsRef = collection(window.firebaseDb, 'appointments');
				const docRef = await addDoc(appointmentsRef, newAppointment);
				
				return { id: docRef.id, ...newAppointment };
			} catch (e) {
				console.error('Error al guardar turno en Firebase:', e);
				// Fallback a localStorage
				const appointments = JSON.parse(localStorage.getItem('jvSpaAppointments') || '[]');
				const newAppointment = {
					id: Date.now(),
					date: appointmentData.date,
					time: appointmentData.time,
					clientName: appointmentData.clientName,
					clientPhone: appointmentData.clientPhone,
					service: appointmentData.service,
					createdAt: new Date().toISOString()
				};
				appointments.push(newAppointment);
				localStorage.setItem('jvSpaAppointments', JSON.stringify(appointments));
				return newAppointment;
			}
		},

		getAppointmentsForDate: async function(date) {
			const dateStr = date.toISOString().split('T')[0];
			const appointments = await this.getStoredAppointments();
			return appointments.filter(apt => apt.date === dateStr);
		},

		isTimeOccupied: async function(date, time) {
			const appointmentsForDate = await this.getAppointmentsForDate(date);
			return appointmentsForDate.some(apt => apt.time === time);
		},

		init: function() {
			this.renderCalendar();
			this.bindEvents();
		},

		bindEvents: function() {
			// Navegación del calendario
			document.getElementById('prev-month').addEventListener('click', () => {
				this.currentDate.setMonth(this.currentDate.getMonth() - 1);
				this.renderCalendar();
			});

			document.getElementById('next-month').addEventListener('click', () => {
				this.currentDate.setMonth(this.currentDate.getMonth() + 1);
				this.renderCalendar();
			});

			// Botones de navegación
			document.getElementById('back-to-calendar').addEventListener('click', () => {
				this.showStep(1);
			});

			document.getElementById('back-to-time').addEventListener('click', () => {
				this.showStep(2);
			});

			document.getElementById('back-to-form').addEventListener('click', () => {
				this.showStep(3);
			});

			document.getElementById('new-booking').addEventListener('click', () => {
				this.resetBooking();
			});

			// Botón de confirmación siempre habilitado

			// Confirmación final con WhatsApp
			document.getElementById('final-confirm-booking').addEventListener('click', async () => {
				await this.sendWhatsAppMessage();
			});

			// Formulario de cliente
			document.getElementById('client-form').addEventListener('submit', (e) => {
				e.preventDefault();
				this.submitBooking();
			});
		},

		renderCalendar: function() {
			const monthNames = [
				'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
				'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
			];

			const currentMonth = this.currentDate.getMonth();
			const currentYear = this.currentDate.getFullYear();

			// Actualizar título del mes
			document.getElementById('current-month').textContent = 
				`${monthNames[currentMonth]} ${currentYear}`;

			// Limpiar calendario anterior
			const grid = document.getElementById('calendar-grid');
			const dayHeaders = grid.querySelectorAll('.day-header');
			
			// Mantener headers, remover días
			const cells = grid.querySelectorAll('.day-cell');
			cells.forEach(cell => cell.remove());

			// Calcular primer día del mes y días del mes
			const firstDay = new Date(currentYear, currentMonth, 1);
			const lastDay = new Date(currentYear, currentMonth + 1, 0);
			const daysInMonth = lastDay.getDate();
			const startingDayOfWeek = firstDay.getDay();

			// Días del mes anterior para completar la primera semana
			const prevMonth = new Date(currentYear, currentMonth - 1, 0);
			for (let i = startingDayOfWeek - 1; i >= 0; i--) {
				const dayNum = prevMonth.getDate() - i;
				const cell = this.createDayCell(dayNum, 'other-month');
				grid.appendChild(cell);
			}

			// Días del mes actual
			for (let day = 1; day <= daysInMonth; day++) {
				const date = new Date(currentYear, currentMonth, day);
				const isAvailable = this.isDateAvailable(date);
				const cell = this.createDayCell(day, isAvailable ? 'available' : 'disabled', date);
				grid.appendChild(cell);
			}

			// Días del siguiente mes para completar
			const totalCells = grid.children.length;
			const remainingCells = 42 - totalCells; // 6 semanas * 7 días
			for (let day = 1; day <= remainingCells; day++) {
				const cell = this.createDayCell(day, 'other-month');
				grid.appendChild(cell);
			}
		},

		createDayCell: function(day, className, date = null) {
			const cell = document.createElement('div');
			cell.className = `day-cell ${className}`;
			cell.textContent = day;

			if (date && className === 'available') {
				cell.addEventListener('click', () => {
					this.selectDate(date);
				});
			}

			return cell;
		},

		isDateAvailable: function(date) {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			
			// No se puede reservar en el pasado
			if (date < today) return false;
			
			// Solo días de trabajo
			const dayOfWeek = date.getDay();
			return this.workingDays.includes(dayOfWeek);
		},

		selectDate: async function(date) {
			// Remover selección anterior
			const prevSelected = document.querySelector('.day-cell.selected');
			if (prevSelected) {
				prevSelected.classList.remove('selected');
			}

			// Marcar nueva selección
			event.target.classList.add('selected');
			this.selectedDate = date;

			// Mostrar horarios
			await this.showAvailableTimes();
			this.showStep(2);
		},

		showAvailableTimes: async function() {
			const dateStr = this.selectedDate.toLocaleDateString('es-AR', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});

			document.getElementById('selected-date-display').textContent = 
				`Fecha seleccionada: ${dateStr}`;

			const container = document.getElementById('time-slots');
			container.innerHTML = '';

			// Obtener horarios específicos para este día
			const availableTimesForDay = this.getAvailableTimesForDay(this.selectedDate);
			
			if (availableTimesForDay.length === 0) {
				container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.8); padding: 2rem;">📅 No hay horarios disponibles para este día</p>';
				return;
			}

			for (const time of availableTimesForDay) {
				const isAvailable = await this.isTimeAvailable(time);
				const slot = document.createElement('div');
				slot.className = `time-slot ${isAvailable ? '' : 'unavailable'}`;
				slot.textContent = time;

				if (isAvailable) {
					slot.addEventListener('click', () => {
						this.selectTime(time, slot);
					});
				}

				container.appendChild(slot);
			}
		},

		isTimeAvailable: async function(time) {
			// Verificar si el horario está ocupado para la fecha seleccionada
			if (!this.selectedDate) return true;
			return !(await this.isTimeOccupied(this.selectedDate, time));
		},

		selectTime: function(time, element) {
			// Remover selección anterior
			const prevSelected = document.querySelector('.time-slot.selected');
			if (prevSelected) {
				prevSelected.classList.remove('selected');
			}

			// Marcar nueva selección
			element.classList.add('selected');
			this.selectedTime = time;

			// Mostrar formulario de datos
			setTimeout(() => {
				this.showClientForm();
				this.showStep(3);
			}, 300);
		},

		showClientForm: function() {
			const dateStr = this.selectedDate.toLocaleDateString('es-AR', {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			});

			document.getElementById('booking-summary').textContent = 
				`${dateStr} a las ${this.selectedTime}`;
		},

		submitBooking: function() {
			const name = document.getElementById('client-name').value;
			const phone = document.getElementById('client-phone').value;
			const service = document.getElementById('client-service').value;

			if (!name || !phone) {
				alert('Por favor completá todos los campos obligatorios');
				return;
			}

			// Guardar datos del cliente
			this.clientData = {
				name: name,
				phone: phone,
				service: service
			};

			// Mostrar paso de políticas
			this.showPoliciesStep();
			this.showStep(4);
		},

		showPoliciesStep: function() {
			const dateStr = this.selectedDate.toLocaleDateString('es-AR', {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			});

			const serviceText = this.clientData.service ? 
				this.clientData.service.charAt(0).toUpperCase() + this.clientData.service.slice(1).replace('-', ' ') : 
				'Sin especificar';

			document.getElementById('final-booking-summary').innerHTML = `
				<h3>📋 Resumen de tu Turno</h3>
				<p><strong>👤 Cliente:</strong> ${this.clientData.name}</p>
				<p><strong>📞 Teléfono:</strong> ${this.clientData.phone}</p>
				<p><strong>📅 Fecha:</strong> ${dateStr}</p>
				<p><strong>⏰ Horario:</strong> ${this.selectedTime}</p>
				<p><strong>💅 Servicio:</strong> ${serviceText}</p>
			`;
		},

		sendWhatsAppMessage: async function() {
			// Primero guardamos el turno en Firebase
			const appointmentData = {
				date: this.selectedDate.toISOString().split('T')[0],
				time: this.selectedTime,
				clientName: this.clientData.name,
				clientPhone: this.clientData.phone,
				service: this.clientData.service || 'Sin especificar'
			};

			// Verificar que el horario siga disponible antes de guardar
			if (await this.isTimeOccupied(this.selectedDate, this.selectedTime)) {
				alert('❌ Lo sentimos, este horario acaba de ser reservado por otro cliente. Por favor elegí otro horario.');
				this.showStep(2); // Volver a selección de horarios
				return;
			}

			// Guardar el turno
			const savedAppointment = await this.saveAppointment(appointmentData);
			if (!savedAppointment) {
				alert('❌ Error al guardar el turno. Por favor intentá nuevamente.');
				return;
			}

			const dateStr = this.selectedDate.toLocaleDateString('es-AR', {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			});

			const serviceText = this.clientData.service ? 
				this.clientData.service.charAt(0).toUpperCase() + this.clientData.service.slice(1).replace('-', ' ') : 
				'Sin especificar';

			// Mensaje para WhatsApp
			const message = `🌟 *NUEVO TURNO RESERVADO* 🌟

📋 *Detalles del Turno:*
👤 Cliente: ${this.clientData.name}
📞 Teléfono: ${this.clientData.phone}
📅 Fecha: ${dateStr}
⏰ Horario: ${this.selectedTime}
💅 Servicio: ${serviceText}

💰 *Recordatorio:*
El cliente debe realizar la seña de $8,000 a:
🏷️ Alias: jv.spaurbano
👤 Jesica Vanesa Vergara
📱 Mercado Pago

✅ El cliente aceptó las políticas de turnos.

_Mensaje enviado automáticamente desde el sistema de turnos JV Spa Urbano_`;

			// Abrir WhatsApp con el mensaje
			const phoneNumber = '5493516742801'; // Número con código de país
			const encodedMessage = encodeURIComponent(message);
			const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
			
			// Abrir en nueva ventana
			window.open(whatsappUrl, '_blank');

			// Mostrar confirmación final
			this.showFinalConfirmation();
			this.showStep(5);
		},

		showFinalConfirmation: function() {
			const dateStr = this.selectedDate.toLocaleDateString('es-AR', {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			});

			const serviceText = this.clientData.service ? 
				this.clientData.service.charAt(0).toUpperCase() + this.clientData.service.slice(1).replace('-', ' ') : 
				'Sin especificar';

			document.getElementById('confirmation-details').innerHTML = `
				<h3>✅ ¡Perfecto!</h3>
				<p><strong>Cliente:</strong> ${this.clientData.name}</p>
				<p><strong>Teléfono:</strong> ${this.clientData.phone}</p>
				<p><strong>Fecha:</strong> ${dateStr}</p>
				<p><strong>Horario:</strong> ${this.selectedTime}</p>
				${serviceText !== 'Sin especificar' ? `<p><strong>Servicio:</strong> ${serviceText}</p>` : ''}
				<div class="next-steps">
					<h4>📋 Próximos pasos:</h4>
					<p>1. Se envió la confirmación por WhatsApp</p>
					<p>2. Realizá la seña de $8,000 a: <strong>jv.spaurbano</strong></p>
					<p>3. ¡Nos vemos en tu cita!</p>
				</div>
			`;
		},

		showConfirmation: function(name, phone, service) {
			const dateStr = this.selectedDate.toLocaleDateString('es-AR', {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			});

			const serviceStr = service ? ` para ${service}` : '';

			document.getElementById('confirmation-details').innerHTML = `
				<h3>¡Perfecto!</h3>
				<p><strong>Cliente:</strong> ${name}</p>
				<p><strong>Teléfono:</strong> ${phone}</p>
				<p><strong>Fecha:</strong> ${dateStr}</p>
				<p><strong>Horario:</strong> ${this.selectedTime}</p>
				${serviceStr ? `<p><strong>Servicio:</strong> ${service}</p>` : ''}
			`;
		},

		showStep: function(step) {
			// Ocultar todos los pasos
			document.querySelectorAll('.booking-step').forEach(s => {
				s.classList.remove('active');
			});

			// Mostrar paso actual
			const steps = {
				1: 'calendar-section',
				2: 'time-section',
				3: 'client-section',
				4: 'policies-section',
				5: 'confirmation-section'
			};

			document.getElementById(steps[step]).classList.add('active');
			this.currentStep = step;
		},

		resetBooking: function() {
			this.selectedDate = null;
			this.selectedTime = null;
			this.clientData = null;
			this.currentStep = 1;
			
			// Limpiar formulario
			document.getElementById('client-form').reset();
			
			// Botón de confirmación siempre habilitado
			
			// Limpiar selecciones
			document.querySelectorAll('.selected').forEach(el => {
				el.classList.remove('selected');
			});

			this.showStep(1);
		}
	};

	/* PANEL DE ADMINISTRADOR ELIMINADO - SOLO PARA CLIENTES
	// Sistema de Administración
	const AdminSystem = {
		isLoggedIn: false,
		currentUser: null,
		appointments: [],
		services: [
			// SERVICIOS FACIALES
			{id: 1, name: 'Limpieza Profunda', price: 16000, duration: 45, active: true, description: 'Limpieza facial profunda con productos premium', category: 'facial'},
			{id: 2, name: 'Renovación Celular', price: 20000, duration: 60, active: true, description: 'Tratamiento de renovación celular facial', category: 'facial'},
			{id: 3, name: 'Estimulación Celular', price: 25000, duration: 60, active: true, description: 'Estimulación celular avanzada para rostro', category: 'facial'},
			{id: 4, name: 'Exosomas', price: 30000, duration: 75, active: true, description: 'Tratamiento facial con exosomas regenerativos', category: 'facial'},
			{id: 5, name: 'Dermaplaning', price: 19000, duration: 45, active: true, description: 'Exfoliación facial con dermaplaning', category: 'facial'},
			
			// SERVICIOS DE MASAJES
			{id: 6, name: 'Masajes Desc. Superior', price: 16000, duration: 45, active: true, description: 'Masaje descontracturante de espalda y cuello', category: 'masajes'},
			{id: 7, name: 'Masajes desc. Cuerpo/c', price: 22000, duration: 75, active: true, description: 'Masaje descontracturante de cuerpo completo', category: 'masajes'},
			{id: 8, name: 'Drenantes Piernas', price: 12000, duration: 30, active: true, description: 'Masaje drenante linfático en piernas', category: 'masajes'},
			{id: 9, name: 'Drenantes Cuerpo Comp.', price: 22000, duration: 75, active: true, description: 'Masaje drenante de cuerpo completo', category: 'masajes'},
			
			// SERVICIOS DE CEJAS
			{id: 10, name: 'Laminado-Perfilado-Visagismo', price: 17000, duration: 60, active: true, description: 'Servicio completo de cejas con laminado', category: 'cejas'},
			{id: 11, name: 'Perfilado Visagismo', price: 10000, duration: 30, active: true, description: 'Perfilado y diseño de cejas', category: 'cejas'},
			{id: 12, name: 'Cejas Completas + Henna', price: 20000, duration: 60, active: true, description: 'Tratamiento completo de cejas con henna', category: 'cejas'},
			
			// TRATAMIENTO CORPORAL
			{id: 13, name: 'Tratamiento Corporal', price: 25000, duration: 60, active: true, description: 'Tratamiento corporal integral', category: 'corporal'}
		],
		currentMonth: new Date(),

		init: function() {
			this.loadSampleData();
			this.bindAdminEvents();
			this.updateServiceOptions();
		},

		bindAdminEvents: function() {
			// Botón de acceso admin
			document.getElementById('admin-access-btn').addEventListener('click', () => {
				this.showAdminPanel();
			});

			// Login form
			document.getElementById('admin-login-form').addEventListener('submit', (e) => {
				e.preventDefault();
				this.handleLogin();
			});

			// Cancelar login
			document.getElementById('cancel-admin').addEventListener('click', () => {
				this.hideAdminPanel();
			});

			// Logout
			document.getElementById('admin-logout').addEventListener('click', () => {
				this.handleLogout();
			});

			// Cerrar modal con X
			document.getElementById('close-service-modal').addEventListener('click', () => {
				this.hideServiceForm();
			});

			// Navegación admin
			document.querySelectorAll('.admin-nav-btn').forEach(btn => {
				btn.addEventListener('click', (e) => {
					this.showAdminSection(e.target.dataset.section);
				});
			});

			// Filtros de fecha
			document.getElementById('filter-today').addEventListener('click', (e) => {
				this.setActiveFilter(e.target);
				this.filterAppointments('today');
			});

			document.getElementById('filter-week').addEventListener('click', (e) => {
				this.setActiveFilter(e.target);
				this.filterAppointments('week');
			});

			document.getElementById('filter-all').addEventListener('click', (e) => {
				this.setActiveFilter(e.target);
				this.filterAppointments('all');
			});

			document.getElementById('filter-date').addEventListener('change', (e) => {
				this.clearActiveFilters();
				this.filterAppointments('custom', e.target.value);
			});

			// Servicios
			document.getElementById('add-service-btn').addEventListener('click', () => {
				this.showServiceForm();
			});

			document.getElementById('service-form').addEventListener('submit', (e) => {
				e.preventDefault();
				this.saveService();
			});

			document.getElementById('cancel-service-form').addEventListener('click', () => {
				this.hideServiceForm();
			});

			// Calendario admin
			document.getElementById('admin-prev-month').addEventListener('click', () => {
				this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
				this.renderAdminCalendar();
			});

			document.getElementById('admin-next-month').addEventListener('click', () => {
				this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
				this.renderAdminCalendar();
			});
		},

		loadSampleData: function() {
			// Datos de ejemplo para mostrar funcionalidad
			const today = new Date();
			const tomorrow = new Date(today);
			tomorrow.setDate(today.getDate() + 1);

			this.appointments = [
				{
					id: 1,
					date: today.toISOString().split('T')[0],
					time: '10:00',
					clientName: 'María García',
					clientPhone: '11-2345-6789',
					service: 'Masaje Relajante',
					status: 'confirmed'
				},
				{
					id: 2,
					date: today.toISOString().split('T')[0],
					time: '15:30',
					clientName: 'Ana López',
					clientPhone: '11-9876-5432',
					service: 'Limpieza Facial',
					status: 'pending'
				},
				{
					id: 3,
					date: tomorrow.toISOString().split('T')[0],
					time: '11:00',
					clientName: 'Carlos Ruiz',
					clientPhone: '11-5555-1234',
					service: 'Depilación',
					status: 'confirmed'
				}
			];
		},

		showAdminPanel: function() {
			document.getElementById('admin-panel').classList.remove('hidden');
			document.getElementById('admin-login').classList.add('active');
		},

		hideAdminPanel: function() {
			document.getElementById('admin-panel').classList.add('hidden');
			this.resetAdminPanel();
		},

		resetAdminPanel: function() {
			document.querySelectorAll('.admin-section').forEach(section => {
				section.classList.remove('active');
			});
			document.getElementById('admin-login').classList.add('active');
			document.getElementById('admin-login-form').reset();
		},

		handleLogin: function() {
			const username = document.getElementById('admin-username').value;
			const password = document.getElementById('admin-password').value;

			// Verificar credenciales (Jesica Vergara / Jesica Vergar)
			if (username === 'Jesica Vergara' && password === 'Jesica Vergar') {
				// Redirigir al nuevo panel de administrador
				window.location.href = 'index.administrador.html';
			} else {
				alert('Usuario o contraseña incorrectos');
			}
		},

		handleLogout: function() {
			this.isLoggedIn = false;
			this.currentUser = null;
			this.hideAdminPanel();
		},

		showDashboard: function() {
			document.getElementById('admin-login').classList.remove('active');
			document.getElementById('admin-dashboard').classList.add('active');
			
			// Actualizar estadísticas
			this.updateStats();
			
			// Mostrar sección de turnos por defecto
			this.showAdminSection('appointments');
		},

		updateStats: function() {
			const today = new Date().toISOString().split('T')[0];
			const todayAppointments = this.appointments.filter(apt => apt.date === today);
			
			// Calcular ingresos del día
			const todayRevenue = todayAppointments.reduce((total, apt) => {
				const service = this.services.find(s => s.name === apt.service);
				return total + (service ? service.price : 0);
			}, 0);

			// Actualizar números
			document.getElementById('today-appointments').textContent = todayAppointments.length;
			document.getElementById('today-revenue').textContent = `$${todayRevenue.toLocaleString()}`;
			document.getElementById('active-services').textContent = this.services.filter(s => s.active).length;
		},

		setActiveFilter: function(activeButton) {
			// Remover clase active de todos los botones
			document.querySelectorAll('.filter-btn').forEach(btn => {
				btn.classList.remove('active');
			});
			// Agregar clase active al botón clickeado
			activeButton.classList.add('active');
			// Limpiar fecha personalizada
			document.getElementById('filter-date').value = '';
		},

		clearActiveFilters: function() {
			document.querySelectorAll('.filter-btn').forEach(btn => {
				btn.classList.remove('active');
			});
		},

		showAdminSection: function(section) {
			// Actualizar navegación
			document.querySelectorAll('.admin-nav-btn').forEach(btn => {
				btn.classList.remove('active');
			});
			document.querySelector(`[data-section="${section}"]`).classList.add('active');

			// Ocultar contenido anterior
			document.querySelectorAll('.admin-content').forEach(content => {
				content.classList.remove('active');
			});

			// Mostrar nuevo contenido
			switch(section) {
				case 'appointments':
					document.getElementById('admin-appointments').classList.add('active');
					this.renderAppointments();
					break;
				case 'services':
					document.getElementById('admin-services').classList.add('active');
					this.renderServices();
					break;
				case 'calendar-admin':
					document.getElementById('admin-calendar-view').classList.add('active');
					this.renderAdminCalendar();
					break;
			}
		},

		renderAppointments: function(filter = 'today') {
			const container = document.getElementById('appointments-container');
			let filteredAppointments = this.appointments;

			if (filter !== 'all') {
				filteredAppointments = this.applyDateFilter(this.appointments, filter);
			}

			if (filteredAppointments.length === 0) {
				const filterText = filter === 'today' ? 'hoy' : filter === 'week' ? 'esta semana' : 'el período seleccionado';
				container.innerHTML = `
					<div class="empty-state">
						<div class="empty-icon">📅</div>
						<h4>No hay turnos para ${filterText}</h4>
						<p>Los nuevos turnos aparecerán aquí automáticamente</p>
					</div>
				`;
				return;
			}

			// Ordenar por fecha y hora
			filteredAppointments.sort((a, b) => {
				const dateA = new Date(a.date + ' ' + a.time);
				const dateB = new Date(b.date + ' ' + b.time);
				return dateA - dateB;
			});

			container.innerHTML = filteredAppointments.map(appointment => {
				const appointmentDate = new Date(appointment.date);
				const isToday = appointment.date === new Date().toISOString().split('T')[0];
				
				return `
				<div class="appointment-item ${isToday ? 'today-appointment' : ''}">
					<div class="appointment-date">
						<div class="date-text">${appointmentDate.toLocaleDateString('es-AR')}</div>
						<div class="day-text">${appointmentDate.toLocaleDateString('es-AR', {weekday: 'short'})}</div>
					</div>
					<div class="appointment-time">
						<span class="time-text">${appointment.time}</span>
					</div>
					<div class="client-info">
						<div class="client-name">👤 ${appointment.clientName}</div>
					</div>
					<div class="contact-info">
						<div class="phone">📞 ${appointment.clientPhone}</div>
					</div>
					<div class="service-info">
						<span class="service-name">💅 ${appointment.service}</span>
					</div>
					<div class="status-col">
						<span class="status-badge status-${appointment.status}">
							${this.getStatusText(appointment.status)}
						</span>
					</div>
					<div class="action-buttons">
						<button class="action-btn btn-edit" onclick="AdminSystem.editAppointment(${appointment.id})" title="Editar turno">
							✏️
						</button>
						<button class="action-btn btn-delete" onclick="AdminSystem.confirmDelete(${appointment.id})" title="Eliminar turno">
							🗑️
						</button>
					</div>
				</div>
				`;
			}).join('');
		},

		confirmDelete: function(appointmentId) {
			const appointment = this.appointments.find(a => a.id === appointmentId);
			if (appointment && confirm(`¿Estás segura de eliminar el turno de ${appointment.clientName} para el ${new Date(appointment.date).toLocaleDateString('es-AR')} a las ${appointment.time}?`)) {
				this.deleteAppointment(appointmentId);
			}
		},

		renderServices: function() {
			const container = document.getElementById('services-container');
			
			container.innerHTML = this.services.map(service => `
				<div class="service-item">
					<div>${service.name}</div>
					<div>$${service.price}</div>
					<div>${service.duration} min</div>
					<div>
						<span class="status-badge status-${service.active ? 'active' : 'inactive'}">
							${service.active ? 'Activo' : 'Inactivo'}
						</span>
					</div>
					<div class="action-buttons">
						<button class="action-btn btn-edit" onclick="AdminSystem.editService(${service.id})">
							Editar
						</button>
						<button class="action-btn btn-toggle" onclick="AdminSystem.toggleService(${service.id})">
							${service.active ? 'Desactivar' : 'Activar'}
						</button>
						<button class="action-btn btn-delete" onclick="AdminSystem.deleteService(${service.id})">
							Eliminar
						</button>
					</div>
				</div>
			`).join('');
		},

		renderAdminCalendar: function() {
			const monthNames = [
				'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
				'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
			];

			const currentMonth = this.currentMonth.getMonth();
			const currentYear = this.currentMonth.getFullYear();

			document.getElementById('admin-current-month').textContent = 
				`${monthNames[currentMonth]} ${currentYear}`;

			const grid = document.getElementById('admin-calendar-grid');
			const dayHeaders = grid.querySelectorAll('.day-header');
			
			const cells = grid.querySelectorAll('.admin-day-cell');
			cells.forEach(cell => cell.remove());

			const firstDay = new Date(currentYear, currentMonth, 1);
			const lastDay = new Date(currentYear, currentMonth + 1, 0);
			const daysInMonth = lastDay.getDate();
			const startingDayOfWeek = firstDay.getDay();

			// Días del mes anterior
			const prevMonth = new Date(currentYear, currentMonth - 1, 0);
			for (let i = startingDayOfWeek - 1; i >= 0; i--) {
				const dayNum = prevMonth.getDate() - i;
				const cell = this.createAdminDayCell(dayNum, 'other-month');
				grid.appendChild(cell);
			}

			// Días del mes actual
			for (let day = 1; day <= daysInMonth; day++) {
				const date = new Date(currentYear, currentMonth, day);
				const appointmentCount = this.getAppointmentsForDate(date);
				const cell = this.createAdminDayCell(day, this.getAdminDayStatus(date), appointmentCount);
				grid.appendChild(cell);
			}

			// Completar calendario
			const totalCells = grid.children.length;
			const remainingCells = 42 - totalCells;
			for (let day = 1; day <= remainingCells; day++) {
				const cell = this.createAdminDayCell(day, 'other-month');
				grid.appendChild(cell);
			}
		},

		createAdminDayCell: function(day, status, appointmentCount = 0) {
			const cell = document.createElement('div');
			cell.className = `admin-day-cell ${status}`;
			cell.innerHTML = `
				<div>${day}</div>
				${appointmentCount > 0 ? `<div class="appointments-count">${appointmentCount} turnos</div>` : ''}
			`;
			return cell;
		},

		getAdminDayStatus: function(date) {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			
			if (date < today) return 'closed';
			
			const dayOfWeek = date.getDay();
			if (!BookingSystem.workingDays.includes(dayOfWeek)) return 'closed';
			
			const hasAppointments = this.getAppointmentsForDate(date) > 0;
			return hasAppointments ? 'occupied' : 'available';
		},

		getAppointmentsForDate: function(date) {
			const dateStr = date.toISOString().split('T')[0];
			return this.appointments.filter(apt => apt.date === dateStr).length;
		},

		showServiceForm: function(service = null) {
			const modal = document.getElementById('service-form-modal');
			const form = document.getElementById('service-form');
			const title = document.getElementById('service-form-title');

			if (service) {
				title.textContent = 'Editar Servicio';
				document.getElementById('service-name').value = service.name;
				document.getElementById('service-price').value = service.price;
				document.getElementById('service-duration').value = service.duration;
				document.getElementById('service-description').value = service.description || '';
				form.dataset.serviceId = service.id;
			} else {
				title.textContent = 'Agregar Servicio';
				form.reset();
				delete form.dataset.serviceId;
			}

			modal.classList.remove('hidden');
		},

		hideServiceForm: function() {
			document.getElementById('service-form-modal').classList.add('hidden');
		},

		saveService: function() {
			const form = document.getElementById('service-form');
			const serviceData = {
				name: document.getElementById('service-name').value,
				price: parseInt(document.getElementById('service-price').value),
				duration: parseInt(document.getElementById('service-duration').value),
				description: document.getElementById('service-description').value,
				active: true
			};

			if (form.dataset.serviceId) {
				// Editar servicio existente
				const serviceId = parseInt(form.dataset.serviceId);
				const serviceIndex = this.services.findIndex(s => s.id === serviceId);
				this.services[serviceIndex] = { ...this.services[serviceIndex], ...serviceData };
			} else {
				// Agregar nuevo servicio
				const newId = Math.max(...this.services.map(s => s.id)) + 1;
				this.services.push({ id: newId, ...serviceData });
			}

			this.updateServiceOptions();
			this.renderServices();
			this.hideServiceForm();
		},

		updateServiceOptions: function() {
			const select = document.getElementById('client-service');
			const activeServices = this.services.filter(s => s.active);
			
			// Mantener opción vacía y "Otro"
			select.innerHTML = `
				<option value="">Seleccionar servicio...</option>
				${activeServices.map(service => 
					`<option value="${service.name.toLowerCase().replace(/\s+/g, '-')}">${service.name} - $${service.price}</option>`
				).join('')}
				<option value="otro">Otro</option>
			`;
		},

		editService: function(serviceId) {
			const service = this.services.find(s => s.id === serviceId);
			if (service) {
				this.showServiceForm(service);
			}
		},

		deleteService: function(serviceId) {
			if (confirm('¿Estás segura de que querés eliminar este servicio?')) {
				this.services = this.services.filter(s => s.id !== serviceId);
				this.updateServiceOptions();
				this.renderServices();
			}
		},

		toggleService: function(serviceId) {
			const service = this.services.find(s => s.id === serviceId);
			if (service) {
				service.active = !service.active;
				this.updateServiceOptions();
				this.renderServices();
			}
		},

		editAppointment: function(appointmentId) {
			// Implementar edición de turnos (por ahora solo alerta)
			alert('Función de editar turno en desarrollo');
		},

		deleteAppointment: function(appointmentId) {
			if (confirm('¿Estás segura de que querés eliminar este turno?')) {
				this.appointments = this.appointments.filter(a => a.id !== appointmentId);
				this.renderAppointments();
			}
		},

		filterAppointments: function(type, customDate = null) {
			let filter;
			switch(type) {
				case 'today':
					filter = 'today';
					break;
				case 'week':
					filter = 'week';
					break;
				case 'custom':
					filter = customDate;
					break;
				default:
					filter = 'all';
			}
			this.renderAppointments(filter);
		},

		applyDateFilter: function(appointments, filter) {
			const today = new Date();
			const todayStr = today.toISOString().split('T')[0];

			switch(filter) {
				case 'today':
					return appointments.filter(apt => apt.date === todayStr);
				case 'week':
					const weekStart = new Date(today);
					weekStart.setDate(today.getDate() - today.getDay());
					const weekEnd = new Date(weekStart);
					weekEnd.setDate(weekStart.getDate() + 6);
					return appointments.filter(apt => {
						const aptDate = new Date(apt.date);
						return aptDate >= weekStart && aptDate <= weekEnd;
					});
				default:
					if (filter && filter !== 'all') {
						return appointments.filter(apt => apt.date === filter);
					}
					return appointments;
			}
		},

		getStatusText: function(status) {
			const statusMap = {
				'confirmed': 'Confirmado',
				'pending': 'Pendiente',
				'cancelled': 'Cancelado'
			};
			return statusMap[status] || status;
		},

		// Agregar turno desde el sistema de reservas
		addAppointment: function(appointmentData) {
			const newId = this.appointments.length > 0 ? Math.max(...this.appointments.map(a => a.id)) + 1 : 1;
			this.appointments.push({
				id: newId,
				...appointmentData,
				status: 'pending'
			});
		}
	};

	*/

	// Inicializar sistema cuando carga la página
	window.addEventListener('load', function() {
		BookingSystem.init();
	});

})();
