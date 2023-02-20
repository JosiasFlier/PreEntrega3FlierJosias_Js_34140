class Usuario {
    constructor(nombre, apellido, dni) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.saldo = 0;
    }
    ingresarDinero(cantidad) {
        this.saldo += cantidad;
    }
}

// Creo las variables que voy a utilizar para darle eventos a los botones
const crearUsuarioForm = document.querySelector("#crearUsuario");
const ingresarDineroForm = document.querySelector("#ingresarDinero");
const cargarDatosBtn = document.querySelector("#cargarDatos");
const ingresarDineroBtn = document.querySelector("#depositarBtn");

// Creo la variable para insertarle un breve mensaje de saludo, e indicarle que deposite dinero en su cuenta
const saludoP = document.getElementById('saludo');

let usuario;

// Evento del boton "Cargar Datos"
cargarDatosBtn.addEventListener("click", () => {
    const nombre = document.querySelector("#nombre").value;
    const apellido = document.querySelector("#apellido").value;
    const dni = document.querySelector("#dni").value;
    usuario = new Usuario(nombre, apellido, dni);

    // Guardo los datos del usuario en el almacenamiento local para luego obtenerlos en el panel de servicios
    const usuarioData = JSON.stringify(usuario);
    window.localStorage.setItem('usuario', usuarioData);

    // Ejecuto el pequeño mensaje para que salga en el formulario de deposito.
    const saludo = `Hola ${usuario.nombre} ${usuario.apellido}`;
    saludoP.textContent = saludo;

    // Oculto el primer formulario (Datos del usuario), Habilito el segundo formulario (Ingresar Dinero) que estaba bloqueado
    crearUsuarioForm.style.display = "none";
    ingresarDineroForm.style.display = "block";
});


// Creo una constante y una funcion, para darle un estilo al Background del formulario, depende la tarjeta que se elija.
const tarjetaSelect = document.querySelector("#tarjeta");

tarjetaSelect.addEventListener("change", () => {
    const tarjeta = tarjetaSelect.value;

    switch (tarjeta) {
        case "macro":
            ingresarDineroForm.style.backgroundColor = "#01B8D7";
            ingresarDineroForm.style.border = "2px solid #1C2E51";
            break;
        case "santander":
            ingresarDineroForm.style.backgroundColor = "#F2F2F2";
            ingresarDineroForm.style.border = "2px solid #EC0000";
            break;
        case "naranja":
            ingresarDineroForm.style.backgroundColor = "#FE5800";
            ingresarDineroForm.style.border = "2px solid #50007F";
            break;
        case "mercadoPago":
            ingresarDineroForm.style.backgroundColor = "#009EE3";
            ingresarDineroForm.style.border = "2px solid #0A0080";  
            break;
        default:
            ingresarDineroForm.style.backgroundColor = "";
    }
});


// Evento del boton Depositar
ingresarDineroBtn.addEventListener("click", () => {
    const cantidad = parseInt(document.querySelector("#cantidad").value);
    usuario.ingresarDinero(cantidad);

    // Guardo los datos del usuario actualizados en el almacenamiento local
    const usuarioData = JSON.stringify(usuario);
    window.localStorage.setItem('usuario', usuarioData);

    // Muestro la ventana SweetAlert
    Swal.fire({
        title: `${usuario.nombre} ${usuario.apellido}`,
        text: `Se ha depositado $${cantidad} en su cuenta`,
        icon: "success",
        confirmButtonText: "Aceptar"
    }).then((result) => {
        // Redirecciono al usuario a otro HTML si hace clic en "Aceptar"
        if (result.isConfirmed) {
            window.location.href = "./../pages/servicios.html";
        }
    });
});









