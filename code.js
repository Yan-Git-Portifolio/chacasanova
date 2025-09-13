document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('housewarming-form');
    const confirmation = document.getElementById('confirmation');
    const outrosCheckbox = document.getElementById('item-outros');
    const outrosInput = document.getElementById('outros-especificar');
    const peopleSelect = document.getElementById('people');
    const peopleNamesDiv = document.getElementById('people-names');
    const API_URL = 'https://chacasanovaback-production.up.railway.app'; // REMOVI A BARRA FINAL

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
        
        // Desativar botão para evitar múltiplos cliques
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        try {
            // Validar se pelo menos um item foi selecionado
            const checkboxes = document.querySelectorAll('input[name="items"]:checked');
            if (checkboxes.length === 0) {
                throw new Error('Por favor, selecione pelo menos um item que gostaria de levar.');
            }
            
            // Validar se selecionou uma bebida
            const bebidasSelect = document.getElementById('bebidas');
            if (!bebidasSelect.value) {
                throw new Error('Por favor, selecione qual bebida irá trazer.');
            }
            
            // Validar número de pessoas
            if (!peopleSelect.value) {
                throw new Error('Por favor, selecione quantas pessoas comparecerão.');
            }
            
            // Validar nomes das pessoas se necessário
            const peopleValue = parseInt(peopleSelect.value);
            if (peopleValue > 1) {
                const peopleInputs = document.querySelectorAll('#people-names input');
                const emptyNames = Array.from(peopleInputs).filter(input => !input.value.trim());
                
                if (emptyNames.length > 0) {
                    throw new Error('Por favor, preencha os nomes de todas as pessoas que comparecerão.');
                }
            }
            
            // Coletar dados do formulário - AQUI ESTAVA O ERRO!
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
            
            console.log('Enviando dados:', formData);
            
            // Enviar dados para o backend - CORRIGIDO!
            const response = await fetch(`${API_URL}/enviar-confirmacao`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData) // AGORA formData ESTÁ DEFINIDO!
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || `Erro ${response.status}: ${response.statusText}`);
            }
            
            if (result.success) {
                // Mostrar confirmação na página
                form.classList.add('hidden');
                confirmation.classList.remove('hidden');
                
                // Rolando para a confirmação
                confirmation.scrollIntoView({ behavior: 'smooth' });
            } else {
                throw new Error(result.message || 'Erro ao enviar confirmação');
            }
            
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro: ' + error.message);
        } finally {
            // Reativar botão
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Confirmação';
        }
    });
});