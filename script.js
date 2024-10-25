
const diaSemana = document.getElementById("dia-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("hora-atual");
const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");
const linkJustificativa = document.getElementById("link-justificativa");
const dialogJustificativa = document.getElementById("dialog-justificativa");
const btnSalvarJustificativa = document.getElementById("btn-salvar-justificativa");

btnRegistrarPonto.addEventListener("click", register);

diaSemana.textContent = getWeekDay();
dataAtual.textContent = getCurrentDate();

const dialogPonto = document.getElementById("dialog-ponto");

const dialogData = document.getElementById("dialog-data");
dialogData.textContent = "Data: " + getCurrentDate();

const dialogHora = document.getElementById("dialog-hora");

const selectRegisterType = document.getElementById("register-type");

linkJustificativa.addEventListener("click", () => {
    dialogJustificativa.showModal();
});

btnSalvarJustificativa.addEventListener("click", () => {
    const justificativaTexto = document.getElementById("justificativa-texto").value;
    const justificativaArquivo = document.getElementById("justificativa-arquivo").files[0];

    // Verifique se há um arquivo selecionado e se o campo de texto foi preenchido
    if (!justificativaTexto) {
        alert("Preencha a justificativa");
        return;
    }

    // Salvar no localStorage (requer algum tipo de identificação para a justificativa)
    const justificativa = {
        texto: justificativaTexto,
        data: getCurrentDate(),
        hora: getCurrentTime()
    };

    // Armazena a justificativa (sem o arquivo) no localStorage
    localStorage.setItem("justificativaAusencia", JSON.stringify(justificativa));

    // Armazena o arquivo no localStorage ou exiba uma mensagem de sucesso
    const reader = new FileReader();
    reader.onload = function (event) {
        localStorage.setItem("justificativaArquivo", event.target.result);
        alert("Justificativa e arquivo salvos com sucesso!");
    };
    reader.readAsDataURL(justificativaArquivo);

    // Fecha o dialog
    dialogJustificativa.close();
});


function setRegisterType() {
    let lastType = localStorage.getItem("lastRegisterType");
    if(lastType == "entrada") {
        selectRegisterType.value = "intervalo";
        return;
    }
    if(lastType == "intervalo") {

    }
    if(lastType == "volta-intervalo") {
        
    }
    if(lastType == "saida") {
    
    }
}



const btnDialogRegister = document.getElementById("btn-dialog-register");
btnDialogRegister.addEventListener("click", async () => {

    let register = await getObjectRegister(selectRegisterType.value);
    saveRegisterLocalStorage(register);
    
    localStorage.setItem("lastRegister", JSON.stringify(register));

    const alertaSucesso = document.getElementById("alerta-ponto-registrado");
    alertaSucesso.classList.remove("hidden");
    alertaSucesso.classList.add("show");

    setTimeout(() => {
        alertaSucesso.classList.remove("show");
        alertaSucesso.classList.add("hidden");
    }, 5000);

    dialogPonto.close();
});


async function getObjectRegister(registerType) {    

    const location = await getUserLocation();

    console.log(location);

    ponto = {
        "date": getCurrentDate(),
        "time": getCurrentTime(),
        "location": location,
        "id": 1,
        "type": registerType
    }
    return ponto;
}

const btnDialogFechar = document.getElementById("dialog-fechar");
btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();
})


let registersLocalStorage = getRegisterLocalStorage("register");


function saveRegisterLocalStorage(register) {
    registersLocalStorage.push(register);
    localStorage.setItem("register", JSON.stringify(registersLocalStorage));
}

function getRegisterLocalStorage(key) {

    let registers = localStorage.getItem(key);

    if(!registers) {
        return [];
    }

    return JSON.parse(registers);
}

 
function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            let userLocation = {
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude
            }
            resolve(userLocation);
        }, 
        (error) => {
            reject("Erro " + error);
        });
    });
}


function register() {

    const dialogUltimoRegistro = document.getElementById("dialog-ultimo-registro");
    let lastRegister = JSON.parse(localStorage.getItem("lastRegister"));

    if(lastRegister) {
        let lastDateRegister = lastRegister.date;
        let lastTimeRegister = lastRegister.time;
        let lastRegisterType = lastRegister.type;

        dialogUltimoRegistro.textContent = "Último Registro: " + lastDateRegister + " | " + lastTimeRegister + " | " + lastRegisterType;
    }

    dialogHora.textContent = "Hora: " + getCurrentTime();

    let interval = setInterval(() => {
        dialogHora.textContent = "Hora: " + getCurrentTime();
    }, 1000);

    console.log(interval);


    dialogPonto.showModal();
}


function updateContentHour() {
    horaAtual.textContent = getCurrentTime();
}


function getCurrentTime() {
    const date = new Date();
    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}


function getCurrentDate() {
    const date = new Date(); 
    let mes = date.getMonth() + 1;
    return String(date.getDate()).padStart(2, '0') + "/" + String(mes).padStart(2, '0') + "/" +  String(date.getFullYear()).padStart(2, '0');
}

function getWeekDay() {
    const date = new Date()
    const day = date.getDay()
    const daynames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return daynames[day]
}

updateContentHour();
setInterval(updateContentHour, 1000);

console.log(getCurrentTime());
console.log(getCurrentDate());
console.log(getWeekDay());