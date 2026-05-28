// ============================================================
// SYRIO WEB APP - MOCKED LOGIC & SPA ROUTING
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderFeed();
    renderCommunity();
    renderPets();
    renderPetMatch();
    initMap();
});

/* ─── SPA Navigation ─── */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-panel');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');

            // Update Active Nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Switch View
            views.forEach(view => {
                view.classList.remove('active');
                if (view.id === `view-${target}`) {
                    view.classList.add('active');
                    // Force map resize if map view becomes active
                    if (target === 'map' && window.mapInstance) {
                        setTimeout(() => window.mapInstance.resize(), 100);
                    }
                }
            });
        });
    });
}

/* ─── Mock Data Generators ─── */

const MOCK_POSTS = [
    {
        user: "Ana Gómez",
        avatar: "https://i.pravatar.cc/150?img=47",
        time: "Hace 2 horas",
        content: "Primer día de parque con Luna 🐶. ¡Se ha portado genial!",
        image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        likes: 24,
        comments: 5,
        liked: true
    },
    {
        user: "Carlos Ruiz",
        avatar: "https://i.pravatar.cc/150?img=11",
        time: "Hace 5 horas",
        content: "Descubriendo rutas nuevas por la sierra.",
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        likes: 12,
        comments: 1,
        liked: false
    },
    {
        user: "Marta & Michi",
        avatar: "https://i.pravatar.cc/150?img=5",
        time: "Ayer",
        content: "A Michi no le gusta mucho el arnés nuevo... 🐱🙄",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        likes: 56,
        comments: 12,
        liked: false
    }
];

const MOCK_PETS = [
    { name: "Max", breed: "Golden Retriever", age: "3 años", img: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Kira", breed: "Gato Europeo", age: "1 año", img: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
];

const MOCK_MATCHES = [
    { name: "Thor", breed: "Husky", owner: "Lucía", img: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Milo", breed: "Beagle", owner: "David", img: "https://images.unsplash.com/photo-1537151608804-ea2f14cb39ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
];

/* ─── Render Functions ─── */

function renderFeed() {
    const container = document.getElementById('feed-container');
    if (!container) return;
    
    container.innerHTML = MOCK_POSTS.map(post => `
        <div class="post-card">
            <div class="post-header">
                <div class="post-avatar" style="background-image: url('${post.avatar}')"></div>
                <div class="post-meta">
                    <h4>${post.user}</h4>
                    <span>${post.time}</span>
                </div>
            </div>
            <p class="post-content">${post.content}</p>
            <img src="${post.image}" class="post-image" alt="Post photo">
            <div class="post-actions">
                <button class="post-action-btn ${post.liked ? 'liked' : ''}">
                    ${post.liked ? '❤️' : '🤍'} ${post.likes}
                </button>
                <button class="post-action-btn">💬 ${post.comments}</button>
            </div>
        </div>
    `).join('');
}

function renderCommunity() {
    const container = document.getElementById('community-container');
    if (!container) return;
    // Just reuse feed mock for community
    container.innerHTML = MOCK_POSTS.slice().reverse().map(post => `
        <div class="post-card">
            <div class="post-header">
                <div class="post-avatar" style="background-image: url('${post.avatar}')"></div>
                <div class="post-meta">
                    <h4>${post.user}</h4>
                    <span>${post.time}</span>
                </div>
            </div>
            <p class="post-content">${post.content}</p>
            <img src="${post.image}" class="post-image" alt="Post photo">
        </div>
    `).join('');
}

function renderPets() {
    const container = document.getElementById('profile-pets-container');
    if (!container) return;
    
    container.innerHTML = MOCK_PETS.map(pet => `
        <div class="pet-card">
            <img src="${pet.img}" alt="${pet.name}">
            <div class="pet-card-info">
                <h3>${pet.name}</h3>
                <p>${pet.breed} • ${pet.age}</p>
            </div>
        </div>
    `).join('');
}

function renderPetMatch() {
    const stack = document.getElementById('match-stack');
    if (!stack) return;
    
    stack.innerHTML = MOCK_MATCHES.map((match, i) => `
        <div class="match-card" style="z-index: ${10 - i}; transform: rotate(${i * 3}deg) translateY(${i * 10}px);">
            <img src="${match.img}" alt="${match.name}">
            <div class="match-info">
                <h3>${match.name}</h3>
                <p>${match.breed} • Humano: ${match.owner}</p>
            </div>
        </div>
    `).join('');

    // Mock Tinder swipe action
    const btns = document.querySelectorAll('.btn-match');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const topCard = stack.querySelector('.match-card:first-child');
            if (topCard) {
                topCard.style.transform = `translateX(${btn.classList.contains('btn-pass') ? '-200%' : '200%'}) rotate(${btn.classList.contains('btn-pass') ? '-20deg' : '20deg'})`;
                topCard.style.opacity = '0';
                setTimeout(() => topCard.remove(), 300);
            }
        });
    });
}

function initMap() {
    if (!document.getElementById('maplibre-container')) return;
    // MapLibre mocking
    window.mapInstance = new maplibregl.Map({
        container: 'maplibre-container',
        style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json', // Clean style similar to Syrio
        center: [-3.703790, 40.416775], // Madrid
        zoom: 13,
        attributionControl: false
    });
    
    // Add some mock markers
    new maplibregl.Marker({ color: "#CF6637" }).setLngLat([-3.703, 40.416]).addTo(window.mapInstance);
    new maplibregl.Marker({ color: "#E04040" }).setLngLat([-3.71, 40.42]).addTo(window.mapInstance);
}
