
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('housewarming-form');
    const confirmation = document.getElementById('confirmation');
    const outrosCheckbox = document.getElementById('item-outros');
    const outrosInput = document.getElementById('outros-especificar');
    
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
    
    // Processar envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar se pelo menos um item foi selecionado
        const checkboxes = document.querySelectorAll('input[name="items"]:checked');
        if (checkboxes.length === 0) {
            alert('Por favor, selecione pelo menos um item que gostaria de levar.');
            return;
        }
        
        // Aqui você normalmente enviaria os dados para um servidor
        // Por enquanto, vou só deixar assim mesmo kkkkk 
        form.classList.add('hidden');
        confirmation.classList.remove('hidden');
        
        // Rolando para a confirmação
        confirmation.scrollIntoView({ behavior: 'smooth' });
    });
});