'use client';

interface ToastOptions {
    title?: string;
    description?: string;
    duration?: number;
}

// Simple toast implementation without dependencies
export const toast = ({ title, description, duration = 3000 }: ToastOptions) => {
    // Log to console for debugging
    console.log(`Toast: ${title} - ${description}`);

    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = 'fixed bottom-4 right-4 z-50 bg-white rounded-lg border border-gray-200 shadow-lg p-4 max-w-md animate-fade-in';
    toastElement.style.animation = 'fadeIn 0.3s ease-in-out';

    toastElement.innerHTML = `
    ${title ? `<h4 class="font-semibold">${title}</h4>` : ''}
    ${description ? `<p class="text-sm text-gray-600">${description}</p>` : ''}
  `;

    // Add animation styles
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(10px); }
    }
  `;
    document.head.appendChild(style);

    // Add to DOM
    document.body.appendChild(toastElement);

    // Remove after duration
    setTimeout(() => {
        toastElement.style.animation = 'fadeOut 0.3s ease-in-out forwards';
        setTimeout(() => {
            toastElement.remove();
        }, 300);
    }, duration);
};