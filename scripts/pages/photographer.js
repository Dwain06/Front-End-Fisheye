//Get the "id" parameter in URL
const photographerUrl = window.location.search;
const urlParams = new URLSearchParams(photographerUrl);
const photographerId = urlParams.get('id')

async function getPhotographers() {
    return fetch("../data/photographers.json")
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (data) {
            return data;
        })
        .catch(function (err) {
            alert("Erreur : " + err);
        });
}

async function displayData(medias, photographer) {
    const photographHeader = document.querySelector(".photograph-header");
    const mediasSection = document.querySelector("#medias_section");
    let likesCount = 0;

    //Create section for each media in DOM
    medias.forEach((media) => {
        const photographerMedia = new MediaFactory(media, photographer);
        const mediaCardDOM = photographerMedia.getMediaCardDOM();
        mediasSection.appendChild(mediaCardDOM.figure);

        likesCount += photographerMedia.likes;
    });

    //Create the header of photographer's informations
    const photographerInfo = new PhotographerFactory(photographer);
    const {photographerPic, photographerName, divPhotographerInfos} = photographerInfo.getPhotographerInfos();
    photographerPic.setAttribute("alt", photographerName);
    photographHeader.appendChild(photographerPic);
    photographHeader.insertBefore(divPhotographerInfos, photographHeader.firstChild);

    //Create card of likes count and price
    const divLikesPrice = document.createElement('div');
    divLikesPrice.classList.add('likes-price');
    divLikesPrice.innerHTML = `<span class="likes-count">${likesCount}</span><i class="fa-solid fa-heart"></i><span>${photographerInfo.price}€ / jour</span>`;
    mediasSection.appendChild(divLikesPrice);

    //Insert photographer's name in contact modal
    const modalH2 = document.querySelector(".modal h2");
    modalH2.insertAdjacentHTML('beforeend', '<br/>' + photographerName);
};

//Like btn incrementation
async function likesClick() {
    const likeBtn = document.querySelectorAll(".likes i");
    const totalLikes = document.querySelector(".likes-count");
    
    likeBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
            const likeNumber = btn.parentNode.firstChild;

            if (btn.classList.contains('fa-regular')) {
                btn.classList.replace('fa-regular', 'fa-solid');
                likeNumber.textContent = (parseInt(likeNumber.textContent) + 1);
                totalLikes.textContent = (parseInt(totalLikes.textContent) + 1);
                
            } else if (btn.classList.contains('fa-solid')){
                btn.classList.replace('fa-solid', 'fa-regular');
                likeNumber.textContent = (parseInt(likeNumber.textContent) - 1);
                totalLikes.textContent = (parseInt(totalLikes.textContent) - 1);
            }
        });
    })
};

async function init() {
    //Get data for photographers and media
    const { photographers, media } = await getPhotographers();
    const currentPhotographer = photographers.find(id => id.id == photographerId)
    const mediasOfPhotographer = media.filter(media => media.photographerId == photographerId)
    // const mediasSortLikes = mediasOfPhotographer.sort((a, b) => (b.likes - a.likes));
    // const mediasSortTitle = mediasOfPhotographer.sort((a, b) => (a.title - b.title));
    // const mediasSortDate = mediasOfPhotographer.sort((a, b) => (b.date - a.date));
    // console.log(mediasSortTitle);

    displayData(mediasOfPhotographer, currentPhotographer);

    likesClick();

    Lightbox.init()
};

init();