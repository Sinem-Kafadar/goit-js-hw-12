import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


import { fetchImages } from "./js/pixabay-api.js"; 
import { createGalleryMarkup } from "./js/render-functions.js";

const form = document.querySelector("#search-form");
const gallery = document.querySelector("#gallery");
const loader = document.querySelector("#loader");
const loadMoreBtn = document.querySelector("#load-more");

let query = "";
let page = 1;
const perPage = 40; 

let lightbox = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionDelay: 250,
});

form.addEventListener("submit", handleSearch);
loadMoreBtn.addEventListener("click", handleLoadMore);

// 1. İLK ARAMA BAŞLADIĞINDA
async function handleSearch(event) {
    event.preventDefault();

    const searchWord = event.currentTarget.elements.searchQuery.value.trim();

    if (searchWord === "") {
        iziToast.warning({
            title: "Uyarı",
            message: "Lütfen bir arama terimi girin!",
            position: "topRight"
        });
        return;
    }

    query = searchWord; 
    page = 1; 

    gallery.innerHTML = ""; 
    loadMoreBtn.classList.add("hidden"); 
    loader.classList.remove("hidden"); 

    try {
        const data = await fetchImages(query, page);

        if (data.hits.length === 0) {
            iziToast.error({
                message: "Sorry, there are no images matching your search query. Please try again!",
                position: "topRight"
            });
            return;
        }

        const markup = createGalleryMarkup(data.hits);
        gallery.innerHTML = markup;

        lightbox.refresh();

        // Koleksiyon sonu kontrolü
        if (data.totalHits <= page * perPage) {
            loadMoreBtn.classList.add("hidden"); 
            iziToast.info({
                message: "We're sorry, but you've reached the end of search results.",
                position: "topRight"
            });
        } else {
            loadMoreBtn.classList.remove("hidden");
        }

    } catch (error) {
        console.error(error);
        iziToast.error({
            title: "Hata",
            message: "Bir şeyler ters gitti, lütfen daha sonra tekrar deneyin.",
            position: "topRight"
        });
    } finally {
        loader.classList.add("hidden");
        form.reset();
    }
}

// 2. DAHA FAZLA YÜKLE DENİLDİĞİNDE
async function handleLoadMore() {
    page += 1; 

    loadMoreBtn.classList.add("hidden"); 
    loader.classList.remove("hidden"); 

    try {
        const data = await fetchImages(query, page);

        const markup = createGalleryMarkup(data.hits);
        gallery.insertAdjacentHTML("beforeend", markup);

        lightbox.refresh();

        // -----------------------------------------------------------------
        // --- OTOMATİK DÜZGÜN KAYDIRMA (Burayı yeni ekledik) ---
        // -----------------------------------------------------------------
        // NOT: Eğer render-functions.js içinde kartlara verdiğin class adı 
        // "gallery-item" değilse, aşağıdaki tırnak içindeki ismi ona göre değiştir!
        const galleryItem = document.querySelector(".gallery-item"); 
        
        if (galleryItem) {
            const rect = galleryItem.getBoundingClientRect();
            const cardHeight = rect.height; 

            window.scrollBy({
                top: cardHeight * 2, // Sayfayı 2 kart boyutu aşağı kaydırır
                behavior: "smooth"  // Yumuşak kaydırma efekti verir
            });
        }
        // -----------------------------------------------------------------

        // Koleksiyon sonu kontrolü
        if (page * perPage >= data.totalHits) {
            loadMoreBtn.classList.add("hidden"); 
            iziToast.info({
                message: "We're sorry, but you've reached the end of search results.",
                position: "topRight"
            });
        } else {
            loadMoreBtn.classList.remove("hidden"); 
        }

    } catch (error) {
        console.error(error);
        iziToast.error({
            title: "Hata",
            message: "Yeni resimler yüklenirken bir hata oluştu.",
            position: "topRight"
        });
    } finally {
        loader.classList.add("hidden"); 
    }
}