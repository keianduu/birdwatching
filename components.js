// --- components.js ---
// サイト全体の共通UIパーツ（コンポーネント）を生成・管理するモジュール

const BirdUI = {
    /**
     * ギャラリー用のカード要素を生成する
     * @param {Object} data - data.js の1オブジェクト
     * @param {Object} options - mode ('default', 'mypage', 'review', 'popup') 等を指定
     * @returns {HTMLElement}
     */
    createCard: function(data, options = {}) {
        const mode = options.mode || 'default';
        const item = document.createElement('div');
        
        // 共通クラスとデータ属性
        item.className = 'reveal-wrap gallery-item lb-trigger';
        if (mode === 'review') item.classList.add('review-trigger');
        if (mode === 'popup') item.classList.replace('gallery-item', 'popup-item');
        
        item.dataset.area = data.areaId;
        item.dataset.img = data.imgFull;
        item.dataset.title = data.title;
        item.dataset.author = data.author;
        item.dataset.avatar = data.avatar;
        item.dataset.location = data.areaLocation;
        item.dataset.comment = data.comment;
        item.dataset.gear = data.gear;

        // My Page用の公開設定やReview用の鳥の名前
        if (options.visibility) item.dataset.visibility = options.visibility;
        if (mode === 'review') {
            const birdName = data.title.split('— ')[1] || data.title;
            item.dataset.birdName = birdName;
        }

        // --- 内部HTMLの構築 ---
        let innerHTML = '';

        // マスクアニメーション（Popup以外）
        if (mode !== 'popup') {
            innerHTML += `<div class="reveal-mask"></div>`;
        }

        innerHTML += `<img src="${data.imgThumb}" alt="${data.title}">`;

        // Reviewモード以外はキャプションを表示
        if (mode !== 'review') {
            let metaHTML = '';
            
            if (mode === 'mypage') {
                // My Page固有のメタ（アクションボタン）
                metaHTML = `
                    <div class="card-meta mypage-meta">
                        <span class="shoot-area">📍 ${data.areaLocation}</span>
                        <div class="action-buttons">
                            <button class="action-btn btn-edit" title="Edit">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </button>
                            <button class="action-btn btn-delete" title="Delete">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                    </div>
                `;
            } else {
                // 通常・Popup時のメタ（投稿者情報）
                metaHTML = `
                    <div class="card-meta ${mode === 'popup' ? 'popup-meta' : ''}">
                        <img src="${data.avatar}" class="author-avatar" alt="">
                        <div class="meta-text">
                            <span class="author-name">${data.author}</span>
                            ${mode !== 'popup' ? `<span class="shoot-area">📍 ${data.areaLocation}</span>` : ''}
                        </div>
                    </div>
                `;
            }

            const overlayClass = mode === 'popup' ? 'popup-overlay' : 'image-caption';
            const titleTag = mode === 'popup' ? `<h3>${data.title}</h3>` : `<div class="caption-title">${data.title}</div>`;

            innerHTML += `
                <div class="${overlayClass}">
                    ${titleTag}
                    ${metaHTML}
                </div>
            `;
        }

        item.innerHTML = innerHTML;
        return item;
    }
};