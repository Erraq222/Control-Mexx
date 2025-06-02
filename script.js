document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('card-container');
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');

    // Dữ liệu mẫu cho các thẻ bài.
    // Em có thể thay thế bằng dữ liệu từ API hoặc database sau này khi làm backend.
    const cardsData = [
        { id: 1, name: "Minh Anh", age: 20, description: "Thích cà phê và viết lách. Luôn hóng chuyện nhưng không thích nói xấu đâu nha!", img: "https://via.placeholder.com/300x350/9ADCFF/FFFFFF?text=Minh+Anh" },
        { id: 2, name: "Khánh Duy", age: 23, description: "Mê game, thích đậu phộng và các loại hạt. Rất thích người nói nhiều nha!", img: "https://via.placeholder.com/300x350/FFB8B8/FFFFFF?text=Khanh+Duy" },
        { id: 3, name: "Thảo My", age: 21, description: "Team ghét ếch, gián, côn trùng, thằn lằn. Ưa nhìn và thích du lịch đó đây.", img: "https://via.placeholder.com/300x350/FFC994/FFFFFF?text=Thao+My" },
        { id: 4, name: "Quang Hải", age: 24, description: "Người nói nhiều đây, thích bóng đá và các buổi gặp gỡ bạn bè. Có cả đậu phộng luôn!", img: "https://via.placeholder.com/300x350/B8B8FF/FFFFFF?text=Quang+Hai" },
        { id: 5, name: "Lan Chi", age: 19, description: "Đam mê nghệ thuật và thích tìm hiểu những điều mới lạ. Tuyệt đối không có côn trùng ở gần đâu nha!", img: "https://via.placeholder.com/300x350/D2FF9D/FFFFFF?text=Lan+Chi" },
    ];

    let currentCardIndex = 0; // Theo dõi thẻ hiện tại
    let startX = 0; // Vị trí bắt đầu kéo
    let isDragging = false; // Trạng thái kéo
    let currentCardElement = null; // Thẻ DOM hiện đang hiển thị

    // Hàm tạo và hiển thị thẻ mới lên giao diện
    function renderCard() {
        // Xóa thẻ "Bắt đầu" nếu nó vẫn còn trên DOM
        const initialCard = cardContainer.querySelector('.initial-card');
        if (initialCard) {
            initialCard.remove();
        }

        // Kiểm tra nếu đã hết thẻ trong danh sách dữ liệu
        if (currentCardIndex >= cardsData.length) {
            cardContainer.innerHTML = `
                <div class="card initial-card">
                    <img src="https://via.placeholder.com/300x350/6A0DAD/FFFFFF?text=H%E1%BA%BFt+th%E1%BA%BB!" alt="Hết thẻ">
                    <div class="card-info">
                        <h3>Hết thẻ rồi nè!</h3>
                        <p>Anh nhớ nhắn dài, nhoi nhoi vô nha! Anh là bồ em mà!😜</p>
                    </div>
                </div>
            `;
            // Vô hiệu hóa nút bấm khi không còn thẻ để vuốt
            likeBtn.disabled = true;
            dislikeBtn.disabled = true;
            likeBtn.style.opacity = 0.5;
            dislikeBtn.style.opacity = 0.5;
            return; // Dừng hàm
        }

        const cardData = cardsData[currentCardIndex]; // Lấy dữ liệu của thẻ tiếp theo
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.innerHTML = `
            <img src="${cardData.img}" alt="${cardData.name}">
            <div class="card-info">
                <h3>${cardData.name}, ${cardData.age}</h3>
                <p>${cardData.description}</p>
            </div>
        `;
        cardContainer.appendChild(cardElement); // Thêm thẻ vào container
        currentCardElement = cardElement; // Cập nhật thẻ hiện tại

        // Kích hoạt lại nút nếu trước đó bị vô hiệu hóa (trường hợp sau khi hết thẻ lại có thêm dữ liệu)
        likeBtn.disabled = false;
        dislikeBtn.disabled = false;
        likeBtn.style.opacity = 1;
        dislikeBtn.style.opacity = 1;

        // Thêm event listener cho việc kéo thả trên thẻ mới
        addDragListeners(cardElement);
    }

    // Hàm xử lý hành động vuốt (like hoặc dislike)
    function swipeCard(action) {
        if (!currentCardElement) return; // Đảm bảo có thẻ để vuốt

        const card = currentCardElement;
        card.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out'; // Kích hoạt lại transition

        // Áp dụng hiệu ứng transform tùy theo hành động
        if (action === 'like') {
            card.style.transform = 'translateX(500px) rotate(30deg)'; // Vuốt sang phải và xoay
            console.log(`Thích: ${cardsData[currentCardIndex].name}`); // Log hành động
        } else { // dislike
            card.style.transform = 'translateX(-500px) rotate(-30deg)'; // Vuốt sang trái và xoay
            console.log(`Bỏ qua: ${cardsData[currentCardIndex].name}`); // Log hành động
        }
        card.style.opacity = '0'; // Làm thẻ mờ dần

        // Đợi animation kết thúc (0.3 giây) rồi mới xóa thẻ và render thẻ mới
        setTimeout(() => {
            card.remove(); // Xóa thẻ khỏi DOM
            currentCardIndex++; // Tăng chỉ số để lấy thẻ tiếp theo
            renderCard(); // Hiển thị thẻ mới
        }, 300); // Thời gian trùng với transition CSS
    }

    // Hàm thêm các sự kiện kéo thả cho một thẻ bài (dùng cho cả chuột và cảm ứng)
    function addDragListeners(card) {
        // Sự kiện bắt đầu kéo (chuột xuống hoặc chạm màn hình)
        card.addEventListener('mousedown', startDrag);
        card.addEventListener('touchstart', startDrag, { passive: true }); // passive: true để tối ưu hiệu suất cuộn

        function startDrag(e) {
            isDragging = true;
            // Lấy vị trí X ban đầu (từ chuột hoặc ngón tay chạm)
            startX = e.clientX || e.touches[0].clientX;
            card.style.transition = 'none'; // Tắt transition để kéo không bị giật

            // Thêm sự kiện di chuyển và kết thúc kéo (trên toàn bộ document để đảm bảo không bị mất sự kiện)
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: true });
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
        }

        // Sự kiện di chuyển khi đang kéo
        function drag(e) {
            if (!isDragging) return;
            const currentX = e.clientX || e.touches[0].clientX;
            const deltaX = currentX - startX; // Độ lệch từ vị trí ban đầu

            // Áp dụng transform để di chuyển và xoay thẻ theo con trỏ
            card.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 15}deg)`;
        }

        // Sự kiện kết thúc kéo (nhả chuột hoặc nhấc ngón tay)
        function endDrag(e) {
            isDragging = false;
            // Xóa các event listener tạm thời
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchend', endDrag);

            card.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out'; // Bật lại transition

            // Lấy vị trí X cuối cùng để xác định hành động
            const finalX = e.clientX || (e.changedTouches ? e.changedTouches[0].clientX : startX);
            const deltaX = finalX - startX;

            // Quyết định hành động vuốt dựa trên độ lệch X
            if (deltaX > 75) { // Vuốt sang phải đủ xa (hơn 75px)
                swipeCard('like');
            } else if (deltaX < -75) { // Vuốt sang trái đủ xa (hơn -75px)
                swipeCard('dislike');
            } else { // Vuốt không đủ xa, đưa thẻ về vị trí ban đầu
                card.style.transform = 'translateX(0) rotate(0)';
            }
        }
    }

    // Xử lý sự kiện bấm nút Thích/Bỏ qua
    likeBtn.addEventListener('click', () => swipeCard('like'));
    dislikeBtn.addEventListener('click', () => swipeCard('dislike'));

    // Bắt đầu hiển thị thẻ đầu tiên khi trang được tải hoàn chỉnh
    renderCard();
});
        
