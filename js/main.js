
let queryString = location.search
let id = new URLSearchParams(queryString).get("id")

const app = Vue.

	createApp({
		data() {
			return {
				events: [],
				eventsSearch: [],
				eventsSearchUpcoming: [],
				eventsUpcoming: [],
				eventsPast: [],
				category: [],
				selectCategory: [],
				eventosFiltrados: [],
				input: '',
				eventoid: [],
				table: [],
				tableUp: [],
				tablePast: [],
				upcomingEvents: [],
				pastEvents: [],
				tableEvents: []
			}
		},
		created() {
			this.events.push('events')
			fetch('http://amazing-events.herokuapp.com/api/events')
				.then((response) => response.json())
				.then((json) => {
					let docTitle = document.title;
					this.events = json.events;
					if (docTitle == "Amazing Events") {
						this.events = json.events;
						} else if (docTitle == "Amazing Events Upcoming") {
							this.events = this.events.filter(events => events.date >= json.currentDate)
						} else if (docTitle == "Amazing Events Past") {
							this.events = this.events.filter(events => events.date <= json.currentDate)
						} else if (docTitle == "Amazing Events Details") {
							this.eventoid = this.events.find(event => event._id == id)
							console.log('this.eventoid')
						} else if (docTitle == "Amazing Events Stats") {
							this.upcomingEvents = this.events.filter((event) => event.date > json.currentDate)
							this.pastEvents = this.events.filter((event) => event.date < json.currentDate)
							this.tableUp = this.calculadora(this.upcomingEvents)
							this.tablePast = this.calculadora(this.pastEvents)
							this.table = this.conseguirMayorCapacidad(this.events)
							this.tableEvents = this.table.map(evento => evento.name)
						}

					this.events.forEach(event => {
						if (!this.category.includes(event.category))
							this.category.push(event.category)
					})
					this.eventsSearch = this.events
				    })

				.catch((error) => console.log(error))
		},

		mounted() { },
		methods: {
			filterSerch(eventsArray) {
				this.eventosFiltrados = eventsArray.filter(item => item.name.toLowerCase().includes(this.input.toLowerCase()))
			},

			calculadora(array) {
				let arraysinduplicados = []
				array.forEach(evento => {
					if (!arraysinduplicados.includes(evento.category)) {
						arraysinduplicados.push(evento.category)
					}
				})
				let arraycalculos = []
				arraysinduplicados.forEach(category => {
					let categoriasAgrupadas = array.filter(events => events.category == category)
					let ingresos = categoriasAgrupadas.map(events => (events.estimate ? events.estimate : events.assistance) * events.price)
					let totalIngresos = ingresos.reduce((a, b) => a = a + b, 0)
					let porcentaje = categoriasAgrupadas.map(events => ((events.estimate ? events.estimate : events.assistance) / events.capacity))
					let totalPorcentaje = porcentaje.reduce((a, b) => a = a + b, 0);
					arraycalculos.push([category, totalIngresos, parseInt(totalPorcentaje / categoriasAgrupadas.length * 100)])
				})
				return arraycalculos
			},

			conseguirMayorCapacidad(eventosPasados) {
				let porcentajeAsistencia = eventosPasados.filter(evento => evento.assistance != undefined)
				let capacidades = eventosPasados.map(event => event.capacity)
				let eventoMasCapacidad = eventosPasados.find(event => event.capacity == Math.max(...capacidades))
				let asistencias = porcentajeAsistencia.map(event => event.assistance / event.capacity)
				let eventoMayorPorcentaje = porcentajeAsistencia.find(event => event.assistance / event.capacity == Math.max(...asistencias))
				let eventoMenorPorcentaje = porcentajeAsistencia.find(event => event.assistance / event.capacity == Math.min(...asistencias))

				return [eventoMayorPorcentaje, eventoMenorPorcentaje, eventoMasCapacidad]
			},
		},

		computed: {
			selectCheck() {
				if (this.selectCategory.length != 0) {
					this.eventosFiltrados = this.events.filter(event => this.selectCategory.includes(event.category))
				} else {
					this.eventosFiltrados = this.events
				}
				if (this.input != "") {
					this.filterSerch(this.eventosFiltrados)
				}
			}
		},
	}).mount('#app')