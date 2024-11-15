
document.addEventListener('DOMContentLoaded', () => {
    activeStatsLink();
});

function activeStatsLink() {
    let links = document.getElementById('sidebarLinks');
    for (let i = 0; i < links.children.length; i++) {
        links.children[i].classList.remove('activeLink');   
    }
    links.children[2].classList.add('activeLink');
}
