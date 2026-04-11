document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const main = document.querySelector('main');

    startBtn.addEventListener('click', () => {
        // Add a nice transition effect
        main.style.opacity = '0';
        main.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            renderLesson();
            main.style.opacity = '1';
        }, 500);
    });

    function renderLesson() {
        main.innerHTML = `
            <div class="lesson-container" style="max-width: 600px; width: 100%; animation: slideIn 0.5s ease-out;">
                <div class="progress-bar-container" style="width: 100%; height: 16px; background: rgba(255,255,255,0.1); border-radius: 8px; margin-bottom: 2rem; position: relative; overflow: hidden;">
                    <div class="progress-fill" style="width: 30%; height: 100%; background: var(--primary); border-radius: 8px; transition: width 0.3s ease;"></div>
                </div>
                
                <h2 style="font-size: 2rem; margin-bottom: 2rem; font-weight: 800;">Translate this sentence:</h2>
                
                <div class="sentence-box" style="background: var(--card-bg); padding: 2rem; border-radius: 24px; border: 1px solid var(--border-color); margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem;">
                    <div class="avatar" style="width: 60px; height: 60px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">🦉</div>
                    <div class="bubble" style="font-size: 1.5rem; font-weight: 600;">"El gato bebe leche."</div>
                </div>

                <div class="options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    ${['The dog drinks milk', 'The cat drinks milk', 'A bird eats bread', 'The cat is happy'].map(opt => `
                        <button class="option-btn" style="background: var(--card-bg); color: white; border: 1px solid var(--border-color); padding: 1rem; border-radius: 16px; cursor: pointer; font-weight: 600; font-size: 1.1rem; transition: all 0.2s ease;">
                            ${opt}
                        </button>
                    `).join('')}
                </div>

                <style>
                    .option-btn:hover {
                        background: rgba(255,255,255,0.05);
                        border-color: var(--primary);
                    }
                    @keyframes slideIn {
                        from { transform: translateX(50px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                </style>
            </div>
        `;

        // Add event listeners to options
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const isCorrect = e.target.innerText === 'The cat drinks milk';
                if (isCorrect) {
                    e.target.style.background = 'rgba(88, 204, 2, 0.2)';
                    e.target.style.borderColor = 'var(--primary)';
                    alert('¡Excelente! 🎉');
                } else {
                    e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                    e.target.style.borderColor = '#EF4444';
                    alert('Oh no! Try again. 🦉');
                }
            });
        });
    }
});
