// HEADER
// const headerNav = document.querySelector('.header-nav');

// if (headerNav) {
//     const initialHeaderHeight =
//         document.querySelector('.header-main').offsetHeight;
//     const originalBodyPadding = initialHeaderHeight;
//     const scrolledBodyPadding = originalBodyPadding - 10;

//     window.addEventListener('scroll', function () {
//         if (window.scrollY > 50) {
//             headerNav.classList.add('header-nav-scrolled');
//             document.querySelector('.app-wrap').style.paddingTop =
//                 scrolledBodyPadding + 'px';
//         } else {
//             headerNav.classList.remove('header-nav-scrolled');
//             document.querySelector('.app-wrap').style.paddingTop =
//                 originalBodyPadding + 'px';
//         }
//     });
// }

// BACK TO TOP
const backToTopBtn = document.getElementById('backToTopBtn');

if (backToTopBtn) {
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });
}

// ADMIN
const dropdownLinks = document.querySelectorAll(
    '.sidebar-nav-scroll .has-dropdown'
);

if (dropdownLinks) {
    dropdownLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const subMenu = this.nextElementSibling;
            this.classList.toggle('open');
            if (subMenu.style.maxHeight) {
                subMenu.style.maxHeight = null;
            } else {
                subMenu.style.maxHeight = subMenu.scrollHeight + 'px';
            }
        });
    });
}

// USER DROPDOWN
const userAvatarButton = document.querySelector('.user-avatar-button');
const userDropdownMenu = document.querySelector('.user-dropdown-menu');
if (userAvatarButton && userDropdownMenu) {
    userAvatarButton.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdownMenu.classList.toggle('open');
    });
}

// DROPDOWN TABLE
document.addEventListener('click', function (e) {
    if (
        userDropdownMenu &&
        !userDropdownMenu.contains(e.target) &&
        !userAvatarButton.contains(e.target)
    ) {
        userDropdownMenu.classList.remove('open');
    }

    const isDropdownButton = e.target.closest('[data-te-dropdown-toggle-ref]');
    const activeDropdowns = document.querySelectorAll('.action-dropdown.show');

    if (isDropdownButton) {
        const dropdown = isDropdownButton
            .closest('[data-te-dropdown-ref]')
            .querySelector('.action-dropdown');
        const isAlreadyOpen = dropdown.classList.contains('show');

        activeDropdowns.forEach((d) => d.classList.remove('show'));

        if (!isAlreadyOpen) {
            dropdown.classList.add('show');
        }
    } else {
        activeDropdowns.forEach((dropdown) => {
            dropdown.classList.remove('show');
        });
    }
});
