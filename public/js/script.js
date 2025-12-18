/* --- BANCO DE DADOS DOS PRODUTOS --- */
const CATALOGO = {
    tamanho: [
        { id: '1kg', nome: '1 kg (Pequeno)', desc: '10-12 fatias', preco: 80 },
        { id: '2kg', nome: '2 kg (Médio)', desc: '20-25 fatias', preco: 150 },
        { id: '3kg', nome: '3 kg (Grande)', desc: '30-35 fatias', preco: 220 },
        { id: '4kg', nome: '4 kg (Festa)', desc: '40-45 fatias', preco: 290 }
    ],
    massa: [
        { id: 'baunilha', nome: 'Baunilha', desc: 'Clássica e suave', preco: 0 },
        { id: 'chocolate', nome: 'Chocolate 50%', desc: 'Massa úmida de cacau', preco: 10 },
        { id: 'redvelvet', nome: 'Red Velvet', desc: 'Vermelho sofisticado', preco: 20 },
        { id: 'nozes', nome: 'Nozes', desc: 'Crocante e saborosa', preco: 25 }
    ],
    recheio: [
        { id: 'brigadeiro', nome: 'Brigadeiro Gourmet', desc: 'Cremoso e delicioso', preco: 0 },
        { id: 'ninho', nome: 'Ninho com Morango', desc: 'Suave e refrescante', preco: 15 },
        { id: 'doceleite', nome: 'Doce de Leite', desc: 'Doçura equilibrada', preco: 20 },
        { id: 'pistache', nome: 'Pistache Premium', desc: 'Sofisticado', preco: 35 },
        { id: 'nutella', nome: 'Ninho com Nutella', desc: 'O queridinho', preco: 25 }
    ],
    cobertura: [
        { id: 'chantininho', nome: 'Chantininho', desc: 'Leve e delicado', preco: 0 },
        { id: 'ganache', nome: 'Ganache', desc: 'Chocolate intenso', preco: 20 },
        { id: 'pasta', nome: 'Pasta Americana', desc: 'Decoração artística', preco: 40 },
        { id: 'naked', nome: 'Naked Cake', desc: 'Rústico (Sem cobertura)', preco: 10 }
    ],
    adicionais: [
        { id: 'topo', nome: 'Topo Personalizado', desc: 'Com nome e idade', icon: 'bi-star-fill', preco: 25 },
        { id: 'glitter', nome: 'Glitter Comestível', desc: 'Brilho dourado/prata', icon: 'bi-magic', preco: 15 },
        { id: 'vela', nome: 'Vela Musical', desc: 'Com música', icon: 'bi-fire', preco: 18 },
        { id: 'frutas', nome: 'Frutas Frescas', desc: 'Morangos/Uvas', icon: 'bi-flower1', preco: 30 }
    ]
};

// Estado do Pedido
let pedido = {
    tamanho: null,
    massa: null,
    recheio: null,
    cobertura: null,
    adicionais: [],
    data: null
};

/* --- RENDERIZAÇÃO --- */
function renderizarCatalogo() {
    ['tamanho', 'massa', 'recheio', 'cobertura'].forEach(categoria => {
        const container = document.getElementById(`container-${categoria}`);
        if (!container) return;
        container.innerHTML = ''; 

        CATALOGO[categoria].forEach(item => {
            const precoTexto = item.preco === 0 ? 
                '<span class="badge bg-success bg-opacity-10 text-success">Incluso</span>' : 
                `<span class="price-tag">+ R$ ${item.preco},00</span>`;
            const precoFinal = categoria === 'tamanho' ? `<span class="price-tag">R$ ${item.preco},00</span>` : precoTexto;

            const html = `
                <div class="col-md-6">
                    <div class="option-card" onclick="selectItem('${categoria}', '${item.id}', this)">
                        <h5 class="fw-bold mb-1">${item.nome}</h5>
                        <p class="text-muted small mb-2">${item.desc}</p>
                        ${precoFinal}
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });
    });

    // Adicionais
    const containerAdd = document.getElementById('container-adicionais');
    if (containerAdd) {
        containerAdd.innerHTML = '';
        CATALOGO.adicionais.forEach(item => {
            const html = `
                <div class="col-md-6">
                    <div class="option-card" onclick="toggleAddon('${item.id}', this)">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <i class="bi ${item.icon} fs-4 text-primary mb-2 d-block"></i>
                                <h5 class="fw-bold mb-0">${item.nome}</h5>
                                <p class="text-muted small mb-0">${item.desc}</p>
                            </div>
                            <i class="bi bi-plus-circle text-muted check-icon fs-4"></i>
                        </div>
                        <span class="price-tag d-block mt-2">+ R$ ${item.preco},00</span>
                    </div>
                </div>
            `;
            containerAdd.innerHTML += html;
        });
    }
    ativarAnimacoes();
}

/* --- SELEÇÃO --- */
function selectItem(categoria, id, elemento) {
    const item = CATALOGO[categoria].find(i => i.id === id);
    pedido[categoria] = item;

    // Visual
    const container = document.getElementById(`container-${categoria}`);
    container.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    elemento.classList.add('selected');

    // Remove estado de erro se existir
    container.parentElement.classList.remove('error-shake');
    const title = container.parentElement.querySelector('h3');
    if(title) title.classList.remove('error-shake-title');

    // Resumo
    document.getElementById(`res-${categoria}`).innerText = item.nome;
    document.getElementById(`res-${categoria}`).classList.add('text-primary');

    calcularTotal();
}

function toggleAddon(id, elemento) {
    const item = CATALOGO.adicionais.find(i => i.id === id);
    const index = pedido.adicionais.findIndex(x => x.id === id);
    const icon = elemento.querySelector('.check-icon');

    if (index > -1) {
        pedido.adicionais.splice(index, 1);
        elemento.classList.remove('selected');
        icon.className = 'bi bi-plus-circle text-muted check-icon fs-4';
    } else {
        pedido.adicionais.push(item);
        elemento.classList.add('selected');
        icon.className = 'bi bi-check-circle-fill text-success check-icon fs-4';
    }
    
    atualizarListaAdicionais();
    calcularTotal();
}

function calcularTotal() {
    let total = 0;
    if(pedido.tamanho) total += pedido.tamanho.preco;
    if(pedido.massa) total += pedido.massa.preco;
    if(pedido.recheio) total += pedido.recheio.preco;
    if(pedido.cobertura) total += pedido.cobertura.preco;
    
    pedido.adicionais.forEach(add => total += add.preco);

    const totalEl = document.getElementById('total-price');
    totalEl.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    totalEl.style.transform = "scale(1.1)";
    setTimeout(() => totalEl.style.transform = "scale(1)", 200);
}

function atualizarListaAdicionais() {
    const lista = document.getElementById('res-adicionais-list');
    const container = document.getElementById('res-adicionais-container');
    lista.innerHTML = '';
    if (pedido.adicionais.length > 0) {
        container.classList.remove('d-none');
        pedido.adicionais.forEach(add => {
            lista.innerHTML += `<li>+ ${add.nome}</li>`;
        });
    } else {
        container.classList.add('d-none');
    }
}

/* --- VALIDAÇÃO E ENVIO --- */

// Função Toast (Pop-up)
function showToast(mensagem, isError = false) {
    const toast = document.getElementById('toast-box');
    // Adiciona ícone
    const icon = isError ? '<i class="bi bi-exclamation-circle-fill"></i>' : '<i class="bi bi-check-circle-fill"></i>';
    toast.innerHTML = `${icon} ${mensagem}`;
    
    if (isError) {
        toast.classList.add('error');
    } else {
        toast.classList.remove('error');
    }

    toast.classList.add('show');
    
    // Some depois de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function sendToWhatsApp() {
    // 1. Array de campos obrigatórios (Incluí Massa também pois faz sentido para o produto)
    const obrigatorios = [
        { campo: 'tamanho', nome: 'Tamanho' },
        { campo: 'massa', nome: 'Massa' },
        { campo: 'recheio', nome: 'Recheio' },
        { campo: 'cobertura', nome: 'Cobertura' }
    ];

    // 2. Verifica um por um
    for (let item of obrigatorios) {
        if (!pedido[item.campo]) {
            showToast(`Por favor, selecione: ${item.nome}`, true);
            
            // Adiciona efeito visual de erro
            const container = document.getElementById(`container-${item.campo}`);
            const section = container.closest('section'); // Pega a section pai
            const title = section.querySelector('h3');

            section.classList.add('error-shake');
            if(title) title.classList.add('error-shake-title');
            
            // Rola até o erro
            section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return; // Para a função aqui
        }
    }

    // 3. Verifica Data
    if (!pedido.data) {
        showToast("Selecione uma data para entrega!", true);
        const dateInput = document.getElementById('data-entrega');
        dateInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        dateInput.focus(); // Foca no input
        return;
    }

    // 4. Tudo certo! Envia
    const tel = "5511999999999"; 
    let msg = `*OLÁ! CONSULTA DE DISPONIBILIDADE* 🎂%0A%0A`;
    msg += `Gostaria de saber se vocês têm agenda para:%0A%0A`;
    msg += `*Tamanho:* ${pedido.tamanho.nome}%0A`;
    msg += `*Massa:* ${pedido.massa.nome}%0A`;
    msg += `*Recheio:* ${pedido.recheio.nome}%0A`;
    msg += `*Cobertura:* ${pedido.cobertura.nome}%0A`;
    if(pedido.adicionais.length > 0) {
        msg += `*Adicionais:* ${pedido.adicionais.map(a => a.nome).join(', ')}%0A`;
    }
    msg += `%0A*Data Pretendida:* ${pedido.data}%0A`;
    msg += `*Valor Estimado:* ${document.getElementById('total-price').innerText}%0A`;
    msg += `%0A_Aguardo retorno!_`;

    window.open(`https://api.whatsapp.com/send?phone=${tel}&text=${msg}`, '_blank');
}

// Configuração de Datas
function updateDate() {
    const input = document.getElementById('data-entrega').value;
    if(input) {
        const dataObj = new Date(input + 'T00:00:00'); 
        const dataFormatada = dataObj.toLocaleDateString('pt-BR');
        pedido.data = dataFormatada;
        document.getElementById('res-data').innerText = dataFormatada;
    }
}

function configurarCalendario() {
    const hoje = new Date();
    hoje.setDate(hoje.getDate() + 3);
    const yyyy = hoje.getFullYear();
    const mm = String(hoje.getMonth() + 1).padStart(2, '0');
    const dd = String(hoje.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;
    
    const inputData = document.getElementById("data-entrega");
    if(inputData) inputData.setAttribute("min", minDate);
}

function ativarAnimacoes() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo();
    configurarCalendario();
});