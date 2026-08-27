/* ===============================
   PJ 1 | IGNITE
   ALBUM SYSTEM
================================ */


const albums = {

    class: {

        title: "CLASS MOMENTS",

        photos: [
            "images/class/class01.jpeg",
        ]

    },


    sports: {

        title: "SPORTS & ACTIVITIES",

        photos: [
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
            "https://images.unsplash.com/photo-1517649763962-0c623066013b",
            "https://images.unsplash.com/photo-1538805060514-97d9cc17730c",
            "https://images.unsplash.com/photo-1552674605-db6ffd4facb5",
            "https://images.unsplash.com/photo-1518611012118-696072aa579a",
            "https://images.unsplash.com/photo-1579952363873-27f3bade9f55"
        ]

    },


    achievement: {

        title: "ACHIEVEMENTS",

        photos: [
            "https://images.unsplash.com/photo-1560089000-7433a4ebbd64",
            "https://images.unsplash.com/photo-1530549387789-4c1017266635",
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
            "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
            "https://images.unsplash.com/photo-1552674605-db6ffd4facb5",
            "https://images.unsplash.com/photo-1517649763962-0c623066013b"
        ]

    },


    random: {

        title: "RANDOM MOMENTS",

        photos: [
            "https://images.unsplash.com/photo-1527529482837-4698179dc6ce",
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
            "https://images.unsplash.com/photo-1511632765486-a01980e01a18",
            "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70",
            "https://images.unsplash.com/photo-1543269865-cbf427effbad",
            "https://images.unsplash.com/photo-1517457373958-b7bdd4587205"
        ]

    }

};


/* OPEN ALBUM */

function openAlbum(type) {

    const album = albums[type];

    const modal =
        document.getElementById("albumModal");

    const title =
        document.getElementById("albumName");

    const photos =
        document.getElementById("photos");


    title.textContent = album.title;

    photos.innerHTML = "";


    album.photos.forEach(function(url) {

        const box =
            document.createElement("div");

        const image =
            document.createElement("img");

        image.src = url;

        image.alt = album.title;


        box.appendChild(image);


        box.onclick = function() {

            openImage(url);

        };


        photos.appendChild(box);

    });


    modal.classList.add("active");

    document.body.style.overflow = "hidden";

}


/* CLOSE ALBUM */

function closeAlbum() {

    document
        .getElementById("albumModal")
        .classList.remove("active");

    document.body.style.overflow = "auto";

}


/* OPEN IMAGE */

function openImage(url) {

    document
        .getElementById("bigImage")
        .src = url;

    document
        .getElementById("imageModal")
        .classList.add("active");

}


/* CLOSE IMAGE */

function closeImage() {

    document
        .getElementById("imageModal")
        .classList.remove("active");

}


/* ESC */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeImage();
            closeAlbum();

        }

    }
);
