function checkBirthdayTime() {
    const targetDateTime = new Date("2024-12-30T22:19:00");
    const now = new Date();

    // Kiểm tra nếu thời gian hiện tại là 22:10:50 ngày 31/12/2024
    if (now >= targetDateTime && now < new Date(targetDateTime.getTime() + 1000)) {
        const birthdayNotification = document.getElementById('birthday-notification');
        if (birthdayNotification) {
            birthdayNotification.style.display = 'flex'; // Hiển thị thông báo
        }
    }
}

function closeBirthdayNotification() {
    const notification = document.getElementById('birthday-notification');
    if (notification) {
        notification.style.display = 'none'; // Đóng thông báo
    }
}

setInterval(checkBirthdayTime, 1000); // Kiểm tra mỗi giây