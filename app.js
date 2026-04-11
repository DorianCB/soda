// Base de datos de platos (Igual que antes)
const platosMenu = {
    'todo': [
        { nombre: 'Casado Completo', precio: 3500, img: 'pictures/casado.png', desc: 'Arroz, frijoles, ensalada, plátano maduro y carne.' },
        { nombre: 'Empanada Carne', precio: 1200, img: 'pictures/empanada.png', desc: 'Empanada grande con carne mechada.' },
        { nombre: 'Taco Tico', precio: 1500, img: 'pictures/casado.png', desc: 'Taco tradicional con repollo y salsas.' }
    ],
    'estudiantil': [
        { nombre: 'Promo Estudiante', precio: 2000, img: 'pictures/empanada.png', desc: 'Empanada + Fresco natural. ¡Solo con carnet!' },
        { nombre: 'Burrito Económico', precio: 1500, img: 'pictures/casado.png', desc: 'Burrito de frijol y queso, perfecto para el receso.' },
        { nombre: 'Bowl de Frutas', precio: 1000, img: 'pictures/empanada.png', desc: 'Fruta fresca de temporada.' }
    ]
};

// --- LÓGICA DEL CARRITO (MODIFICADA PARA CANTIDADES) ---
// Guardamos como objeto: { 'Nombre': cantidad }
let carritoModificado = {}; 

function añadirDesdeDetalle(nombre, precio) {
    // Si no existe, lo inicializa en 1. Si existe, suma 1.
    if (carritoModificado[nombre]) {
        carritoModificado[nombre]++;
    } else {
        carritoModificado[nombre] = 1;
    }
    
    actualizarContador();
    cerrarDetalle();
}

function actualizarContador() {
    // Suma todas las cantidades del objeto
    const totalItems = Object.values(carritoModificado).reduce((acc, cantidad) => acc + cantidad, 0);
    document.getElementById('contador-carrito').innerText = totalItems;
}

function cambiarCantidad(nombre, cambio) {
    if (carritoModificado[nombre]) {
        carritoModificado[nombre] += cambio;
        
        // Si la cantidad llega a 0, lo elimina del carrito
        if (carritoModificado[nombre] <= 0) {
            delete carritoModificado[nombre];
        }
    }
    dibujarCarrito(); // Redibuja la lista actualizada
    actualizarContador();
}

function abrirCarrito() {
    document.getElementById('modal-carrito').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Bloquea scroll de atrás
    dibujarCarrito(); // Dibuja la lista al abrir
}

function cerrarCarrito() {
    document.getElementById('modal-carrito').style.display = 'none';
    document.body.style.overflow = 'auto'; // Libera scroll
}

function dibujarCarrito() {
    const contenedor = document.getElementById('items-carrito-contenedor');
    contenedor.innerHTML = ''; // Limpia lista anterior
    let totalPrecio = 0;

    // Recorre el objeto de carrito modificado
    for (const nombre in carritoModificado) {
        const cantidad = carritoModificado[nombre];
        
        // Busca el plato en la base de datos para obtener precio e imagen
        const platoData = [...platosMenu.todo, ...platosMenu.estudiantil].find(p => p.nombre === nombre);
        
        if (platoData) {
            totalPrecio += platoData.precio * cantidad;
            
            contenedor.innerHTML += `
                <div class="item-carrito">
                    <img src="${platoData.img}" alt="${nombre}">
                    <div class="item-info">
                        <h4>${nombre}</h4>
                        <p class="item-precio">₡${platoData.precio}</p>
                    </div>
                    <div class="item-controles">
                        <button class="btn-cantidad" onclick="cambiarCantidad('${nombre}', -1)">−</button>
                        <span class="item-cantidad">${cantidad}</span>
                        <button class="btn-cantidad" onclick="cambiarCantidad('${nombre}', 1)">+</button>
                    </div>
                </div>
            `;
        }
    }

    document.getElementById('total-precio-carrito').innerText = totalPrecio;
}

function enviarWhatsApp() {
    if (Object.keys(carritoModificado).length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let mensaje = "¡Hola Ventanita de Chavela! Quisiera hacer un pedido:%0A%0A";
    let total = 0;

    for (const nombre in carritoModificado) {
        const cantidad = carritoModificado[nombre];
        const platoData = [...platosMenu.todo, ...platosMenu.estudiantil].find(p => p.nombre === nombre);
        
        if (platoData) {
            mensaje += `*${nombre}* (x${cantidad}) - ₡${platoData.precio * cantidad}%0A`;
            total += platoData.precio * cantidad;
        }
    }

    mensaje += `%0A*Total: ₡${total}*`;
    const numero = "50687994530"; // Tu número de SINPE
    window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
}

// --- FUNCIONES EXISTENTES (CARRUSEL, DETALLE, CATEGORÍAS) ---
function cambiarMenu(categoria, boton) {
    document.querySelectorAll('.btn-categoria').forEach(btn => btn.classList.remove('active'));
    boton.classList.add('active');
    const titulo = document.getElementById('titulo-seccion');
    titulo.innerText = categoria === 'todo' ? 'Populares 🔥' : 'Especial Estudiantes 🎓';
    const carrusel = document.getElementById('carrusel-dinamico');
    carrusel.innerHTML = ''; 
    platosMenu[categoria].forEach(plato => {
        const card = document.createElement('div');
        card.className = 'card-carrusel';
        card.onclick = () => abrirDetalle(plato.nombre, plato.precio, plato.img, plato.desc);
        card.innerHTML = `
            <img src="${plato.img}" alt="${plato.nombre}">
            <div class="precio-tag">₡${plato.precio}</div>
            <div class="info-min">
                <h3>${plato.nombre}</h3>
            </div>
        `;
        carrusel.appendChild(card);
    });
}

function abrirDetalle(nombre, precio, imagen, descripcion) {
    const modal = document.getElementById('modal-detalle');
    modal.innerHTML = `
        <button class="btn-cerrar-detalle" onclick="cerrarDetalle()">✕</button>
        <img src="${imagen}" class="img-detalle-full">
        <div class="info-detalle-bloque">
            <h1>${nombre}</h1>
            <p style="color:var(--primario); font-size:1.5rem; font-weight:bold; margin: 10px 0;">₡${precio}</p>
            <p style="color:#666; line-height:1.6;">${descripcion}</p>
            <button class="btn-añadir-detalle" onclick="añadirDesdeDetalle('${nombre}', ${precio})">
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

window.onload = () => {
    cambiarMenu('todo', document.getElementById('btn-todo'));
};