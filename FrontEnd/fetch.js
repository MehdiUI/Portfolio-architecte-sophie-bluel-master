const API_CONFIG = {
  url: 'http://localhost:5678/api/',
};

async function fetchWorks() {
  try {
    const response = await fetch(`${API_CONFIG.url}works`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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

  works.forEach((work) => {
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
        'Content-Type': 'application/json',
      },
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
  let filterContainer = document.getElementById('filter-container');
  const authToken = localStorage.getItem('authToken'); // Vérifie si l'utilisateur est connecté

  // Si connecté, ne crée pas les filtres
  if (authToken) {
    if (filterContainer) {
      filterContainer.remove(); // Supprime le conteneur s'il existe déjà
    }
    return;
  }

  if (!filterContainer) {
    filterContainer = document.createElement('ul');
    filterContainer.id = 'filter-container';
    portfolioSection.insertBefore(filterContainer, portfolioSection.querySelector('.gallery'));
  }

  filterContainer.innerHTML = '';

  const createFilterButton = (label, filterFn, isActive = false) => {
    const button = document.createElement('li');
    button.textContent = label;
    if (isActive) button.classList.add('active');
    button.addEventListener('click', () => {
      const filteredWorks = filterFn(works);
      renderGallery(filteredWorks);
      setActiveButton(button);
    });

    return button;
  };

  const allButton = createFilterButton('Tous', () => works, true);
  filterContainer.appendChild(allButton);

  fetchCategories().then((categories) => {
    if (categories.length > 0) {
      categories.forEach((category) => {
        const categoryButton = createFilterButton(
          category.name,
          (works) => works.filter((work) => work.categoryId === category.id)
        );
        filterContainer.appendChild(categoryButton);
      });
    }
  });
}


function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll('#filter-container li');
  buttons.forEach((btn) => btn.classList.remove('active'));
  activeButton.classList.add('active');
}

function initGallery() {
  fetchWorks()
    .then((works) => {
      if (works.length > 0) {
        createFilterButtons(works);
        renderGallery(works);
      }
    })
    .catch((error) => {
      console.error('Erreur lors de l\'initialisation de la galerie:', error);
    });
}

initGallery();

async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_CONFIG.url}users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Erreur inconnue' };
    }

    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    return { success: false, message: 'Erreur réseau. Veuillez réessayer plus tard.' };
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const result = await loginUser(email, password);

    if (result.success) {
      localStorage.setItem('authToken', result.data.token);
      window.location.href = '/FrontEnd/index.html';
    } else {
      alert('Email ou mot de passe incorrect. Veuillez réessayer.');
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const authToken = localStorage.getItem('authToken');

  if (authToken) {
    console.log('Token récupéré depuis le localStorage :', authToken);
  } else {
    console.log('Aucun token trouvé dans le localStorage.');
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const iconLink = document.getElementById('icona');
  const adminBar = document.getElementById('admin-bar');
  const loginLink = document.querySelector('a.login');

  if (!iconLink || !loginLink) {
    return;
  }

  const authToken = localStorage.getItem('authToken');

  if (authToken) {
    loginLink.textContent = 'Logout';
    loginLink.href = '#';
    adminBar.classList.add('visible');
    adminBar.style.display = 'flex';
    iconLink.style.display = 'inline-block';

    loginLink.addEventListener('click', function (event) {
      event.preventDefault();
      localStorage.removeItem('authToken');
      loginLink.textContent = 'Login';
      loginLink.href = 'login.html';
      adminBar.classList.remove('visible');
      adminBar.style.display = 'none';
      iconLink.style.display = 'none';
      window.location.reload();
    });
  } else {
    loginLink.textContent = 'Login';
    loginLink.href = 'login.html';
    adminBar.classList.remove('visible');
    adminBar.style.display = 'none';
    iconLink.style.display = 'none';

    iconLink.addEventListener('click', function (event) {
      event.preventDefault();
      alert('Veuillez vous connecter pour modifier.');
    });
  }
});

async function fetchWorksPost() {
  try {
    const formData = new FormData();
    formData.append('title', 'Titre Exemple');
    formData.append('category', 1);
    formData.append('image', new Blob(['fake image data'], { type: 'image/png' }));

    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token introuvable dans localStorage. Veuillez vous connecter.');
    }

    const response = await fetch(`${API_CONFIG.url}works`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: FormData,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorText = await response.text();
      console.error(`Erreur HTTP ${response.status}:`, errorText);
    }
  } catch (error) {
    console.error('Erreur lors de la requête POST:', error);
  }
}

let modal = null;

const focusableSelector = 'button, a, input, textarea';
let focusables = [];

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute('href'));
  target.style.display = null;
  target.removeAttribute('aria-hidden');
  target.setAttribute('aria-modal', 'true');
  modal = target;
  modal.addEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
  document.body.style.overflow = 'hidden';
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  modal.removeAttribute('aria-modal');
  modal.removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
  modal = null;
  document.body.style.overflow = '';
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

const focusInModal = function (e) {
  e.preventDefault();
};

document.querySelectorAll('.js-modal').forEach((a) => {
  a.addEventListener('click', openModal);
});

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    closeModal(e);
  }

  if (e.key === 'Tab' && modal !== null) {
    focusInModal(e);
  }
});

function renderGalleryInModal(works) {
  const modalWrapper = document.querySelector('.modal-wrapper.js-modal-stop');

  if (!modalWrapper) {
    console.error('Le conteneur modal-wrapper.js-modal-stop est introuvable.');
    return;
  }

  // Supprimez l'ancienne galerie si elle existe
  const existingGallery = modalWrapper.querySelector('.gallery-modal');
  if (existingGallery) {
    existingGallery.remove();
  }

  // Créez un conteneur pour la galerie
  const galleryContainer = document.createElement('div');
  galleryContainer.classList.add('gallery-modal');

  // Ajoutez les images à la galerie
  works.forEach((work) => {
    const workElement = document.createElement('div');
    workElement.classList.add('gallery-item');
    workElement.dataset.id = work.id;

    const imageElement = document.createElement('img');
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    imageElement.classList.add('modal-image');

    const iconElement = document.createElement('i');
    iconElement.classList.add('fa-solid', 'fa-trash-can', 'delete-icon');
    iconElement.title = 'Supprimer';

    // Ajoutez l'événement pour supprimer une image
    iconElement.addEventListener('click', function () {
      workElement.remove();
      console.log(`Image supprimée : ${work.id}`);
    });

    workElement.appendChild(imageElement);
    workElement.appendChild(iconElement);
    galleryContainer.appendChild(workElement);
  });

  // Ajoutez un séparateur
  const separator = document.createElement('hr');
  separator.classList.add('modal-separator');

  // Créez le bouton "Ajouter une photo"
  const addButton = document.createElement('button');
  addButton.textContent = 'Ajouter une photo';
  addButton.classList.add('add-photo-button');
  addButton.addEventListener('click', () => {
    console.log('Bouton Ajouter une photo cliqué');
    // Ajoutez ici la logique pour ouvrir une modal ou un formulaire pour ajouter une photo
  });

  // Ajoutez tout au conteneur de la modale
  modalWrapper.appendChild(galleryContainer);
  modalWrapper.appendChild(separator);
  modalWrapper.appendChild(addButton);
}


async function fetchAndRenderGalleryInModal() {
  try {
    const response = await fetch(`${API_CONFIG.url}works`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const works = await response.json();
    renderGalleryInModal(works);
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
}

fetchAndRenderGalleryInModal();

document.addEventListener('DOMContentLoaded', function () {
  const authToken = localStorage.getItem('authToken');
  const body = document.body;

  if (authToken) {
    body.classList.add('user-logged-in'); // Ajoute une classe si connecté
  } else {
    body.classList.remove('user-logged-in'); // Retire la classe si déconnecté
  }
});
