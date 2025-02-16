export const hideAlert = () => {
    const elem = document.querySelector('.alert')
    if(elem) {
        elem.parentElement.removeChild(elem);
    }
}

export const displayAlert = (type, msg) => {
    hideAlert();
const markup = `<div class="alert alert--${type}">${msg}</div>`;
document.querySelector('body').insertAdjacentHTML('afterbegin',markup);
}