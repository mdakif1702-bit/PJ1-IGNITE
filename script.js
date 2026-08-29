/* ===============================
   PJ 1 | IGNITE
   SUPABASE PHOTO SYSTEM
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
   STORAGE BUCKET
================================ */

const BUCKET_NAME =
    "ignite-photos";


/* ===============================
   ALBUMS
================================ */

const albums = {

    class: {
        title: "CLASS MOMENTS"
    },

    sports: {
        title: "SPORTS & ACTIVITIES"
    },

    achievement: {
        title: "ACHIEVEMENTS"
    },

    random: {
        title: "RANDOM MOMENTS"
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

    const modal =
        document.getElementById("albumModal");

    const title =
        document.getElementById("albumName");

    const photos =
        document.getElementById("photos");


    title.textContent =
        albums[type].title;


    photos.innerHTML =
        "<p class='loading'>LOADING PHOTOS...</p>";


    modal.classList.add("active");

    document.body.style.overflow =
        "hidden";


    await loadSupabasePhotos();

}


/* ===============================
   LOAD SUPABASE PHOTOS
================================ */

async function loadSupabasePhotos() {

    if (!currentAlbum) return;


    const photos =
        document.getElementById("photos");


    photos.innerHTML = "";


    const {
        data,
        error
    } =
        await supabaseClient
            .storage
            .from(BUCKET_NAME)
            .list(
                currentAlbum,
                {
                    limit: 100,

                    sortBy: {
                        column: "created_at",
                        order: "desc"
                    }
                }
            );


    if (error) {

        console.error(
            "Error loading photos:",
            error
        );


        photos.innerHTML =
            "<p class='loading'>Unable to load photos.</p>";

        return;

    }


    if (!data || data.length === 0) {

        photos.innerHTML =
            "<p class='loading'>NO PHOTOS YET 📸</p>";

        return;

    }


    data.forEach(function(file) {

        if (!file.name) return;


        const filePath =
            currentAlbum +
            "/" +
            file.name;


        const {
            data: publicUrlData
        } =
            supabaseClient
                .storage
                .from(BUCKET_NAME)
                .getPublicUrl(
                    filePath
                );


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
   CREATE PHOTO BOX
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


    image.src =
        url;

    image.alt =
        title;


    box.appendChild(image);


    /* OPEN FULL IMAGE */

    box.onclick = function() {

        openImage(url);

    };


    /* DOWNLOAD */

    if (downloadable) {

        const download =
            document.createElement("a");


        download.href =
            url;


        download.download =
            fileName ||
            "ignite-photo";


        download.target =
            "_blank";


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
   UPLOAD PHOTO
================================ */

async function uploadPhoto() {

    const input =
        document.getElementById(
            "photoInput"
        );


    const file =
        input.files[0];


    if (!file) return;


    /* CHECK ALBUM */

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


    /* MAX 10MB */

    if (
        file.size >
        10 * 1024 * 1024
    ) {

        alert(
            "Image is too large. Maximum size is 10MB."
        );

        input.value = "";

        return;

    }


    /* CLEAN FILE NAME */

    const safeName =
        file.name
            .replace(
                /\s+/g,
                "-"
            )
            .replace(
                /[^a-zA-Z0-9._-]/g,
                ""
            );


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
            await supabaseClient
                .storage
                .from(BUCKET_NAME)
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

        await loadSupabasePhotos();

    }


    catch (error) {

        console.error(error);


        alert(
            "Something went wrong while uploading."
        );

    }

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
