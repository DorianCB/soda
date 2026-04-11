const platosDB = {
    'todo': [
        { id: 1, nombre: 'Casado Completo', precio: 3500, img: 'pictures/casado.png', desc: 'Arroz, frijoles, ensalada, plátano maduro y carne.' },
        { id: 2, nombre: 'Empanada Carne', precio: 1200, img: 'pictures/empanada.png', desc: 'Empanada grande artesanal recién hecha.' },
        { id: 3, nombre: 'Taco Tico', precio: 1500, img: 'pictures/casado.png', desc: 'Taco tradicional con repollo y salsas.' }
    ],
    'estudiantil': [
        { id: 4, nombre: 'Promo Estudiante', precio: 2000, img: 'pictures/empanada.png', desc: 'Empanada + Fresco natural. Presentar carnet.' },
        { id: 5, nombre: 'Burrito Económico', precio: 1500, img: 'pictures/casado.png', desc: 'Burrito de frijol y queso, ideal para el receso.' }
    ]
};

let carrito = {}; // Estructura: { "id_del_producto": cantidad }
let categoriaActual = 'todo';

// --- CAMBIO DE CATEGORÍA ---
function cambiarMenu(cat, btn) {
    categoriaActual = cat;
    document.querySelectorAll('.btn-categoria').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    volverAlCarrusel(); // Resetear vista
    renderizarCarrusel();
}

// --- RENDERIZADO DE VISTAS ---
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
                <div class="info-grid">
                    <h3>${plato.nombre}</h3>
                    <p style="color:var(--primario); font-weight:bold;">₡${plato.precio}</p>
                </div>
            </div>`;
    });
}

function volverAlCarrusel() {
    document.getElementById('seccion-populares').style.display = 'block';
    document.getElementById('seccion-todo').style.display = 'none';
}

// --- DETALLE DEL PLATO ---
function abrirDetalle(cat, id) {
    const plato = platosDB[cat].find(p => p.id === id);
    const modal = document.getElementById('modal-detalle');
    
    modal.innerHTML = `
        <div style="position: relative;">
            <button class="atras-btn" style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.5); color: white; width: 40px; height: 40px; border-radius: 50%;" onclick="cerrarDetalle()">✕</button>
            <img src="${plato.img}" style="width: 100%; height: 300px; object-fit: cover;">
            <div style="padding: 25px; background: white; border-radius: 30px 30px 0 0; margin-top: -30px; position: relative;">
                <h1>${plato.nombre}</h1>
                <p style="color:var(--primario); font-size: 1.5rem; font-weight: bold; margin: 10px 0;">₡${plato.precio}</p>
                <p style="color: #666; line-height: 1.6;">${plato.desc}</p>
                <button class="confirmar-btn" style="margin-top: 30px;" onclick="añadirAlCarrito(${plato.id})">Agregar al pedido 🛒</button>
            </div>
        </div>`;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function cerrarDetalle() {
    document.getElementById('modal-detalle').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// --- LÓGICA DEL CARRITO ---
function añadirAlCarrito(id) {
    carrito[id] = (carrito[id] || 0) + 1;
    actualizarInterfazCarrito();
    cerrarDetalle();
}

function cambiarCantidad(id, delta) {
    if (carrito[id]) {
        carrito[id] += delta;
        if (carrito[id] <= 0) delete carrito[id];
    }
    actualizarInterfazCarrito();
    dibujarListaCarrito();
}

function actualizarInterfazCarrito() {
    const totalItems = Object.values(carrito).reduce((a, b) => a + b, 0);
    document.getElementById('contador-badge').innerText = totalItems;
}

function abrirCarrito() {
    document.getElementById('modal-carrito').style.display = 'block';
    dibujarListaCarrito();
}

function cerrarCarrito() {
    document.getElementById('modal-carrito').style.display = 'none';
}

function dibujarListaCarrito() {
    const contenedor = document.getElementById('items-carrito-lista');
    const totalTxt = document.getElementById('monto-total');
    contenedor.innerHTML = '';
    let sumaTotal = 0;

    // Buscar en ambas categorías para encontrar el plato por ID
    const todosLosPlatos = [...platosDB.todo, ...platosDB.estudiantil];

    for (let id in carrito) {
        const plato = todosLosPlatos.find(p => p.id == id);
        if (plato) {
            const subtotal = plato.precio * carrito[id];
            sumaTotal += subtotal;
            
            contenedor.innerHTML += `
                <div class="item-carrito">
                    <img src="${plato.img}">
                    <div class="item-info">
                        <h4>${plato.nombre}</h4>
                        <p>₡${plato.precio}</p>
                    </div>
                    <div class="controles-cantidad">
                        <button class="btn-qty" onclick="cambiarCantidad(${id}, -1)">−</button>
                        <span>${carrito[id]}</span>
                        <button class="btn-qty" onclick="cambiarCantidad(${id}, 1)">+</button>
                    </div>
                </div>`;
        }
    }
    totalTxt.innerText = sumaTotal;
    if (sumaTotal === 0) contenedor.innerHTML = '<p style="text-align:center; color:#999; margin-top:50px;">Tu carrito está vacío</p>';
}

function enviarWhatsApp() {
    const todosLosPlatos = [...platosDB.todo, ...platosDB.estudiantil];
    let mensaje = "¡Hola Ventanita de Chavela! 🌯 Este es mi pedido:%0A%0A";
    let total = 0;

    for (let id in carrito) {
        const plato = todosLosPlatos.find(p => p.id == id);
        mensaje += `• ${plato.nombre} (x${carrito[id]}) - ₡${plato.precio * carrito[id]}%0A`;
        total += plato.precio * carrito[id];
    }

    if (total === 0) return alert("Añade algo al carrito primero.");
    
    mensaje += `%0A*Total: ₡${total}*`;
    window.open(`https://wa.me/50687304779?text=${mensaje}`, '_blank');
}

// Inicializar
window.onload = () => renderizarCarrusel();