function loadHeaderFooter(headerPath, footerPath) {
    document.addEventListener("DOMContentLoaded", function () {

        // Load the header
        fetch(headerPath)
            .then(response => response.text())
            .then(html => {
                document.getElementById("header-placeholder").innerHTML = html;
            });

        // Load the footer
        // fetch(footerPath)
        //     .then(response => response.text())
        //     .then(html => {
        //         document.getElementById("footer-placeholder").innerHTML = html;
        //     });


    });
}

function loadThemeIcons(themePath) {
    document.addEventListener("DOMContentLoaded", function () {
        // Load the header
        fetch(themePath)
            .then(response => response.text())
            .then(html => {
                document.getElementById("theme_icons_placeholder").innerHTML = html;
            });
    });
}


function styleImageIcons(className) {
    const elements = document.getElementsByClassName(className);
    const lightColors = [
        '#E0FFFF', '#E6E6FA', '#ADD8E6', '#87CEFA', '#B0E0E6',
        '#AFEEEE', '#98FB98', '#90EE90', '#F0E68C', '#FAFAD2',
        '#FFFFE0', '#FFB6C1', '#FFC0CB', '#FFDAB9', '#FFE4B5',
        '#FFE4E1', '#FFEFD5', '#D3D3D3', '#DCDCDC', '#E0E0E0',
        '#F0F0F0', '#F5F5F5', '#F5DEB3', '#EEE8AA', '#D2B48C',
        '#BC8F8F', '#DEB887', '#FFF0F5', '#FFF5EE', '#F0FFF0',
        '#F5FFFA', '#F0F8FF', '#F8F8FF', '#FAF0E6', '#FAEBD7',
        '#FDF5E6', '#FFFAF0'
    ];

    Array.from(elements).forEach(element => {
        // Randomly select a light color
        const randomColor = lightColors[Math.floor(Math.random() * lightColors.length)];


        // Apply styles to each element
        element.style.width = '256px';
        element.style.height = '256px';
        element.style.objectFit = 'cover';
        element.style.borderRadius = '50%';
        element.style.border = `2px solid ${'lightblue'}`;
        element.style.background = 'white';
        element.style.padding = '5px';
        element.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        element.style.display = 'block';
        element.style.marginLeft = 'auto';
        element.style.marginRight = 'auto';
        element.style.transition = 'transform 0.3s ease, border-color 0.5s ease';

        // Add hover effect
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.05)';
            element.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
            element.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Usage example:
document.addEventListener('DOMContentLoaded', () => {
    styleImageIcons('icon-image');
});