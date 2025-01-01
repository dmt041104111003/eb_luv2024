(function() {
    var animation = {
        newYear: document.querySelector(".new-year"),
        range: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        get period() {
            var dateFuture = this.getTargetDate();
            var dateNow = new Date();
            var seconds = Math.floor((dateFuture - (dateNow)) / 1000);
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            var days = Math.floor(hours / 24);
            hours = hours - (days * 24);
            minutes = minutes - (days * 24 * 60) - (hours * 60);
            seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
            return {
                year: dateFuture.getFullYear(),
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }
        },

        // Khởi tạo ẩn notification
        initialize: function() {
            const notification = document.querySelector('.notification2');
            if (notification) {
                notification.style.display = 'none';
            }
        },

        // Hiển thị bảng thông báo
        showNotification: function() {
            const notification = document.querySelector('.notification2');
            if (notification) {
                notification.style.display = 'flex';
                notification.classList.add('show');

                // Đóng thông báo khi click vào nút
                const closeButtons = document.querySelectorAll('.notification-button2');
                closeButtons.forEach(button => {
                    button.onclick = function() {
                        notification.style.display = 'none';
                    };
                });
            }
        },

        startCountdown: function() {
            // Khởi tạo ẩn notification ngay khi bắt đầu
            this.initialize();

            const targetTime = this.getTargetDate().getTime();
            const interval = setInterval(() => {
                const currentTime = new Date().getTime();
                const remainingTime = targetTime - currentTime;

                if (remainingTime <= 0) {
                    clearInterval(interval);
                    this.showNotification();
                }
            }, 1000);
        },

        getTargetDate: function() {
            const year = 2025;
            const month = 11; // Lưu ý: tháng bắt đầu từ 0 (0-11)
            const day = 31;
            const hour = 23;
            const minute = 59;
            const second = 50;
            return new Date(year, month, day, hour, minute, second);
        }
    };

    animation.startCountdown();
})();