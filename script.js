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
    },


    sports: {

        title: "SPORTS & ACTIVITIES",

    },


    achievement: {

        title: "ACHIEVEMENTS",

    },


    random: {

        title: "RANDOM MOMENTS",

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
