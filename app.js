let carrito = [];

function abrirDetalle(nombre, precio, imagen, descripcion) {
    const modal = document.getElementById('modal-detalle');
    modal.innerHTML = `
        <button class="btn-cerrar-detalle" onclick="cerrarDetalle()">✕</button>
        <img src="${imagen}" class="img-detalle-full">
        <div class="info-detalle-bloque">
            <h1>${nombre}</h1>
            <p style="color:var(--primario); font-size:1.5rem; font-weight:bold; margin: 10px 0;">₡${precio}</p>
            <p style="color:#666; line-height:1.6;">${descripcion}</p>
            <button class="btn-añadir-detalle" onclick="añadirCarrito('${nombre}', ${precio})">
                Añadir al pedido 🛒
            </button>
        </div>
    `;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function cerrarDetalle() {
    document.getElementById('modal-detalle').style.display = "none";
    document.body.style.overflow = "auto";
}

function añadirCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    document.getElementById('contador-carrito').innerText = carrito.length;
    cerrarDetalle();
}

function filtrarMenu(categoria, elemento) {
    document.querySelectorAll('.btn-categoria').forEach(btn => btn.classList.remove('active'));
    elemento.classList.add('active');
    console.log("Filtrando por: " + categoria);
}