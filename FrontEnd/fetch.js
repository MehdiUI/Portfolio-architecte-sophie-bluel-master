// API Configuration
const API_CONFIG = {
  url: 'http://localhost:5678/api/',
};

async function fetchWorks() {
  try {
    const response = await fetch(`${API_CONFIG.url}works`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const works = await response.json();
    console.log('Données récupérées:', works);
    
    renderGallery(works);
    return works;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return [];
  }
}


function renderGallery(works) {
  const galleryContainer = document.querySelector('.gallery');

  galleryContainer.innerHTML = '';

  const fragment = document.createDocumentFragment();
  
  works.forEach(work => {
    const workElement = document.createElement('figure');
    workElement.dataset.id = work.id;
    
    const imageElement = document.createElement('img');
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    
    const captionElement = document.createElement('figcaption');
    captionElement.textContent = work.title;
    
    workElement.append(imageElement, captionElement);
    fragment.appendChild(workElement);
  });
  
  galleryContainer.appendChild(fragment);
}


async function fetchCategories() {
  try {
    const response = await fetch(`${API_CONFIG.url}categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const categories = await response.json();
    console.log('Données récupérées:', categories);
    
    return categories;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return [];
  }
}


function createFilterButtons(works) {
  const portfolioSection = document.getElementById('portfolio');

  // Créer ou récupérer le conteneur des filtres
  let filterContainer = document.getElementById('filter-container');
  if (!filterContainer) {
    filterContainer = document.createElement('ul');
    filterContainer.id = 'filter-container';
    portfolioSection.insertBefore(filterContainer, portfolioSection.querySelector('.gallery'));
  }

  // Réinitialiser le contenu des boutons de filtre
  filterContainer.innerHTML = '';

  // Fonction pour créer un bouton de filtre
  const createFilterButton = (label, filterFn, isActive = false) => {
    const button = document.createElement('li');
    button.textContent = label;
    if (isActive) button.classList.add('active');
    button.addEventListener('click', () => {
      const filteredWorks = filterFn(works); // Applique le filtre
      renderGallery(filteredWorks); // Met à jour la galerie
      setActiveButton(button); // Gère l'état actif du bouton
    });

    return button;
  };

  // Ajouter le bouton "Tous" (par défaut actif)
  const allButton = createFilterButton('Tous', () => works, true);
  filterContainer.appendChild(allButton);

  // Récupérer et ajouter dynamiquement les catégories
  fetchCategories().then(categories => {
    if (categories.length > 0) {
      categories.forEach(category => {
        const categoryButton = createFilterButton(
          category.name, // Nom de la catégorie
          works => works.filter(work => work.categoryId === category.id) // Filtrage par categoryId
        );
        filterContainer.appendChild(categoryButton);
      });
    }
    console.log('Les catégories récupérées:', categories);
  });
}

// Fonction pour gérer l'état actif des boutons
function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll('#filter-container li');
  buttons.forEach(btn => btn.classList.remove('active'));
  activeButton.classList.add('active');
}

// Fonction pour initialiser la galerie
function initGallery() {
  fetchWorks()
    .then(works => {
      if (works.length > 0) {
        createFilterButtons(works); // Crée les boutons de filtre
        renderGallery(works); // Affiche tous les projets par défaut
      }
    })
    .catch(error => {
      console.error('Erreur lors de l\'initialisation de la galerie:', error);
    });
}

initGallery();

async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_CONFIG.url}users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (!response.ok) {
      // Si le serveur retourne une erreur, on affiche un message
      const errorData = await response.json();
      console.error('Erreur lors de la connexion :', errorData.message);
      return { success: false, message: errorData.message || "Erreur inconnue" };
    }

    const data = await response.json();
    console.log('Connexion réussie:', data);

    // Retourne les données récupérées
    return { success: true, data: data };
  } catch (error) {
    console.error('Erreur réseau lors de la connexion :', error);
    return { success: false, message: "Erreur réseau. Veuillez réessayer plus tard." };
  }
}

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async function(event) {
      event.preventDefault(); // Empêche le comportement par défaut du formulaire

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Appelez la fonction loginUser avec les valeurs du formulaire
      const result = await loginUser(email, password);

      if (result.success) {
          // Connexion réussie, rediriger ou afficher un message
          console.log('Connexion réussie');
          // Par exemple, rediriger vers une autre page :
          // window.location.href = '/dashboard';
      } else {
          // Afficher le message d'erreur
          console.error('Erreur de connexion:', result.message);
          // Par exemple, afficher un message d'erreur dans la page :
          // const errorMessage = document.getElementById('error-message');
          // errorMessage.textContent = result.message;
      }
  });
});


