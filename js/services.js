// CARRITO DE SERVICIOS
let carrito = [];
let totalCarrito = 0;

// Recupero los datos del usuario desde el almacenamiento local
const usuarioData = window.localStorage.getItem("usuario");
const usuario = JSON.parse(usuarioData);
let saldo = usuario.saldo;

// Obtener elementos del DOM por su ID
const usuarioElement = document.getElementById("usuario");
const saldoElement = document.getElementById("saldo");

// Actualizar el contenido de los elementos
usuarioElement.textContent = `Hola ${usuario.nombre} ${usuario.apellido}, ahora podrás administrar tus servicios`;
saldoElement.textContent = `Saldo: $${saldo}`;

// Cargar el carrito desde el almacenamiento local
const carritoGuardado = localStorage.getItem("carrito");
if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
}

// Función flecha para obtener las empresas desde el archivo JSON
const obtenerEmpresas = async () => {
    const response = await fetch("./../empresas.json");
    const data = await response.json();
    const empresas = data.empresas;
    const empresasArray = Object.entries(empresas).map(([key, value]) => ({
        [key]: value,
    }));
    return Object.assign({}, ...empresasArray);
};

// Seleccionamos los elementos del HTML
const empresasSelect = document.querySelector("#empresa");
const serviciosSelect = document.querySelector("#servicio");

// Función flecha para actualizar las opciones del select de empresas
const actualizarOpcionesEmpresas = async (empresaElegida) => {
    const empresas = await obtenerEmpresas();
    empresasSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.text = "Seleccione la empresa";
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    empresasSelect.add(defaultOption);
    if (empresaElegida in empresas) {
        empresas[empresaElegida].forEach((empresa) => {
            const option = document.createElement("option");
            option.text = empresa;
            empresasSelect.add(option);
        });
    } else {
        const option = document.createElement("option");
        option.text = "Seleccione un servicio primero";
        empresasSelect.add(option);
        empresasSelect.value = "";
    }
};

// Función flecha para actualizar las opciones de empresas al cambiar el select de servicios
const actualizarEmpresas = () => {
    const empresaElegida = serviciosSelect.value;
    actualizarOpcionesEmpresas(empresaElegida);
};

// Agregamos el listener al select de servicios
serviciosSelect.addEventListener("change", actualizarEmpresas);

// Creamos el arreglo carrito vacío

const agregarItem = () => {
    const servicio = document.getElementById("servicio");
    const servicioSeleccionado = servicio.options[servicio.selectedIndex].text;

    const empresa = document.getElementById("empresa");
    const empresaSeleccionada = empresa.options[empresa.selectedIndex].value;

    const periodo = document.getElementById("periodo");
    const periodoSeleccionado = periodo.options[periodo.selectedIndex].text;

    const monto = parseFloat(document.getElementById("monto").value);

    if (
        servicio.selectedIndex === 0 ||
        empresa.selectedIndex === 0 ||
        periodo.selectedIndex === 0 ||
        isNaN(monto)
    ) {
        swal(
            "Error",
            "Brindar todos los datos del servicio a pagar",
            "warning"
        );
        return;
    }

    // Buscamos si ya existe un item en el carrito con el mismo servicio, empresa y periodo
    const index = carrito.findIndex(
        (item) =>
            item.servicio === servicioSeleccionado &&
            item.empresa === empresaSeleccionada &&
            item.periodo === periodoSeleccionado
    );

    if (index === -1) {
        // Si no existe, agregamos un nuevo item al carrito
        const item = {
            servicio: servicioSeleccionado,
            empresa: empresaSeleccionada,
            periodo: periodoSeleccionado,
            monto: monto,
        };
        carrito.push(item);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        Toastify({
            text: `Servicio de ${servicioSeleccionado} añadido`,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                backgroundImage: "linear-gradient(to right, #0AD100, #37B300)",
                backgroundColor: "#37B300",
            },
        }).showToast();
    } else {
        // Si ya existe, actualizamos el monto del item existente
        carrito[index].monto = monto;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        Toastify({
            text: `Servicio de ${servicioSeleccionado} actualizado`,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                backgroundImage: "linear-gradient(to right, #007AFF, #0055D8)",
                backgroundColor: "#0055D8",
            },
        }).showToast();
    }
};

// Función para mostrar los elementos del carrito en una tabla HTML
const mostrarCarrito = () => {
    const tbody = document.querySelector("#carrito tbody");

    // Limpiamos la tabla antes de agregar los elementos
    tbody.innerHTML = "";

    // Recorremos los elementos del carrito y los agregamos a la tabla
    carrito.forEach((item, index) => {
        const row = tbody.insertRow();
        const cellServicio = row.insertCell();
        const cellEmpresa = row.insertCell();
        const cellPeriodo = row.insertCell();
        const cellMonto = row.insertCell();
        const cellOpciones = row.insertCell();

        cellServicio.textContent = item.servicio;
        cellEmpresa.textContent = item.empresa;
        cellPeriodo.textContent = item.periodo;
        cellMonto.textContent = item.monto;

        const eliminarBtn = document.createElement("button");
        eliminarBtn.textContent = "❌";
        eliminarBtn.addEventListener("click", () => {
            eliminarItem(index);
        });

        cellOpciones.appendChild(eliminarBtn);
    });
};

// Función para eliminar un item del carrito
const eliminarItem = (index) => {
    //Guardo el objeto eliminado del carrito en una variable, para luego acceder al "servicio", para el mensaje alerta de Tostify
    const itemEliminado = carrito.splice(index, 1)[0];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    Toastify({
        text: `Servicio de ${itemEliminado.servicio} eliminado`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "linear-gradient(to right, #FF0000, #FF2100)" },
    }).showToast();
};

// Agrego un listener al botón de agregar item
const agregarBtn = document.getElementById("agregar-btn");

document.addEventListener("DOMContentLoaded", () => {
    const agregarBtn = document.getElementById("agregar");
    agregarBtn.addEventListener("click", agregarItem);
});

// Mostramos el carrito inicialmente
mostrarCarrito();

console.log(carrito);


// realizo la funcion de pago

const realizarPago = () => {
    // Calculamos el total del carrito
    const total = carrito.reduce((suma, item) => suma + item.monto, 0);

    // Verificamos si el saldo es suficiente para realizar el pago
    if (saldo < total) {
        swal("Error", "Saldo insuficiente", "warning");
        return;
    }

    // Se descuenta el total del saldo y actualizamos el elemento en el DOM
    saldo -= total;
    saldoElement.textContent = `Saldo: $${saldo}`;

    // Se muestra un mensaje de éxito y limpiamos el carrito
    swal("Éxito", "Pago realizado con éxito", "success");
    carrito = [];
    localStorage.removeItem("carrito");
    mostrarCarrito();
};

// llamo al boton de pago para luego realizar el evento click
const botonPagar = document.getElementById("pagar");

botonPagar.addEventListener("click", () => {
    realizarPago();
});

localStorage.setItem("carrito", JSON.stringify(carrito));

