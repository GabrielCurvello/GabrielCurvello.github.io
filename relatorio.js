document.addEventListener("DOMContentLoaded", () => {
    const tabelaRegistros = document.getElementById("tabela-registros").getElementsByTagName("tbody")[0];
    const dialogEditar = document.getElementById("dialog-editar");
    const btnSalvarEdicao = document.getElementById("btn-salvar-edicao");
    const editTipo = document.getElementById("edit-tipo");
    const editHora = document.getElementById("edit-hora");
    const filtroPeriodo = document.getElementById("filtro-periodo");

    let registros = JSON.parse(localStorage.getItem("register")) || [];
    let registroEmEdicao = null;

    // Função para filtrar registros
    function filtrarRegistros() {
        const hoje = new Date();
        const periodo = filtroPeriodo.value;

        let registrosFiltrados = registros.filter(registro => {
            const dataRegistro = new Date(registro.date.split('/').reverse().join('-')); // Formato DD/MM/YYYY

            if (periodo === "semana") {
                const umaSemanaAtras = new Date(hoje);
                umaSemanaAtras.setDate(hoje.getDate() - 7);
                return dataRegistro >= umaSemanaAtras && dataRegistro <= hoje;
            }
            
            if (periodo === "mes") {
                const umMesAtras = new Date(hoje);
                umMesAtras.setMonth(hoje.getMonth() - 1);
                return dataRegistro >= umMesAtras && dataRegistro <= hoje;
            }

            return true; // Caso "todos"
        });

        // Limpa a tabela e insere os registros filtrados
        tabelaRegistros.innerHTML = "";
        renderizarRegistros(registrosFiltrados);
    }

    // Função para renderizar os registros
    function renderizarRegistros(registrosParaRenderizar) {
        const registrosPorData = registrosParaRenderizar.reduce((acc, registro) => {
            if (!acc[registro.date]) {
                acc[registro.date] = [];
            }
            acc[registro.date].push(registro);
            return acc;
        }, {});

        for (const [data, registrosDoDia] of Object.entries(registrosPorData)) {
            const rowData = tabelaRegistros.insertRow();
            const cellData = rowData.insertCell(0);
            cellData.colSpan = 5;
            cellData.textContent = data;
            cellData.classList.add("data-header");

            registrosDoDia.forEach((registro, index) => {
                const row = tabelaRegistros.insertRow();
                row.insertCell(0).textContent = registro.date;
                row.insertCell(1).textContent = registro.time;
                row.insertCell(2).textContent = registro.type;
                row.insertCell(3).textContent = `${registro.location.latitude}, ${registro.location.longitude}`;

                // Botão de Edição
                const editCell = row.insertCell(4);
                const btnEdit = document.createElement("button");
                btnEdit.textContent = "Editar";
                btnEdit.onclick = () => abrirDialogEdicao(registro, index);
                editCell.appendChild(btnEdit);

                // Botão de Exclusão com Alerta
                const btnDelete = document.createElement("button");
                btnDelete.textContent = "Excluir";
                btnDelete.onclick = () => alert("Exclusão não permitida.");
                editCell.appendChild(btnDelete);

                if (registro.editado) {
                    row.classList.add("registro-editado");
                }
            });
        }
    }

    // Função para abrir o dialog de edição
    function abrirDialogEdicao(registro, index) {
        registroEmEdicao = { ...registro, index };
        editTipo.value = registro.type;
        editHora.value = registro.time;
        dialogEditar.showModal();
    }

    // Salva as alterações no registro
    btnSalvarEdicao.addEventListener("click", () => {
        if (registroEmEdicao !== null) {
            const index = registroEmEdicao.index;
            registros[index].type = editTipo.value;
            registros[index].time = editHora.value;
            registros[index].editado = true;

            localStorage.setItem("register", JSON.stringify(registros));
            window.location.reload();
        }
        dialogEditar.close();
    });

    // Adiciona evento para o filtro
    filtroPeriodo.addEventListener("change", filtrarRegistros);

    // Renderiza todos os registros inicialmente
    renderizarRegistros(registros);
});
