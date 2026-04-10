// ... (Tus funciones de carrito, agregarDirecto, abrirOpciones se mantienen igual) ...

function filtrarMenu(categoria, elemento) {
    // 1. Estilo de los botones
    document.querySelectorAll('.btn-categoria').forEach(btn => btn.classList.remove('active'));
    elemento.classList.add('active');

    // 2. Filtrado de cuadros
    const productos = document.querySelectorAll('.producto-card');
    productos.forEach(prod => {
        if (categoria === 'todo') {
            prod.style.display = 'flex'; // Muestra todos
        } else {
            // Muestra solo si tiene la clase 'estudiantil'
            if (prod.classList.contains(categoria)) {
                prod.style.display = 'flex';
            } else {
                prod.style.display = 'none';
            }
        }
    });
}