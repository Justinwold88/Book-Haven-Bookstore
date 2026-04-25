document.addEventListener('DOMContentLoaded', function () {
    // ========== HAMBURGER MENU TOGGLE ==========
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function () {
            const navUl = document.querySelector('nav ul');
            if (navUl) navUl.classList.toggle('open');
        });
    }

    // ========== SUBSCRIBE (Footer) ==========
    const subscribeForm = document.querySelector('footer form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Thank you for subscribing.');
        });
    }

    // ========== CART LOGIC ==========
    const CART_KEY = 'bookHavenCart';
    const ORDERS_KEY = 'completedOrders';       // localStorage for processed orders
    const CUSTOM_ORDERS_KEY = 'customOrders';   // localStorage for About Us form

    function getCart() {
        const data = sessionStorage.getItem(CART_KEY);
        return data ? JSON.parse(data) : [];
    }
    function saveCart(cartArray) {
        sessionStorage.setItem(CART_KEY, JSON.stringify(cartArray));
    }
    function clearCartStorage() {
        sessionStorage.removeItem(CART_KEY);
    }

    function renderCartModal() {
        const cart = getCart();
        const container = document.getElementById('cart-items-container');
        const emptyMsg = document.getElementById('cart-empty-message');
        if (!container || !emptyMsg) return;
        container.innerHTML = '';
        if (cart.length === 0) {
            container.style.display = 'none';
            emptyMsg.style.display = 'block';
        } else {
            container.style.display = 'block';
            emptyMsg.style.display = 'none';
            cart.forEach(function (item) {
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <img src="images/${item.image}" alt="${item.name}">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">$${item.price}</span>
                `;
                container.appendChild(div);
            });
        }
    }

    function openModal() {
        const overlay = document.getElementById('cart-modal-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            renderCartModal();
        }
    }
    function closeModal() {
        const overlay = document.getElementById('cart-modal-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    function openCartOrAlert() {
        const cart = getCart();
        if (cart.length === 0) {
            alert('Your cart is empty.');
        } else {
            openModal();
        }
    }

    // Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const cell = this.closest('.product');
            const name = cell.querySelector('h3').textContent;
            const price = cell.querySelector('p').textContent.replace('$', '');
            const img = cell.querySelector('img').getAttribute('src').replace('images/', '');
            const cart = getCart();
            cart.push({ name, price, image: img });
            saveCart(cart);
            alert('Item added to the cart.');
        });
    });

    // View Cart button (main)
    const viewBtn = document.getElementById('view-cart-button');
    if (viewBtn) viewBtn.addEventListener('click', (e) => { e.preventDefault(); openCartOrAlert(); });

    // View Cart icon (header)
    const headerCart = document.getElementById('view-cart');
    if (headerCart) headerCart.addEventListener('click', (e) => { e.preventDefault(); openCartOrAlert(); });

    // View Cart link inside nav (mobile)
    const navCart = document.getElementById('nav-cart-link');
    if (navCart) {
        navCart.addEventListener('click', function (e) {
            e.preventDefault();
            openCartOrAlert();
            const ul = document.querySelector('nav ul');
            if (ul) ul.classList.remove('open');
        });
    }

    // Modal close (X)
    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Modal overlay click outside
    const overlay = document.getElementById('cart-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeModal();
        });
    }

    // Clear Cart
    const clearBtn = document.getElementById('modal-clear-cart');
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            clearCartStorage();
            renderCartModal(); // shows empty state
            alert('Cart cleared.');
        });
    }

    // Process Order
    const processBtn = document.getElementById('modal-process-order');
    if (processBtn) {
        processBtn.addEventListener('click', function () {
            const cart = getCart();
            if (cart.length === 0) {
                alert('Your cart is empty.');
                return;
            }
            const history = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
            const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
            history.push({
                id: Date.now(),
                items: cart,
                total: total.toFixed(2),
                date: new Date().toLocaleString()
            });
            localStorage.setItem(ORDERS_KEY, JSON.stringify(history));
            clearCartStorage();
            renderCartModal();
            alert('Thank you for your order.');
        });
    }

    // ========== ABOUT US FORM: Save to localStorage ==========
    const contactForm = document.querySelector('#contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            if (contactForm.checkValidity()) {
                e.preventDefault();
                const formData = {
                    id: Date.now(),
                    name: document.getElementById('name').value,
                    email: document.getElementById('email-contact').value,
                    mood: document.querySelector('input[name="mood"]:checked').value,
                    message: document.getElementById('message').value,
                    timestamp: new Date().toLocaleString()
                };
                const orders = JSON.parse(localStorage.getItem(CUSTOM_ORDERS_KEY)) || [];
                orders.push(formData);
                localStorage.setItem(CUSTOM_ORDERS_KEY, JSON.stringify(orders));
                alert('Thank you for your message.');
                contactForm.reset();
            }
        });
    }
});