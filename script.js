/* ===============================
   PJ 1 | IGNITE
   ALBUM SYSTEM + SUPABASE
================================ */


/* ===============================
   SUPABASE CONFIG
================================ */

const SUPABASE_URL =
    "https://vhoazzkzxzcqzsjyyhht.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_JiLCVIPolC5-Fq4AOh1fsQ_7lVljdLD";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* ===============================
   ALBUMS
================================ */

const albums = {

    class: {

        title: "CLASS MOMENTS",

        photos: [
            "images/class/class01.jpeg"
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


/* ===============================
   CURRENT ALBUM
================================ */

let currentAlbum = "";


/* ===============================
   OPEN ALBUM
================================ */

async function openAlbum(type) {

    currentAlbum = type;

    const album = albums[type];

    const modal =
        document.getElementById("albumModal");

    const title =
        document.getElementById("albumName");

    const photos =
        document.getElementById("photos");


    title.textContent = album.title;

    photos.innerHTML = "";


    /* OLD PHOTOS */

    album.photos.forEach(function(url) {

        createPhotoBox(
            url,
            album.title,
            photos,
            false
        );

    });


    /* SUPABASE PHOTOS */

    await loadSupabasePhotos();


    modal.classList.add("active");

    document.body.style.overflow = "hidden";

}


/* ===============================
   CREATE PHOTO
================================ */

function createPhotoBox(
    url,
    title,
    container,
    downloadable = false,
    fileName = ""
) {

    const box =
        document.createElement("div");


    const image =
        document.createElement("img");


    image.src = url;

    image.alt = title;


    box.appendChild(image);


    /* OPEN FULL IMAGE */

    box.onclick = function() {

        openImage(url);

    };


    /* DOWNLOAD */

    if (downloadable) {

        const download =
            document.createElement("a");


        download.href = url;

        download.download =
            fileName || "ignite-photo";

        download.target = "_blank";

        download.textContent =
            "⬇ DOWNLOAD";


        download.className =
            "download-photo";


        download.onclick =
            function(event) {

                event.stopPropagation();

            };


        box.appendChild(download);

    }


    container.appendChild(box);

}


/* ===============================
   LOAD SUPABASE PHOTOS
================================ */

async function loadSupabasePhotos() {

    if (!currentAlbum) return;


    const photos =
        document.getElementById("photos");


    const {
        data,
        error
    } =
        await supabaseClient.storage
            .from("ignite-photos")
            .list(currentAlbum, {

                limit: 100,

                sortBy: {
                    column: "created_at",
                    order: "desc"
                }

            });


    if (error) {

        console.error(
            "Error loading Supabase photos:",
            error
        );

        return;

    }


    if (!data) return;


    data.forEach(function(file) {

        if (!file.name) return;


        const filePath =
            currentAlbum +
            "/" +
            file.name;


        const {
            data: publicUrlData
        } =
            supabaseClient.storage
                .from("ignite-photos")
                .getPublicUrl(filePath);


        createPhotoBox(

            publicUrlData.publicUrl,

            albums[currentAlbum].title,

            photos,

            true,

            file.name

        );

    });

}


/* ===============================
   UPLOAD PHOTO
================================ */

async function uploadPhoto() {

    const input =
        document.getElementById("photoInput");


    const file =
        input.files[0];


    if (!file) return;


    if (!currentAlbum) {

        alert(
            "Please open an album first."
        );

        input.value = "";

        return;

    }


    /* CHECK IMAGE */

    if (!file.type.startsWith("image/")) {

        alert(
            "Please select an image file."
        );

        input.value = "";

        return;

    }


    /* FILE SIZE - MAX 10MB */

    if (file.size > 10 * 1024 * 1024) {

        alert(
            "Image is too large. Maximum size is 10MB."
        );

        input.value = "";

        return;

    }


    /* FILE NAME */

    const safeName =
        file.name
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9._-]/g, "");


    const fileName =
        Date.now() +
        "-" +
        safeName;


    const filePath =
        currentAlbum +
        "/" +
        fileName;


    try {

        alert(
            "Uploading photo... 📸"
        );


        const {
            error
        } =
            await supabaseClient.storage
                .from("ignite-photos")
                .upload(
                    filePath,
                    file
                );


        if (error) {

            console.error(error);


            alert(
                "Upload failed:\n\n" +
                error.message
            );


            return;

        }


        alert(
            "Photo uploaded successfully! 🔥"
        );


        input.value = "";


        /* REFRESH */

        await refreshAlbum();

    }


    catch (error) {

        console.error(error);


        alert(
            "Something went wrong while uploading."
        );

    }

}


/* ===============================
   REFRESH ALBUM
================================ */

async function refreshAlbum() {

    if (!currentAlbum) return;


    const photos =
        document.getElementById("photos");


    photos.innerHTML = "";


    /* OLD PHOTOS */

    albums[currentAlbum].photos
        .forEach(function(url) {

            createPhotoBox(

                url,

                albums[currentAlbum].title,

                photos,

                false

            );

        });


    /* SUPABASE */

    await loadSupabasePhotos();

}


/* ===============================
   CLOSE ALBUM
================================ */

function closeAlbum() {

    document
        .getElementById("albumModal")
        .classList
        .remove("active");


    document.body.style.overflow =
        "auto";

}


/* ===============================
   OPEN FULL IMAGE
================================ */

function openImage(url) {

    document
        .getElementById("bigImage")
        .src = url;


    document
        .getElementById("imageModal")
        .classList
        .add("active");

}


/* ===============================
   CLOSE FULL IMAGE
================================ */

function closeImage() {

    document
        .getElementById("imageModal")
        .classList
        .remove("active");

}


/* ===============================
   ESC KEY
================================ */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeImage();

            closeAlbum();

        }

    }
);
