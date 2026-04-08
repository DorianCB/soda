let carrito = [];

function agregarAlCarrito(nombre, precio, urlImagen) {
    // AHORA GUARDAMOS TAMBIÉN LA IMAGEN
    carrito.push({ nombre, precio, urlImagen });
    actualizarContador();
    console.log("Agregado a la Ventanita: " + nombre);
}

function actualizarContador() {
    document.getElementById('contador-carrito').innerText = carrito.length;
}

function abrirCarrito() {
    const modal = document.getElementById('modal-carrito');
    const lista = document.getElementById('items-carrito');
    const totalSpan = document.getElementById('total-modal');
    
    lista.innerHTML = ""; 
    let total = 0;

    if (carrito.length === 0) {
        lista.innerHTML = "<p style='text-align:center;'>Tu carrito está vacío 🌮</p>";
    } else {
        carrito.forEach((item) => {
            lista.innerHTML += `
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:5px;">
                    <img src="${item.urlImagen}" alt="${item.nombre}" style="width:40px; height:40px; border-radius:5px; object-fit:cover; margin-right:10px;">
                    <span style="flex:1;">${item.nombre}</span>
                    <strong>₡${item.precio}</strong>
                </div>`;
            total += item.precio;
        });
    }

    totalSpan.innerText = total;
    modal.style.display = "block";
}

function cerrarCarrito() {
    document.getElementById('modal-carrito').style.display = "none";
}

function enviarWhatsApp() {
    if (carrito.length === 0) {
        alert("¡Tu carrito está vacío! Elegí algo rico de la Ventanita.");
        return;
    }

    let texto = "¡Hola Chavela! 👋 Quisiera hacer un pedido:%0A%0A";
    let total = 0;

    carrito.forEach((item, index) => {
        // Al WhatsApp solo mandamos texto, las imágenes no hacen falta
        texto += `${index + 1}. ${item.nombre} - ₡${item.precio}%0A`;
        total += item.precio;
    });

    texto += `%0A*Total a pagar: ₡${total}*%0A%0A_Enviado desde el Menú Digital_`;
    
    const numeroChavela = "50687304779"; 
    window.open(`https://wa.me/${numeroChavela}?text=${texto}`, '_blank');
}

// Cerrar al tocar fuera de la ventana
window.onclick = function(event) {
    const modal = document.getElementById('modal-carrito');
    if (event.target == modal) cerrarCarrito();
}