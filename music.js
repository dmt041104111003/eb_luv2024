// Lấy tất cả các phần tử `.item` và lắng nghe sự kiện click
document.querySelectorAll(".item").forEach((item) => {
    item.addEventListener("click", (event) => {
        event.stopPropagation(); // Ngăn không cho sự kiện click lan ra ngoài
        // Xác định id của phần tử được click
        const audioId = `${item.id}-sound`;
        const audioElement = document.getElementById(audioId);

        // Nếu tìm thấy audio, phát nhạc tương ứng
        if (audioElement) {
            // Dừng tất cả các audio đang phát trước đó
            document.querySelectorAll("audio").forEach((audio) => {
                audio.pause();
                audio.currentTime = 0;
            });

            // Phát nhạc cho audio tương ứng
            audioElement.play();
            audioElement.loop = true;
        }
    });
});

// Lắng nghe sự kiện click trên toàn bộ document
document.addEventListener("click", () => {
    // Dừng tất cả các audio khi click ra ngoài
    document.querySelectorAll("audio").forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;

    });
});