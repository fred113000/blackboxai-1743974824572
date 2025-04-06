document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des marques de voiture
    const carBrands = ['Peugeot', 'Renault', 'Citroën', 'Volkswagen', 'BMW', 'Audi', 'Mercedes'];
    const brandSelect = document.getElementById('carBrand');
    
    if (brandSelect) {
        brandSelect.innerHTML = '<option value="">Sélectionnez une marque</option>';
        carBrands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });
    }

    // Gestion de la soumission du formulaire
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Vérification des champs obligatoires
            const requiredFields = {
                'carBrand': 'Marque de voiture',
                'carModel': 'Modèle de voiture', 
                'bookingDate': 'Date et heure'
            };

            let missingFields = [];
            for (const [fieldId, fieldName] of Object.entries(requiredFields)) {
                const field = document.getElementById(fieldId);
                if (!field.value) {
                    field.classList.add('border-red-500');
                    missingFields.push(fieldName);
                } else {
                    field.classList.remove('border-red-500');
                }
            }

            // Vérification de la prestation sélectionnée
            const selectedService = document.querySelector('input[name="service"]:checked');
            if (!selectedService) {
                missingFields.push('Prestation');
            }

            if (missingFields.length > 0) {
                alert(`Veuillez remplir les champs obligatoires : ${missingFields.join(', ')}`);
                return;
            }

            // Préparation des données
            const bookingData = {
                garageId: new URLSearchParams(window.location.search).get('garageId'),
                clientName: document.getElementById('clientName')?.value || 'Non renseigné',
                carBrand: document.getElementById('carBrand').value,
                carModel: document.getElementById('carModel').value,
                service: selectedService.value,
                date: document.getElementById('bookingDate').value,
                status: 'confirmée',
                createdAt: new Date().toISOString()
            };

            // Sauvegarde
            let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            bookings.push(bookingData);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            // Redirection
            window.location.href = `booking-confirmation.html?id=${bookings.length - 1}`;
        });
    }
});