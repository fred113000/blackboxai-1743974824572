// Gestion du formulaire de réservation
document.getElementById('bookingForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const bookingData = {
        garageId: new URLSearchParams(window.location.search).get('garageId'),
        clientName: document.getElementById('clientName').value,
        carBrand: document.getElementById('carBrand').value,
        carModel: document.getElementById('carModel').value,
        service: document.querySelector('input[name="service"]:checked').value,
        date: document.getElementById('bookingDate').value,
        status: 'confirmée',
        createdAt: new Date().toISOString()
    };

    // Sauvegarde la réservation
    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Redirection vers confirmation
    window.location.href = `booking-confirmation.html?id=${bookings.length - 1}`;
});

// Chargement des marques de voitures
const carBrands = ['Peugeot', 'Renault', 'Citroën', 'Volkswagen', 'BMW', 'Audi', 'Mercedes'];
const brandSelect = document.getElementById('carBrand');
if (brandSelect) {
    carBrands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    });
}