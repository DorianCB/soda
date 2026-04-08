let carrito = [];

// Agrega un producto o aumenta su cantidad si ya existe
function agregarAlCarrito(nombre, precio, urlImagen) {
    const itemExistente = carrito.find(item => item.nombre === nombre);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ nombre, precio, urlImagen, cantidad: 1 });
    }
    
    actualizarContador();
}

// Suma todas las cantidades para el icono flotante
function actualizarContador() {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    document.getElementById('contador-carrito').innerText = totalItems;
}

// Función para los botones + y - del Spinbox
function cambiarCantidad(nombre, delta) {
    const item = carrito.find(i => i.nombre === nombre);
    if (item) {
        item.cantidad += delta;
        if (item.cantidad <= 0) {
            carrito = carrito.filter(i => i.nombre !== nombre);
        }
    }
    actualizarContador();
    abrirCarrito(); // Refresca el modal para mostrar cambios
}

function abrirCarrito() {
    const modal = document.getElementById('modal-carrito');
    const lista = document.getElementById('items-carrito');
    const totalSpan = document.getElementById('total-modal');
    
    lista.innerHTML = ""; 
    let total = 0;

    if (carrito.length === 0) {
        lista.innerHTML = "<p style='text-align:center; padding:20px;'>Tu carrito está vacío 🌮</p>";
    } else {
        carrito.forEach((item) => {
            lista.innerHTML += `
                <div class="item-carrito-fila">
                    <img src="${item.urlImagen}" alt="${item.nombre}">
                    <div class="item-info">
                        <span>${item.nombre}</span>
                        <strong>₡${item.precio * item.cantidad}</strong>
                    </div>
                    <div class="spinbox">
                        <button onclick="cambiarCantidad('${item.nombre}', -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button onclick="cambiarCantidad('${item.nombre}', 1)">+</button>
                    </div>
                </div>`;
            total += (item.precio * item.cantidad);
        });
    }

    totalSpan.innerText = total;
    modal.style.display = "block";
}

function cerrarCarrito() {
    document.getElementById('modal-carrito').style.display = "none";
}

function enviarWhatsApp() {
    if (carrito.length === 0) return;

    let texto = "¡Hola Chavela! 👋 Quisiera hacer un pedido:%0A%0A";
    let total = 0;

    carrito.forEach((item) => {
        texto += `• ${item.cantidad}x ${item.nombre} - ₡${item.precio * item.cantidad}%0A`;
        total += (item.precio * item.cantidad);
    });

    texto += `%0A*Total: ₡${total}*`;
    
    const numeroChavela = "50687304779"; 
    window.open(`https://wa.me/${numeroChavela}?text=${texto}`, '_blank');
}

// Cerrar modal al hacer clic fuera
window.onclick = (event) => {
    if (event.target == document.getElementById('modal-carrito')) cerrarCarrito();
}