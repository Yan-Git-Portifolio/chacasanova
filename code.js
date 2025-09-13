
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('housewarming-form');
    const confirmation = document.getElementById('confirmation');
    const outrosCheckbox = document.getElementById('item-outros');
    const outrosInput = document.getElementById('outros-especificar');
    const peopleSelect = document.getElementById('people');
    const peopleNamesDiv = document.getElementById('people-names');
    const API_URL = 'https://cha-casa-nova-backend.onrender.com';

    // Mostrar campo "Outros" quando selecionado
    outrosCheckbox.addEventListener('change', function() {
        if(this.checked) {
            outrosInput.classList.remove('hidden');
            outrosInput.required = true;
        } else {
            outrosInput.classList.add('hidden');
            outrosInput.required = false;
            outrosInput.value = '';
        }
    });

    // Gerenciar nomes das pessoas
    peopleSelect.addEventListener('change', function() {
        peopleNamesDiv.innerHTML = '';
        let qtd = parseInt(this.value);
        if (isNaN(qtd) || qtd < 1) return;
        
        // Para "5 ou mais", mostra 5 campos e um aviso
        if (qtd === 5) {
            qtd = 5;
            const aviso = document.createElement('small');
            aviso.textContent = 'Se forem mais de 5, preencha os 5 campos com os nomes principais.';
            peopleNamesDiv.appendChild(aviso);
        }
        
        for (let i = 1; i <= qtd; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = `person_name_${i}`;
            input.placeholder = `Nome da pessoa ${i}`;
            input.required = true;
            input.style.marginTop = '8px';
            peopleNamesDiv.appendChild(input);
        }
    });

    // Processar envio do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar se pelo menos um item foi selecionado
        const checkboxes = document.querySelectorAll('input[name="items"]:checked');
        if (checkboxes.length === 0) {
            alert('Por favor, selecione pelo menos um item que gostaria de levar.');
            return;
        }
        
        // Validar se selecionou uma bebida
        const bebidasSelect = document.getElementById('bebidas');
        if (!bebidasSelect.value) {
            alert('Por favor, selecione qual bebida irá trazer.');
            return;
        }
        
        // Coletar dados do formulário
        const name = document.getElementById('name').value;
        const presence = document.querySelector('input[name="presence"]:checked').value;
        const items = Array.from(document.querySelectorAll('input[name="items"]:checked')).map(cb => cb.value);
        const bebidas = document.getElementById('bebidas').value;
        const people = document.getElementById('people').value;
        const allergy = document.getElementById('allergy').value;
        const message = document.getElementById('message').value;
        const outros = document.getElementById('outros-especificar').value;
        
        // Mapear valores para textos mais amigáveis
        const bebidaOptions = {
            '1': 'Refrigerante',
            '2': 'Suco',
            '3': 'Água'
        };
        
        const peopleOptions = {
            '1': 'Apenas eu',
            '2': '2 pessoas',
            '3': '3 pessoas',
            '4': '4 pessoas',
            '5': '5 ou mais pessoas'
        };
        
        // Preparar texto para WhatsApp
        let whatsappMessage = `*Confirmação de Presença - Chá de Casa Nova*%0A%0A`;
        whatsappMessage += `*Nome:* ${name}%0A`;
        whatsappMessage += `*Presença:* ${presence === 'sim' ? 'Sim, com certeza!' : 'Infelizmente não poderei'}%0A`;
        
        const peopleNames = Array.from(document.querySelectorAll('#people-names input')).map(input => input.value).filter(Boolean);

        if (presence === 'sim') {
            // Processar itens selecionados
            let selectedItems = [];
            items.forEach(item => {
                if (item === 'salgados') selectedItems.push('Salgados');
                if (item === 'doces') selectedItems.push('Doces');
                if (item === 'outros' && outros) selectedItems.push(`Outros: ${outros}`);
            });
            
            whatsappMessage += `*Itens para levar:* ${selectedItems.join(', ') || 'Nenhum selecionado'}%0A`;
            whatsappMessage += `*Bebida:* ${bebidaOptions[bebidas] || bebidas}%0A`;
            whatsappMessage += `*Número de pessoas:* ${peopleOptions[people] || people}%0A`;
            whatsappMessage += `*Nomes dos presentes:* ${peopleNames.join(', ')}%0A`;
            
            if (allergy) {
                whatsappMessage += `*Alergia/Restrição:* ${allergy}%0A`;
            }
        }
        
        if (message) {
            whatsappMessage += `*Mensagem:* ${message}%0A`;
        }
        
        // Substitua pelo seu número de WhatsApp (apenas números, com código do país)
        const phoneNumber = "5519974187301"; // Exemplo: 55 (Brasil) + 11 (DDD) + 999999999 (número)
        
        // Criar link do WhatsApp
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
        
        // Abrir WhatsApp em uma nova janela
        window.open(whatsappURL, '_blank');
        
        // Mostrar confirmação na página
        form.classList.add('hidden');
        confirmation.classList.remove('hidden');
        
        // Rolando para a confirmação
        confirmation.scrollIntoView({ behavior: 'smooth' });
    });
});