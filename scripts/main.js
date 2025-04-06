// Données factices de garages
// Import des données des garages
const garages = [
    {
        id: 1,
        name: "Garage du Centre",
        location: "75015 Paris",
        rating: 4.8,
        services: ["Vidange", "Pneumatiques", "Carrosserie"],
        image: "https://images.pexels.com/photos/163945/pexels-photo-163945.jpeg"
    },
    {
        id: 2,
        name: "Auto Service Pro", 
        location: "69002 Lyon",
        rating: 4.5,
        services: ["Diagnostic", "Freinage"],
        image: "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg"
    },
    {
        id: 3,
        name: "Mécanique Express",
        location: "13001 Marseille",
        rating: 4.9,
        services: ["Moteur", "Climatisation", "Électricité"],
        image: "https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg"
    }
];

// Fonction pour afficher les garages
function displayGarages(garagesToDisplay) {
    const garageList = document.getElementById('garage-list');
    garageList.innerHTML = '';

    garagesToDisplay.forEach(garage => {
        const garageCard = document.createElement('div');
        garageCard.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300';
        // Generate availability badges if available
        const availabilityBadges = garage.availability 
            ? `<div class="mt-2">
                  <p class="text-xs text-gray-500">Disponibilités :</p>
                  <div class="flex flex-wrap gap-1 mt-1">
                      ${garage.availability.hours.split(',').map(slot => 
                          `<span class="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                              ${garage.availability.days} ${slot.trim()}
                          </span>`
                      ).join('')}
                  </div>
               </div>`
            : '';

        garageCard.innerHTML = `
            <img src="${garage.image}" alt="${garage.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <div class="flex justify-between items-start">
                    <h4 class="text-xl font-bold text-gray-800">${garage.name}</h4>
                    <div class="flex items-center text-yellow-400">
                        <i class="fas fa-star"></i>
                        <span class="ml-1 text-gray-600">${garage.rating}</span>
                    </div>
                </div>
                <p class="text-gray-600 mt-2">
                    <i class="fas fa-map-marker-alt text-blue-500 mr-2"></i>
                    ${garage.location}
                </p>
                <div class="mt-3 flex flex-wrap gap-2">
                    ${garage.services.map(service => 
                        `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${service}</span>`
                    ).join('')}
                </div>
                <button class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                    Réserver
                </button>
            </div>
        `;
        garageList.appendChild(garageCard);
    });
}

// Fonction pour gérer l'inscription du garage
function registerGarage(event) {
    event.preventDefault();
    
    const garageData = {
        name: document.getElementById('garageName').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        services: Array.from(document.querySelectorAll('input[name="services"]:checked')).map(el => el.value),
        availability: {
            days: document.getElementById('availabilityDays').value,
            hours: document.getElementById('availabilityHours').value
        }
    };

    // Stocker les données (remplacer par un appel API en production)
    localStorage.setItem('garageData', JSON.stringify(garageData));
    window.location.href = 'payment-garage.html';
}

// Fonction pour initialiser le formulaire
function initGarageForm() {
    document.getElementById('garageForm').addEventListener('submit', registerGarage);
}

// Fonction de recherche
function searchGarages() {
    const searchInput = document.querySelector('input[type="text"]').value.toLowerCase();
    const filteredGarages = garages.filter(garage => 
        garage.name.toLowerCase().includes(searchInput) || 
        garage.location.toLowerCase().includes(searchInput)
    );
    displayGarages(filteredGarages);
}

// Charge et affiche les réservations
function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const bookingList = document.getElementById('bookingList');
    
    if (bookingList) {
        bookingList.innerHTML = bookings.map(booking => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${booking.clientName || 'Anonyme'}<br>
                    <span class="text-xs text-gray-500">${booking.carBrand} ${booking.carModel}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">${new Date(booking.date).toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap">${booking.service}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full ${booking.status === 'confirmée' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                        ${booking.status}
                    </span>
                </td>
            </tr>
        `).join('');
    }
}

// Vérification du statut de paiement
function checkPaymentStatus() {
    const paymentStatus = document.getElementById('paymentStatus');
    if (paymentStatus) {
        const payment = JSON.parse(localStorage.getItem('garagePayment'));
        if (payment) {
            paymentStatus.classList.remove('hidden');
            if (payment.status === 'pending') {
                paymentStatus.classList.add('bg-yellow-50', 'text-yellow-700');
                paymentStatus.querySelector('p').textContent = 
                    'Votre abonnement est en cours de validation (24h max)';
            } else if (payment.status === 'approved') {
                paymentStatus.classList.add('bg-green-50', 'text-green-700');
                paymentStatus.querySelector('p').textContent = 
                    'Votre abonnement est actif - 1 mois offert !';
            }
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    checkPaymentStatus();
    loadBookings();
    displayGarages(garages);
    
    // Écouteur d'événement pour la recherche
    document.querySelector('input[type="text"]')?.addEventListener('input', searchGarages);
    
    // Initialiser le formulaire d'inscription si présent
    if (document.getElementById('garageForm')) {
        initGarageForm();
    }
});