document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('housewarming-form');
    const confirmation = document.getElementById('confirmation');
    const outrosCheckbox = document.getElementById('item-outros');
    const outrosInput = document.getElementById('outros-especificar');
    const peopleSelect = document.getElementById('people');
    const peopleNamesDiv = document.getElementById('people-names');
    const API_URL = 'https://chacasanovaback-production.up.railway.app/';

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
        const peopleNames = Array.from(document.querySelectorAll('#people-names input')).map(input => input.value).filter(Boolean);
        
        try {
            // Enviar dados para o backend
            const response = await fetch(`${API_URL}/enviar-confirmacao`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Mostrar confirmação na página
                form.classList.add('hidden');
                confirmation.classList.remove('hidden');
                
                // Rolando para a confirmação
                confirmation.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Erro ao enviar confirmação: ' + result.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar confirmação. Verifique se o servidor está rodando e tente novamente.');
        }
    });
});