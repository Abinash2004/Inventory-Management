export const loader = {
  show() {
    let overlay = document.getElementById('loader-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'loader-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 20000;
      `;
      overlay.innerHTML = `
        <div class="spinner"></div>
          <style>
            .spinner {
              border: 8px solid rgba(108, 92, 231, 0.15); /* Thicker base */
            border-left-color: #6c5ce7;
            border-radius: 50%;
            width: 60px; /* Bigger size */
            height: 60px; /* Bigger size */
            animation: spin 0.8s linear infinite;
            box-shadow: 0 0 20px rgba(108, 92, 231, 0.4); /* Stronger glow */
          }
            @keyframes spin {
              0% { transform: rotate(0deg); }
            100% {transform: rotate(360deg); }
          }
          </style>
      `;
      document.body.appendChild(overlay);
    }
    this.count = (this.count || 0) + 1;
    overlay.style.display = 'flex';
  },
  hide() {
    this.count = (this.count || 0) - 1;
    if (this.count <= 0) {
      this.count = 0;
      const overlay = document.getElementById('loader-overlay');
      if (overlay) overlay.style.display = 'none';
    }
  }
};
