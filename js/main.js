// CREO MIS VARIABLES

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const user = {};
let username;
let balance;



// OBJETOS - Servicios

const services = [
    {
        id: 2,
        nombre: "Luz",
        empresa: "Epec",
        precio: 1,
        cantidad: 0,
    },
    {
        id: 1,
        nombre: "Agua",
        empresa: "AguaCba",
        precio: 1,
        cantidad: 0,
    },
    {
        id: 4,
        nombre: "Internet",
        empresa: "Fibertel",
        precio: 1,
        cantidad: 0,
    },
    {
        id: 3,
        nombre: "Gas",
        empresa: "EcoGas",
        precio: 1,
        cantidad: 0,
    },
];

// EVENTOS DE LOS BOTONES

document.addEventListener("DOMContentLoaded", () => {
    const btnUser = document.querySelector(".btnUser");
    btnUser.addEventListener("click", () => {
    createUser();
    });

    const btnBalance = document.querySelector(".btnBalance");
    btnBalance.addEventListener("click", () => {
        addBalance();
        renderCart();
        // Constate para darle añadirle una clase al div contenedor del carrito para asignarle un background
        const shoppingCart = document.querySelector("#idShoppingCart");
        shoppingCart.classList.add("shoppingCart");
    });

    const btnService = document.querySelector(".btnService");
    btnService.addEventListener("click", () => {
        addToCart();
    });

    const btnPay = document.querySelector("#payButton");
    btnPay.addEventListener("click",  () => {
        pay();
    });
});


// FUNCIONES

// funcion para crear usuario
const createUser = () => {
    user.username = document.querySelector("#username").value;
    user.balance = 0;

    document.querySelector("#balanceForm").style.display = "block";
    document.querySelector("#greeting").textContent = user.username;
    document.querySelector("#username").parentElement.style.display = "none";
};

// funcion para cargar saldo a la cuenta
const addBalance = () => {
    user.balance += parseFloat(document.querySelector("#balance").value);

    document.querySelector("#updatedBalance").style.display = "block";
    saldo();

    document.querySelector("#servicesForm").style.display = "block";
    document.querySelector("#cartTitle").style.display = "block";

    
};

// funcion para saldo actualizado
const saldo = () => {
    document.querySelector(
        "#updatedBalance"
    ).textContent = `${user.username}, tu saldo actual es $${user.balance}.`;
    updatedBalance.style.backgroundColor = "#3DFA73";
};

// Funcion para crear la lista de servicios que puedo abonar
const serviceList = services.forEach((service) => {
    // Creo la lista de servicios disponibles para pagar con dos variables Const
    const serviceInput = document.createElement("input");
    serviceInput.type = "radio";
    serviceInput.name = "service";
    serviceInput.value = service.nombre;
    document.querySelector("#serviceFormList").appendChild(serviceInput);

    const companyServices = document.createElement("label");
    companyServices.textContent = `${service.nombre} (${service.empresa})`;
    document.querySelector("#serviceFormList").appendChild(companyServices);
    // Creo una etiqueta br para que me haga un salto de linea
    const br = document.createElement("br");
    document.querySelector("#serviceFormList").appendChild(br);
});


// funcion para servicio añadido, o erroneo
const serviceMessage = (display, color, message) => {
    document.querySelector("#serviceMessage").style.display = display;
    document.querySelector("#serviceMessage").style.color = color;
    document.querySelector("#serviceMessage").textContent = message;
};












// funcion para mensaje de pago realizado o fallido
const showMessage = (display, color, message) => {
    document.querySelector("#finalMessage").style.display = display;
    document.querySelector("#finalMessage").style.color = color;
    document.querySelector("#finalMessage").textContent = message;
};


// funcion para añadir servicios al carrito
const addToCart = () => {
    const serviceSelected = Array.from(
        document.querySelectorAll('input[name="service"]')
    ).find((input) => input.checked);
    const service = serviceSelected ? serviceSelected.value : null;
    const amount = parseFloat(document.querySelector("#amount").value);

    if (!service || isNaN(amount)) {
        // Mensaje de alerta, por no ser una cantidad valida
        serviceMessage(
            "block",
            "red",
            "Por favor selecciona un servicio y una cantidad válida."
        );
        setTimeout(function () {
            document.querySelector("#serviceMessage").style.display = "none";
        }, 3000);
        return;
    }

    // si el servicio, ya fue cargado, se actualiza el precio.
    const existingServiceIndex = cart.findIndex(
        (item) => item.service === service
    );
    if (existingServiceIndex >= 0) {
        cart[existingServiceIndex].amount = amount;
    } else {
        cart.push({ service, amount });
    }

    // Mensaje de Servicio añadido
    serviceMessage(
    "block",
    "green",
    `${user.username}, el servicio ${service} ha sido agregado a tu carrito por $${amount}.`
    );
    setTimeout(function () {
    document.querySelector("#serviceMessage").style.display = "none";
    }, 3000);


    renderCart();
    
    saveLocal();
};

// funcion para manipular el carrito de servicios, y poder pagar
const renderCart = () => {
    const cartList = document.querySelector("#cart");
    cartList.innerHTML = "";

    for (const item of cart) {
        const itemNode = document.createElement("li");
        itemNode.textContent = `Servicio: ${item.service} - $${item.amount}`;

        const removeButton = document.createElement("button");
        removeButton.textContent = "❌";
        removeButton.onclick = () => {
            const index = cart.indexOf(item);
            cart.splice(index, 1);

            renderCart();
            saveLocal();
        };

        itemNode.appendChild(removeButton);
        cartList.appendChild(itemNode);
    }

    document.querySelector("#payButton").style.display =
        cart.length > 0 ? "block" : "none";
};


// funcion de pago
const pay = () => {
    const total = cart.reduce((acc, item) => acc + item.amount, 0);

    if (total > user.balance) {
        showMessage(
            "block",
            "red",
            `${user.username}, Saldo insuficiente. Tu saldo actual es de $${user.balance}.`
        );
        setTimeout(function () {
            document.querySelector("#finalMessage").style.display = "none";
        }, 3000);
        return;
    }

    user.balance -= total;
    cart.splice(0, cart.length);

    showMessage(
        "block",
        "green",
        `${user.username}, la transacción ha sido realizada con éxito. Tu saldo actual es de $${user.balance}.`
    );
    saldo();
};


// LOCAL STORAGE

// Guardar datos
const saveLocal = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
}




