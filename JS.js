document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartContent = document.getElementById('cart-content');
    const checkoutButton = document.getElementById('checkout-button');
    const addButtonElements = document.querySelectorAll('.add-button');

    addButtonElements.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.parentElement;
            const productName = product.querySelector('img').alt;
            const productPrice = parseFloat(product.querySelector('p').textContent.replace('€', ''));
            const quantity = parseInt(product.querySelector('input').value);
            addToCart(productName, productPrice, quantity);
        });
    });

    function addToCart(name, price, quantity) {
        const existingProduct = cart.find(item => item.name === name);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }
        updateCartContent();
    }

    function updateCartContent() {
        cartContent.innerHTML = '';
        cart.forEach(item => {
            const productDiv = document.createElement('div');
            productDiv.textContent = `${item.name} - ${item.quantity} x ${item.price.toFixed(2)}€`;
            cartContent.appendChild(productDiv);
        });
    }

    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        const orderDetails = cart.map(item => `${item.name} - ${item.quantity} x ${item.price.toFixed(2)}€`).join('\n');
        sendOrderDetails(orderDetails);
    });

    function sendOrderDetails(orderDetails) {
        const botToken = '7115762035:AAGIbtSbm_fay17tg2C_4hs9STfJThC6DQ4';  // Replace with your Telegram bot token
        const chatId = '7132322147';  // Replace with your chat ID

        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const data = {
            chat_id: chatId,
            text: `New Order:\n\n${orderDetails}`
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert('Order details sent successfully!');
                cart.length = 0;
                updateCartContent();
            } else {
                alert('Failed to send order details.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error sending order details.');
        });
    }
});
