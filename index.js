//express
const express = require('express');
const app = express();
const PORT = 3000; // puede cambiar
const path = require('path');

//array 
let librosBiblicos = [
    {id: 1 , nombre: 'Genesis', autor: 'Moises'},
    {id: 2 , nombre: 'Exodo', autor: 'Moises'},
    {id: 3 , nombre: 'Levitico', autor: 'Moises'},
    {id: 4 , nombre: 'Levitico2', autor: 'Favio'},
    {id: 5 , nombre: 'Juan', autor: 'Favio'},
];



//manejo de JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome.html'));
});
app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome.html'));
});

//endpoint 1 obtener todos los libros
app.get('/libros', (req, res) => {
    const filterBy = req.query.filterBy; // Campo por el que filtrar (id, nombre, autor)
    const filterValue = req.query.filterValue; // Valor del filtro
    const orderBy = req.query.orderBy;
    const dir = req.query.dir;

    let filteredLibros = librosBiblicos;

    if (filterBy && filterValue) {
        filteredLibros = filteredLibros.filter(libro => {
            const libroValue = String(libro[filterBy]).toLowerCase();
            console.log('libroValue',libroValue)
            console.log('filterValue',filterValue)
            return libroValue.includes(String(filterValue).toLowerCase());
        });
    }


    // Ordenación
    if (orderBy && (dir === 'asc' || dir === 'desc')) {
        filteredLibros.sort((a, b) => {
            let valA = (typeof a[orderBy] === 'string') ? a[orderBy].toLowerCase() : a[orderBy];
            let valB = (typeof b[orderBy] === 'string') ? b[orderBy].toLowerCase() : b[orderBy];

            if (valA < valB) {
                return dir === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return dir === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }


    res.json({data:filteredLibros, count: filteredLibros.length});
});
// endpoint 2 obtener libro por ID
app.get('/libros/:id',(req, res) => {
    const idCapturado = parseInt(req.params.id);
    console.log(idCapturado);
    const libroEncontrado = librosBiblicos.find((libro) => libro.id === idCapturado);
    if (libroEncontrado) {
        res.json(libroEncontrado);
    } else {
        res.status(404).json({mensaje : 'Libro no encontrado'});
    }
});
// endpoint 3 Agregar un libro
app.post('/agregar-libro', (req, res) => {
    const nuevoLibro = req.body;
    console.log(nuevoLibro);
    librosBiblicos.push(nuevoLibro);
    res.status(201).json('este libro fue guardado exitosamente');
})
// endpoint 4 Actualizar el libro
app.put('/actualizar-libro/:id', (req, res) => {
    const idCapturado = parseInt(req.params.id);
    const indexLibroLocalizado = librosBiblicos.findIndex((libro) => libro.id === idCapturado);
    if (indexLibroLocalizado !== -1 ){
        librosBiblicos[indexLibroLocalizado] = req.body;
        res.json(librosBiblicos[indexLibroLocalizado]);
    } else {
        res.status(404).json({mensaje : 'Libro no encontrado'});
    }
});

app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto http://localhost:" + PORT);
});