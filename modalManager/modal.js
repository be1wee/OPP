document.addEventListener('DOMContentLoaded', function() {
    console.log('Modal loaded');
    
    const modalHTML = `
        <div id="modal-window">
            <div id="alert">
                <p id="alert-content"></p>
                <button id="alert-close-btn">OK</button>
            </div>
        </div>
    `;
    
    const modalStyles = `
        #modal-window{
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.284);
            backdrop-filter: blur(10px);
            width: 100vw;
            height: 100vh;
            z-index: 9999;
            animation: fadeIn 0.5s;
        }
        #alert{
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: rgba(59, 22, 101, 0.259);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.122);
            display: flex;
            gap: 1vw;
            align-items: center;
            flex-direction: column;
            padding: 1vw;
            backdrop-filter: blur(10px);
        }
        #alert>button{
            border: none;
            outline: none;
            border-radius: 12px;
            padding-left: 1vw;
            padding-right: 1vw;
            padding-top: 8px;
            padding-bottom: 8px;
            background-color: rgb(59, 22, 101);
            transition: all 0.3s ease;
        }
        #alert>button:hover{
            background-color: rgb(80, 33, 134);
            transform: translateY(-3px);
        }
        #alert>button:focus{
            border: none;
            outline: none;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = modalStyles;
    document.head.appendChild(styleElement);
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modalWindow = document.getElementById('modal-window');
    const alertContent = document.getElementById('alert-content');
    const alertCloseBtn = document.getElementById('alert-close-btn');
    
    window.Modal = {
        show: function(message, options = {}) {
            alertContent.textContent = message;
            
            if (options.buttonText) {
                alertCloseBtn.textContent = options.buttonText;
            }
            
            modalWindow.style.display = 'block';
            setTimeout(() => alertCloseBtn.focus(), 100);
        },
        
        close: function() {
            modalWindow.style.display = 'none';
            alertCloseBtn.textContent = 'OK';
        },
        
        error: function(message) {
            this.show(message, { buttonText: 'Закрыть' });
        },
        
        success: function(message) {
            this.show(message, { buttonText: 'Отлично!' });
        }
    };
    
    alertCloseBtn.addEventListener('click', function() {
        window.Modal.close();
    });
    
    modalWindow.addEventListener('click', function(e) {
        if (e.target === modalWindow) {
            window.Modal.close();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalWindow.style.display === 'block') {
            window.Modal.close();
        }
    });
    
    try {
        if (window.parent && window.parent.onModalLoaded) {
            window.parent.onModalLoaded();
        }
    } catch (e) {}
});