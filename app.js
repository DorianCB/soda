const platosDB = {
    'todo': [
        { id: 1, nombre: 'Casado Completo', precio: 3500, img: 'pictures/casado.png', desc: 'Arroz, frijoles, ensalada, plátano maduro y carne.' },
        { id: 2, nombre: 'Empanada Carne', precio: 1200, img: 'pictures/empanada.png', desc: 'Empanada grande artesanal recién hecha.' },
        { id: 3, nombre: 'Taco Tico', precio: 1500, img: 'pictures/casado.png', desc: 'Taco tradicional con repollo y salsas.' }
    ],
    'estudiantil': [
        { id: 4, nombre: 'Promo Estudiante', precio: 2000, img: 'pictures/empanada.png', desc: 'Empanada + Fresco natural.' },
        { id: 5, nombre: 'Burrito Económico', precio: 1500, img: 'pictures/casado.png', desc: 'Burrito de frijol y queso.' }
    ]
};

let carrito = {}; 
let categoriaActual = 'todo';

// --- NAVEGACIÓN ---
function cambiarMenu(cat, btn) {
    categoriaActual = cat;
    document.querySelectorAll('.btn-categoria').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    volverAlCarrusel();
    renderizarCarrusel();
}

function renderizarCarrusel() {
    const contenedor = document.getElementById('carrusel-dinamico');
    contenedor.innerHTML = '';
    platosDB[categoriaActual].forEach(plato => {
        contenedor.innerHTML += `
            <div class="card-carrusel" onclick="abrirDetalle('${categoriaActual}', ${plato.id})">
                <img src="${plato.img}">
                <div class="precio-tag">₡${plato.precio}</div>
                <div class="info-min"><h3>${plato.nombre}</h3></div>
            </div>`;
    });
}

function mostrarTodoEnGrid() {
    document.getElementById('seccion-populares').style.display = 'none';
    document.getElementById('seccion-todo').style.display = 'block';
    const grid = document.getElementById('grid-platos');
    grid.innerHTML = '';
    platosDB[categoriaActual].forEach(plato => {
        grid.innerHTML += `
            <div class="card-grid" onclick="abrirDetalle('${categoriaActual}', ${plato.id})">
                <img src="${plato.img}">
                <div class="info-grid"><h3>${plato.nombre}</h3><p style="color:var(--primario); font-weight:bold;">₡${plato.precio}</p></div>
            </div>`;
    });
}

function volverAlCarrusel() {
    document.getElementById('seccion-populares').style.display = 'block';
    document.getElementById('seccion-todo').style.display = 'none';
}

// --- MODAL DETALLE ---
function abrirDetalle(cat, id) {
    const plato = platosDB[cat].find(p => p.id === id);
    const modal = document.getElementById('modal-opciones');
    let opcionesHTML = '';
    
    if (plato.nombre.toLowerCase().includes('empanada')) {
        opcionesHTML = `
            <div class="selector-grupo">
                <label>Sabor:</label>
                <select id="sabor-seleccionado" class="select-personalizado">
                    <option value="Carne">Carne 🥩</option>
                    <option value="Pollo">Pollo 🍗</option>
                    <option value="Queso">Queso 🧀</option>
                </select>
            </div>`;
    }

    modal.innerHTML = `
        <div style="position: relative; background: white; height: 100%;">
            <button class="atras-btn" style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.5); color: white; width: 40px; height: 40px; border-radius: 50%; z-index: 10;" onclick="cerrarDetalle()">✕</button>
            <img src="${plato.img}" style="width: 100%; height: 280px; object-fit: cover;">
            <div style="padding: 25px; background: white; border-radius: 30px 30px 0 0; margin-top: -30px; position: relative;">
                <h1>${plato.nombre}</h1>
                <p style="color:var(--primario); font-size: 1.5rem; font-weight: bold; margin: 5px 0;">₡${plato.precio}</p>
                ${opcionesHTML}
                <div class="selector-grupo">
                    <label>Notas:</label>
                    <textarea id="notas-producto" class="notas-area" placeholder="Ej: Sin salsas..."></textarea>
                </div>
                <button class="confirmar-btn" style="margin-top: 25px;" onclick="procesarCompra(${plato.id})">Agregar 🛒</button>
            </div>
        </div>`;
    modal.style.display = 'block';
}

function cerrarDetalle() { document.getElementById('modal-opciones').style.display = 'none'; }

// --- CARRITO ---
function procesarCompra(id) {
    const sabor = document.getElementById('sabor-seleccionado')?.value || "";
    const notas = document.getElementById('notas-producto').value.trim();
    const key = `${id}-${sabor}-${notas}`;
    
    if (!carrito[key]) carrito[key] = { id: id, cantidad: 0, sabor: sabor, notas: notas };
    carrito[key].cantidad += 1;
    actualizarInterfazCarrito();
    cerrarDetalle();
}

function cambiarCantidad(key, delta) {
    carrito[key].cantidad += delta;
    if (carrito[key].cantidad <= 0) delete carrito[key];
    actualizarInterfazCarrito();
    dibujarListaCarrito();
}

function actualizarInterfazCarrito() {
    const total = Object.values(carrito).reduce((a, b) => a + b.cantidad, 0);
    document.getElementById('contador-badge').innerText = total;
}

function abrirCarrito() {
    document.getElementById('modal-carrito').style.display = 'block';
    dibujarListaCarrito();
}

function cerrarCarrito() { document.getElementById('modal-carrito').style.display = 'none'; }

function dibujarListaCarrito() {
    const contenedor = document.getElementById('items-carrito-lista');
    contenedor.innerHTML = '';
    let sumaTotal = 0;
    const todosPlatos = [...platosDB.todo, ...platosDB.estudiantil];

    for (let key in carrito) {
        const item = carrito[key];
        const p = todosPlatos.find(pl => pl.id == item.id);
        sumaTotal += p.precio * item.cantidad;
        contenedor.innerHTML += `
            <div class="item-carrito">
                <img src="${p.img}">
                <div class="item-info">
                    <h4>${p.nombre} ${item.sabor ? `(${item.sabor})` : ''}</h4>
                    ${item.notas ? `<p class="item-notas">"${item.notas}"</p>` : ''}
                    <p>₡${p.precio}</p>
                </div>
                <div class="controles-cantidad">
                    <button class="btn-qty" onclick="cambiarCantidad('${key}', -1)">−</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-qty" onclick="cambiarCantidad('${key}', 1)">+</button>
                </div>
            </div>`;
    }
    document.getElementById('monto-total').innerText = sumaTotal;
}

function enviarWhatsApp() {
    const hora = document.getElementById('hora-entrega').value;
    const ubicacion = document.getElementById('ubicacion-entrega').value;
    const pago = document.getElementById('metodo-pago').value;

    if (!hora || !ubicacion) return alert("Por favor completa la hora y ubicación.");

    const todosPlatos = [...platosDB.todo, ...platosDB.estudiantil];
    let mensaje = "¡Hola Ventanita de Chavela! 🌯%0A*Nuevo Pedido de la App*%0A%0A";
    let total = 0;

    for (let key in carrito) {
        const item = carrito[key];
        const p = todosPlatos.find(pl => pl.id == item.id);
        mensaje += `• *${p.nombre}* ${item.sabor ? `(${item.sabor})` : ''} x${item.cantidad}%0A`;
        if(item.notas) mensaje += `  _Nota: ${item.notas}_%0A`;
        total += p.precio * item.cantidad;
    }

    mensaje += `%0A💰 *Total: ₡${total}*%0A---%0A⏰ *Hora:* ${hora}%0A📍 *Ubicación:* ${ubicacion}%0A💳 *Pago:* ${pago}`;

    if (total === 0) return alert("El carrito está vacío.");
    window.open(`https://wa.me/50687304779?text=${mensaje}`, '_blank');
}

window.onload = () => renderizarCarrusel();