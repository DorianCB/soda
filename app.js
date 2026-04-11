// Prueba de funcionalidad del carrusel
console.log("Carrusel cargado correctamente");

// En el futuro, aquí agregaremos la función para abrir el detalle del plato
document.querySelectorAll('.card-carrusel').forEach(card => {
    card.addEventListener('click', () => {
        const nombre = card.querySelector('h3').innerText;
        alert("Seleccionaste: " + nombre + "\n¡Pronto verás aquí la información detallada!");
    });
});