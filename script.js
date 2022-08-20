const fileInput = document.querySelector('[data-image-input]');
const chooseImgBtn = document.querySelector('[data-choose-img]');
const previewImg = document.querySelector('[data-preview-img]');
const container = document.querySelector('[data-container]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');
const filterValue = document.querySelector('[data-filter-value]');
let filterName = document.querySelector('[data-filter-name]');
const filterSlider = document.querySelector('[data-filter-slider]');
const rotateBtn = document.querySelectorAll('[data-rotate]');
const resetBtn = document.querySelector('[data-reset]');
const saveBtn = document.querySelector('[data-save-img]');

let brightness = 100;
let saturation = 100;
let inversion = 0;
let grayscale = 0;
let rotate = 0;
let flipHorizontal = 1;
let flipVertical = 1;

const loadImage = ()=> {
    let file = fileInput.files[0];
    if(!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener('load', ()=>{
        container.classList.remove('disable');
    })
    resetFilter();
}

filterBtn.forEach(option =>{
    option.addEventListener('click', ()=>{
        document.querySelector('.filter .active').classList.remove('active');
        option.classList.add('active');
        filterName.innerText = option.innerHTML;
        if (option.id === 'brightness'){
            filterSlider.max = '200';
            filterValue.innerText = `${brightness}%`;
        }else if (option.id === 'saturation'){
            filterSlider.max = '200';
            filterValue.innerText = `${saturation}%`;
        }else if (option.id === 'inversion'){
            filterSlider.max = '100';
            filterValue.innerText = `${inversion}%`;
        }else{
            filterSlider.max = '100';
            filterValue.innerText = `${grayscale}%`;
        }
    })
})

rotateBtn.forEach(button =>{
    button.addEventListener('click', ()=>{
        if(button.id === 'left'){
            rotate -= 90;
        } else if(button.id === 'right'){
            rotate += 90;
        } else if(button.id === 'horizontal'){
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }else{
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilters();
    })
})

const updateFilter = ()=>{
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector('.filter .active');
    if(selectedFilter.id === 'brightness'){
        brightness = filterSlider.value;
    } else if(selectedFilter.id === 'saturation'){
        saturation = filterSlider.value;
    } else if(selectedFilter.id === 'inversion'){
        inversion = filterSlider.value;
    } else{
        grayscale = filterSlider.value;
    }
    applyFilters();
}

const applyFilters =()=>{
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale})`;
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
}

const saveImage =()=>{
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if(rotate === 1){
        ctx.rotate(rotate(rotate * Math.PI / 100));
    }
    ctx.drawImage(previewImg, -canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
    const link = document.createElement('a');
    link.download = 'image.jpg';
    link.href = canvas.toDataURL();
    link.click();
}

const resetFilter = ()=>{
    brightness = 100;
    saturation = 100;
    inversion = 0;
    grayscale = 0;
    flipHorizontal = 1;
    flipVertical = 1;
    filterBtn[0].click();
    applyFilters();
}

chooseImgBtn.addEventListener('click', ()=> fileInput.click());
filterSlider.addEventListener('input', updateFilter);
fileInput.addEventListener('change', loadImage);
resetBtn.addEventListener('click', resetFilter);
saveBtn.addEventListener('click', saveImage);