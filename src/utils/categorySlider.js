export function initCategorySlider() {
    const categoryViewport = document.querySelector(
        '.category-slider-viewport'
    );
    if (!categoryViewport) return null;

    const categoryGrid = document.querySelector('.category-grid');
    const categoryItems = document.querySelectorAll('.category-item');
    const categoryPrevBtn = document.querySelector('.category-prev-btn');
    const categoryNextBtn = document.querySelector('.category-next-btn');

    if (
        !categoryGrid ||
        categoryItems.length === 0 ||
        !categoryPrevBtn ||
        !categoryNextBtn
    )
        return null;

    function updateButtons() {
        const maxScrollLeft =
            categoryViewport.scrollWidth - categoryViewport.clientWidth;
        categoryPrevBtn.disabled = categoryViewport.scrollLeft < 1;
        categoryNextBtn.disabled =
            categoryViewport.scrollLeft >= maxScrollLeft - 1;
    }

    const nextHandler = () => {
        categoryViewport.scrollBy({
            left: categoryViewport.offsetWidth,
            behavior: 'smooth',
        });
    };

    const prevHandler = () => {
        categoryViewport.scrollBy({
            left: -categoryViewport.offsetWidth,
            behavior: 'smooth',
        });
    };

    categoryNextBtn.addEventListener('click', nextHandler);
    categoryPrevBtn.addEventListener('click', prevHandler);
    categoryViewport.addEventListener('scroll', updateButtons);

    updateButtons();

    return () => {
        categoryNextBtn.removeEventListener('click', nextHandler);
        categoryPrevBtn.removeEventListener('click', prevHandler);
        categoryViewport.removeEventListener('scroll', updateButtons);
    };
}
