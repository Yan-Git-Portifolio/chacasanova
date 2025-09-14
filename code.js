document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('housewarming-form');
    const confirmation = document.getElementById('confirmation');
    const outrosCheckbox = document.getElementById('item-outros');
    const outrosInput = document.getElementById('outros-especificar');
    const peopleSelect = document.getElementById('people');
    const peopleNamesDiv = document.getElementById('people-names');
    const API_URL = 'https://chacasanovaback-production.up.railway.app';

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
<<<<<<< HEAD

    // Gerenciar nomes das pessoas
    peopleSelect.addEventListener('change', function() {
        peopleNamesDiv.innerHTML = '';
        let qtd = parseInt(this.value);
        if (isNaN(qtd) || qtd < 1) return;
        
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

=======
    
>>>>>>> parent of 243b1de (nome dos convidados)
    // Processar envio do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
<<<<<<< HEAD
        try {
            // Validações
            const checkboxes = document.querySelectorAll('input[name="items"]:checked');
            if (checkboxes.length === 0) {
                throw new Error('Por favor, selecione pelo menos um item que gostaria de levar.');
            }
            
            const bebidasSelect = document.getElementById('bebidas');
            if (!bebidasSelect.value) {
                throw new Error('Por favor, selecione qual bebida irá trazer.');
            }
            
            if (!peopleSelect.value) {
                throw new Error('Por favor, selecione quantas pessoas comparecerão.');
            }
            
            // Validar nomes se tiver mais de 1 pessoa
            const peopleValue = parseInt(peopleSelect.value);
            if (peopleValue > 1) {
                const peopleInputs = document.querySelectorAll('#people-names input');
                const emptyNames = Array.from(peopleInputs).filter(input => !input.value.trim());
                
                if (emptyNames.length > 0) {
                    throw new Error('Por favor, preencha os nomes de todas as pessoas.');
                }
            }
            
            // Coletar dados CORRETAMENTE
            const formData = {
                name: document.getElementById('name').value.trim(),
                presence: document.querySelector('input[name="presence"]:checked').value,
                items: Array.from(document.querySelectorAll('input[name="items"]:checked')).map(cb => cb.value),
                bebidas: document.getElementById('bebidas').value,
                people: document.getElementById('people').value,
                allergy: document.getElementById('allergy').value.trim(),
                message: document.getElementById('message').value.trim(),
                outros: document.getElementById('outros-especificar').value.trim(),
                peopleNames: Array.from(document.querySelectorAll('#people-names input')).map(input => input.value.trim()).filter(Boolean)
            };
            
            console.log('📤 Enviando dados:', formData);
            
            // Enviar para backend - CORRIGIDO!
            const response = await fetch(`${API_URL}/enviar-confirmacao`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            // Verificar se a resposta é JSON válido
            const text = await response.text();
            let result;
=======
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
>>>>>>> parent of 243b1de (nome dos convidados)
            
            try {
                result = JSON.parse(text);
            } catch (parseError) {
                console.error('Resposta não é JSON:', text);
                throw new Error('Resposta inválida do servidor');
            }
            
            if (!response.ok) {
                throw new Error(result.message || `Erro ${response.status}`);
            }
            
            if (result.success) {
                // Sucesso!
                form.classList.add('hidden');
                confirmation.classList.remove('hidden');
                confirmation.scrollIntoView({ behavior: 'smooth' });
                
                // Opcional: Limpar formulário após sucesso
                form.reset();
                peopleNamesDiv.innerHTML = '';
                
            } else {
                throw new Error(result.message || 'Erro ao enviar confirmação');
            }
            
        } catch (error) {
            console.error('❌ Erro completo:', error);
            alert('Erro: ' + error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Confirmação';
        }
    });
});