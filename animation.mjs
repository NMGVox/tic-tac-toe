export function fadeIn (ele) {
    var fadeEffectIn = setInterval(function () {
        if (!ele.style.opacity){
            ele.style.opacity = 0.1;
        } 
        if (ele.style.opacity < 1) {
            ele.style.opacity += 0.1;
        } else {
            clearInterval(fadeEffectIn);
        }
    }, 100);

}