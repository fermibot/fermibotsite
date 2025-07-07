function createSlideshow(options) {
    // Destructure options with defaults
    const {
        containerId,
        slideInterval = 200,
        totalSlides = 52,
        basePath = 'Quick_Sort/',
        filePrefix = 'Quick_Sort_',
        paddingLength = 5,
        finalSlideRepeats = 0,
        startIndex = 1  // New parameter with default value 1
    } = options;

    // Get container element
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found`);
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Create slides
    const slides = [];
    for (let i = 0; i < totalSlides; i++) {
        const slide = document.createElement('img');
        // Calculate slide number based on startIndex
        const slideNumber = startIndex === 0 ? i : i + 1;
        const num = String(slideNumber).padStart(paddingLength, '0');
        slide.src = `${basePath}${filePrefix}${num}.svg`;
        slide.className = 'slide';
        if (i === 0) slide.classList.add('active');
        container.appendChild(slide);
        slides.push(slide);
    }

    // Slideshow functionality
    let currentIndex = 0;
    let intervalId;
    let repeatCount = 0;
    let isRepeating = false;

    function showNextSlide() {
        slides[currentIndex].classList.remove('active');

        // Check if we're at the final slide and repeats are requested
        if (currentIndex === slides.length - 1 && finalSlideRepeats > 0) {
            if (repeatCount < finalSlideRepeats) {
                // Repeat the final slide
                repeatCount++;
                isRepeating = true;
                slides[currentIndex].classList.add('active');
                return;
            } else {
                // Reset after final repeats
                repeatCount = 0;
                isRepeating = false;
                currentIndex = 0;
            }
        } else {
            // Normal slide progression
            currentIndex = (currentIndex + 1) % slides.length;
            isRepeating = false;
        }

        slides[currentIndex].classList.add('active');
    }

    function start() {
        if (slides.length > 0) {
            intervalId = setInterval(showNextSlide, slideInterval);
        }
    }

    // Initialize slideshow
    start();

    // Return control functions
    return {
        stop: () => clearInterval(intervalId),
        restart: () => {
            clearInterval(intervalId);
            slides[currentIndex].classList.remove('active');
            currentIndex = 0;
            repeatCount = 0;
            isRepeating = false;
            slides[currentIndex].classList.add('active');
            start();
        },
        getConfig: () => ({
            paddingLength,
            totalSlides,
            basePath,
            filePrefix,
            finalSlideRepeats
        }),
        getStatus: () => ({
            currentSlide: currentIndex + 1,
            totalSlides: slides.length,
            isRepeating,
            repeatCount,
            remainingRepeats: finalSlideRepeats - repeatCount
        })
    };
}