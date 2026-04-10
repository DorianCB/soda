let carrito = [];
let productoTemporal = null;

// Para productos que NO necesitan personalización
function agregarDirecto(nombre, precio, urlImagen) {
    const itemExistente = carrito.find(item => item.nombre === nombre);
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ nombre, precio, urlImagen, cantidad: 1, notas: "" });
    }
    actualizarContador();
}

// Para productos que SI necesitan personalización
function abrirOpciones(nombre, precio, urlImagen) {
    productoTemporal = { nombre, precio, urlImagen };
    document.getElementById('opciones-titulo').innerText = "Personalizar " + nombre;
    document.getElementById('modal-opciones').style.display = "block";
}

function cerrarOpciones() {
    document.getElementById('modal-opciones').style.display = "none";
    document.getElementById('notas-producto').value = "";
}

function confirmarAgregado() {
    const relleno = document.querySelector('input[name="relleno"]:checked').value;
    const notas = document.getElementById('notas-producto').value.trim();
    const nombreCompleto = `${productoTemporal.nombre} (${relleno})`;

    const itemExistente = carrito.find(item => 
        item.nombre === nombreCompleto && item.notas === notas
    );

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ 
            nombre: nombreCompleto, 
            precio: productoTemporal.precio, 
            urlImagen: productoTemporal.urlImagen, 
            cantidad: 1, 
            notas: notas 
        });
    }
    
    actualizarContador();
    cerrarOpciones();
}

function actualizarContador() {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    document.getElementById('contador-carrito').innerText = totalItems;
}

function cambiarCantidad(nombre, delta, notas) {
    const item = carrito.find(i => i.nombre === nombre && i.notas === notas);
    if (item) {
        item.cantidad += delta;
        if (item.cantidad <= 0) {
            carrito = carrito.filter(i => !(i.nombre === nombre && i.notas === notas));
        }
    }
    actualizarContador();
    abrirCarrito();
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
                    <img src="${item.urlImagen}">
                    <div class="item-info">
                        <span>${item.nombre}</span>
                        ${item.notas ? `<small style="color:#e67e22; font-style:italic;">"${item.notas}"</small>` : ''}
                        <strong>₡${item.precio * item.cantidad}</strong>
                    </div>
                    <div class="spinbox">
                        <button onclick="cambiarCantidad('${item.nombre}', -1, '${item.notas}')">-</button>
                        <span>${item.cantidad}</span>
                        <button onclick="cambiarCantidad('${item.nombre}', 1, '${item.notas}')">+</button>
                    </div>
                </div>`;
            total += (item.precio * item.cantidad);
        });
    }
    totalSpan.innerText = total;
    modal.style.display = "block";
}

function cerrarCarrito() { document.getElementById('modal-carrito').style.display = "none"; }

function enviarWhatsApp() {
    if (carrito.length === 0) return;
    let texto = "¡Hola Chavela! 👋 Quisiera hacer un pedido:%0A%0A";
    let total = 0;

    carrito.forEach((item) => {
        texto += `• ${item.cantidad}x ${item.nombre}%0A`;
        if(item.notas) texto += `  _Nota: ${item.notas}_%0A`;
        texto += `  Subtotal: ₡${item.precio * item.cantidad}%0A%0A`;
        total += (item.precio * item.cantidad);
    });

    texto += `%0A*Total a pagar: ₡${total}*`;
    const numeroChavela = "50687304779"; 
    window.open(`https://wa.me/${numeroChavela}?text=${texto}`, '_blank');
}

window.onclick = (e) => {
    if (e.target.className === 'modal') {
        cerrarOpciones();
        cerrarCarrito();
    }
}