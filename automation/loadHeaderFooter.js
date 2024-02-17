function loadHeaderFooter(headerPath, footerPath) {
    document.addEventListener("DOMContentLoaded", function () {
        // Load the header
        fetch(headerPath)
            .then(response => response.text())
            .then(html => {
                document.getElementById("header-placeholder").innerHTML = html;
            });

        // Load the footer
        fetch(footerPath)
            .then(response => response.text())
            .then(html => {
                document.getElementById("footer-placeholder").innerHTML = html;
            });
    });
}