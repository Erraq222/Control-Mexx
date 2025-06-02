document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('card');
    const cardImage = document.getElementById('card-image');
    const cardName = document.getElementById('card-name');
    const cardDescription = document.getElementById('card-description');
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const resultMessage = document.getElementById('result-message');

    // Dữ liệu các "đối tượng" để quẹt
    const profiles = [
        {
            name: "Hồng Nhung",
            description: "Cô gái năng động, thích cà phê và những chuyến đi",
            image: "images/image1.jpg"
        },
        {
            name: "Minh Anh",
            description: "Yêu mèo, thích đọc sách và khám phá ẩm thực",
            image: "images/image2.jpg"
        },
        {
            name: "Lan Hương",
            description: "Đam mê nghệ thuật, thích vẽ và nghe nhạc indie",
            image: "images/image3.jpg"
        },
        {
            name: "Ngọc Mai",
            description: "Thích thể thao, đặc biệt là chạy bộ và bơi lội",
            image: "images/image4.jpg"
        },
        {
            name: "Thùy Linh",
            description: "Nhiệt tình, hài hước, thích kể chuyện cười",
            image: "images/image5.jpg"
        },
        // Thêm nhiều profile khác của những cô gái đáng yêu vào đây nhé!
        // VD:
        // {
        //     name: "Tên Người Khác",
        //     description: "Mô tả về người khác",
        //     image: "images/image6.jpg"
        // }
    ];

    let currentProfileIndex = 0;
    let startX = 0;
    let startY = 0;
    let isDragging = false;

    // Hàm tải profile mới
    function loadProfile() {
        if (currentProfileIndex < profiles.length) {
            const profile = profiles[currentProfileIndex];
            cardImage.src = profile.image;
            cardName.textContent = profile.name;
            cardDescription.textContent = profile.description;
            card.style.transform = 'translate(0, 0) rotate(0deg)'; // Đặt lại vị trí thẻ
            card.style.opacity = 1; // Đảm bảo thẻ hiển thị
            card.style.zIndex = profiles.length - currentProfileIndex; // Để thẻ mới ở trên
            resultMessage.classList.remove('show', 'like', 'dislike'); // Ẩn tin nhắn kết quả
        } else {
            // Khi hết profile để quẹt
            card.style.display = 'none';
            resultMessage.textContent = "Hết người để quẹt rồi bé ơi! Để anh tìm thêm cho nhé 😘";
            resultMessage.classList.add('show', 'like'); // Hiển thị tin nhắn kết thúc game
            noBtn.disabled = true;
            yesBtn.disabled = true;
        }
    }

    // Hàm xử lý khi quẹt/nhấn nút
    function handleSwipe(direction) {
        let message = '';
        let messageClass = '';

        if (direction === 'yes') {
            card.classList.add('right');
            message = `Ô là la! Em thích ${cardName.textContent} nè! ❤️`;
            messageClass = 'like';
        } else {
            card.classList.add('left');
            message = `Thôi next đi nè ${cardName.textContent}! 🙅‍♀️`;
            messageClass = 'dislike';
        }

        resultMessage.textContent = message;
        resultMessage.classList.add('show', messageClass);

        // Chờ animation hoàn thành rồi mới tải profile mới
        setTimeout(() => {
            currentProfileIndex++;
            card.classList.remove('left', 'right'); // Xóa class để reset cho lần sau
            loadProfile();
        }, 300); // Thời gian trùng với transition trong CSS
    }

    // --- Xử lý kéo thả (Swipe) ---
    card.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        card.classList.add('moving');
    });

    card.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Ngăn cuộn trang
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        card.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${deltaX / 20}deg)`;
        card.style.opacity = 1 - Math.abs(deltaX) / window.innerWidth; // Giảm độ mờ khi kéo ra xa
    });

    card.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('moving');

        const deltaX = e.clientX - startX;
        const threshold = window.innerWidth / 4; // Ngưỡng để xác định quẹt

        if (deltaX > threshold) {
            handleSwipe('yes');
        } else if (deltaX < -threshold) {
            handleSwipe('no');
        } else {
            // Quay lại vị trí ban đầu nếu chưa đủ ngưỡng
            card.style.transform = 'translate(0, 0) rotate(0deg)';
            card.style.opacity = 1;
        }
    });

    // --- Xử lý sự kiện chạm (Touch for mobile) ---
    card.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        card.classList.add('moving');
    });

    card.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Ngăn cuộn trang
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;

        card.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${deltaX / 20}deg)`;
        card.style.opacity = 1 - Math.abs(deltaX) / window.innerWidth;
    });

    card.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('moving');

        const deltaX = e.changedTouches[0].clientX - startX;
        const threshold = window.innerWidth / 4;

        if (deltaX > threshold) {
            handleSwipe('yes');
        } else if (deltaX < -threshold) {
            handleSwipe('no');
        } else {
            card.style.transform = 'translate(0, 0) rotate(0deg)';
            card.style.opacity = 1;
        }
    });


    // --- Xử lý nút bấm ---
    noBtn.addEventListener('click', () => {
        handleSwipe('no');
    });

    yesBtn.addEventListener('click', () => {
        handleSwipe('yes');
    });

    // Tải profile đầu tiên khi trang được load
    loadProfile();
});
