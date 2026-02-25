// Product Data
const products = [
    {
        id: 1,
        title: "Sona Masoori Rice 5kg",
        category: "Sona Masoori",
        price: 34.00,
        originalPrice: 37.00,
        image: "images/sona masoori2.jpg",
        rating: 4.6,
        reviews: 321,
        discount: 8
    },
    {
        id: 2,
        title: "Organic Brown Rice 2kg",
        category: "Brown Rice",
        price: 29.90,
        originalPrice: 33.20,
        image: "images/organic brown rice.jpg",
        rating: 4.7,
        reviews: 214,
        discount: 10
    },
    {
        id: 3,
        title: "South Indian Spice Combo Pack",
        category: "Spices",
        price: 27.24,
        originalPrice: 30.00,
        image: "images/Spices.jpg",
        rating: 4.7,
        reviews: 156,
        discount: 9
    },
    {
        id: 4,
        title: "Whole Wheat Atta 10kg",
        category: "Flour",
        price: 38.00,
        originalPrice: 40.86,
        image: "images/whole wheat atta.jpg",
        rating: 4.6,
        reviews: 664,
        discount: 7
    },
    {
        id: 5,
        title: "Royal Basmati Rice 5kg",
        category: "Basmati",
        price: 42.50,
        originalPrice: 48.30,
        image: "images/basmathi.jpg",
        rating: 4.8,
        reviews: 534,
        discount: 12
    },
    {
        id: 6,
        title: "Sunflower Cooking Oil 5L",
        category: "Cooking Oil",
        price: 26.84,
        originalPrice: 31.00,
        image: "images/cooking oil.jpg",
        rating: 4.3,
        reviews: 289,
        discount: 13
    },
    {
        id: 7,
        title: "Thai Jasmine Rice 5kg",
        category: "Jasmine",
        price: 37.13,
        originalPrice: 39.90,
        image: "images/jasmine.jpg",
        rating: 4.5,
        reviews: 423,
        discount: 7
    },
    {
        id: 8,
        title: "Toor Dal Premium 1kg",
        category: "Pulses",
        price: 12.11,
        originalPrice: 13.75,
        image: "images/Pulses.jpg",
        rating: 4.4,
        reviews: 156,
        discount: 12
    }
];

// Cart Management
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        this.save();
        this.updateUI();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateUI();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeItem(productId);
            } else {
                this.save();
            }
        }
        this.updateUI();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateUI() {
        this.updateCartCount();
        this.renderCartItems();
    }

    updateCartCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = count;
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        
        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        } else {
            cartItemsContainer.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">AED ${item.price.toFixed(2)}</div>
                        <div class="cart-item-controls">
                            <button onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                            <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                            <button onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            <button class="cart-item-remove" onclick="cart.removeItem(${item.id})">🗑️</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        document.getElementById('cartTotal').textContent = `AED ${this.getTotal().toFixed(2)}`;
    }
}

// Initialize Cart
const cart = new Cart();

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Load theme preference
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// Cart Drawer
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');

cartBtn.addEventListener('click', () => {
    cartDrawer.classList.add('open');
});

closeCart.addEventListener('click', () => {
    cartDrawer.classList.remove('open');
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (!cartDrawer.contains(e.target) && !cartBtn.contains(e.target)) {
        cartDrawer.classList.remove('open');
    }
});

// Render Products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">
                    <span class="price">AED ${product.price.toFixed(2)}</span>
                    <span class="original-price">AED ${product.originalPrice.toFixed(2)}</span>
                    <span class="discount">-${product.discount}%</span>
                </div>
                <div class="rating">
                    <span class="stars">${'⭐'.repeat(Math.floor(product.rating))}</span>
                    <span>(${product.reviews})</span>
                </div>
                <button class="add-to-cart-btn" onclick="cart.addItem({
                    id: ${product.id},
                    title: '${product.title}',
                    price: ${product.price},
                    image: '${product.image}'
                })">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Scroll to products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    cart.updateUI();
});
