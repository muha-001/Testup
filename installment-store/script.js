/* ==============================================================
   AQSATY — MAIN JAVASCRIPT
   Three.js + GSAP + ScrollTrigger + VanillaTilt + Chart.js
============================================================== */


/* ==============================================================
   GLOBAL SETUP
============================================================== */

"use strict";


const reducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


/* ==============================================================
   REGISTER GSAP
============================================================== */

if (typeof gsap !== "undefined") {

    gsap.registerPlugin(ScrollTrigger);

}


/* ==============================================================
   PRELOADER
============================================================== */

window.addEventListener("load", () => {

    setTimeout(() => {

        const preloader =
            document.getElementById("preloader");

        if (preloader) {

            preloader.classList.add("hidden");

        }

        document.body.classList.add("loaded");

        startHeroAnimation();

    }, reducedMotion ? 200 : 900);

});


/* ==============================================================
   NAVBAR SCROLL
============================================================== */

const navbar =
    document.getElementById("navbar");

const backToTop =
    document.getElementById("backToTop");


function handleScroll() {

    const scrollY =
        window.scrollY;

    if (navbar) {

        navbar.classList.toggle(
            "scrolled",
            scrollY > 50
        );

    }

    if (backToTop) {

        backToTop.classList.toggle(
            "visible",
            scrollY > 600
        );

    }

}


window.addEventListener(
    "scroll",
    handleScroll,
    {
        passive: true
    }
);

handleScroll();


/* ==============================================================
   MOBILE MENU
============================================================== */

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );

const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );


if (mobileMenuBtn) {

    mobileMenuBtn.addEventListener(
        "click",
        () => {

            mobileMenu.classList.toggle(
                "open"
            );

        }
    );

}


document
    .querySelectorAll(".mobile-menu a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mobileMenu.classList.remove(
                    "open"
                );

            }
        );

    });


/* ==============================================================
   SMOOTH NAVIGATION
============================================================== */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetID =
                    link.getAttribute("href");

                if (
                    !targetID ||
                    targetID === "#"
                ) {

                    event.preventDefault();

                    return;

                }


                const target =
                    document.querySelector(
                        targetID
                    );

                if (!target) return;

                event.preventDefault();

                const offset =
                    navbar
                        ? navbar.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect()
                        .top +
                    window.scrollY -
                    offset;

                window.scrollTo({

                    top:
                        targetPosition,

                    behavior:
                        reducedMotion
                            ? "auto"
                            : "smooth"

                });

            }
        );

    });


/* ==============================================================
   ACTIVE NAVIGATION
============================================================== */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


const sectionObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting)
                    return;

                navLinks.forEach(link => {

                    link.classList.remove(
                        "active"
                    );

                    if (
                        link.getAttribute(
                            "href"
                        ) ===
                        `#${entry.target.id}`
                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                });

            });

        },
        {
            threshold: .35
        }
    );


sections.forEach(section => {

    sectionObserver.observe(section);

});


/* ==============================================================
   CUSTOM CURSOR
============================================================== */

const cursorDot =
    document.querySelector(
        ".cursor-dot"
    );

const cursorRing =
    document.querySelector(
        ".cursor-ring"
    );


if (
    cursorDot &&
    cursorRing &&
    !reducedMotion &&
    window.innerWidth > 900
) {

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;


    window.addEventListener(
        "mousemove",
        event => {

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;

            cursorDot.style.left =
                `${mouseX}px`;

            cursorDot.style.top =
                `${mouseY}px`;

        },
        {
            passive: true
        }
    );


    function animateCursor() {

        ringX +=
            (mouseX - ringX) * .13;

        ringY +=
            (mouseY - ringY) * .13;

        cursorRing.style.left =
            `${ringX}px`;

        cursorRing.style.top =
            `${ringY}px`;

        requestAnimationFrame(
            animateCursor
        );

    }

    animateCursor();


    document
        .querySelectorAll(
            "a, button, .product-card"
        )
        .forEach(element => {

            element.addEventListener(
                "mouseenter",
                () => {

                    document.body.classList.add(
                        "cursor-hover"
                    );

                }
            );

            element.addEventListener(
                "mouseleave",
                () => {

                    document.body.classList.remove(
                        "cursor-hover"
                    );

                }
            );

        });

}


/* ==============================================================
   THREE.JS HERO
============================================================== */

let threeScene;
let threeCamera;
let threeRenderer;

let phoneGroup;
let particles;

let targetRotationX = 0;
let targetRotationY = 0;


function initThreeJS() {

    const canvas =
        document.getElementById(
            "heroCanvas"
        );

    if (
        !canvas ||
        typeof THREE === "undefined"
    ) {

        return;

    }


    threeScene =
        new THREE.Scene();


    /* ----------------------------------------------------------
       CAMERA
    ---------------------------------------------------------- */

    threeCamera =
        new THREE.PerspectiveCamera(
            45,
            window.innerWidth /
            window.innerHeight,
            .1,
            100
        );


    threeCamera.position.set(
        0,
        0,
        8
    );


    /* ----------------------------------------------------------
       RENDERER
    ---------------------------------------------------------- */

    threeRenderer =
        new THREE.WebGLRenderer({

            canvas,

            alpha: true,

            antialias:
                window.devicePixelRatio < 2,

            powerPreference:
                "high-performance"

        });


    const pixelRatio =
        Math.min(
            window.devicePixelRatio,
            1.5
        );


    threeRenderer.setPixelRatio(
        pixelRatio
    );


    threeRenderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    threeRenderer.outputEncoding =
        THREE.sRGBEncoding;


    /* ----------------------------------------------------------
       LIGHTS
    ---------------------------------------------------------- */

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            .55
        );


    threeScene.add(
        ambientLight
    );


    const blueLight =
        new THREE.PointLight(
            0x2677ff,
            2.5,
            15
        );


    blueLight.position.set(
        4,
        2,
        4
    );


    threeScene.add(
        blueLight
    );


    const purpleLight =
        new THREE.PointLight(
            0x8c4dff,
            2,
            15
        );


    purpleLight.position.set(
        -4,
        -1,
        3
    );


    threeScene.add(
        purpleLight
    );


    const greenLight =
        new THREE.PointLight(
            0x42ff9a,
            1.8,
            12
        );


    greenLight.position.set(
        0,
        4,
        -3
    );


    threeScene.add(
        greenLight
    );


    /* ----------------------------------------------------------
       3D PRODUCT
    ---------------------------------------------------------- */

    phoneGroup =
        new THREE.Group();


    const bodyGeometry =
        new THREE.BoxGeometry(
            2.1,
            4.1,
            .42,
            12,
            12,
            12
        );


    const bodyMaterial =
        new THREE.MeshPhysicalMaterial({

            color:
                0x151b2b,

            metalness:
                .75,

            roughness:
                .22,

            clearcoat:
                1,

            clearcoatRoughness:
                .1

        });


    const phoneBody =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );


    phoneGroup.add(
        phoneBody
    );


    /* ----------------------------------------------------------
       SCREEN
    ---------------------------------------------------------- */

    const screenGeometry =
        new THREE.PlaneGeometry(
            1.87,
            3.83
        );


    const screenMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0x101b38,

            transparent:
                true,

            opacity:
                .98

        });


    const screen =
        new THREE.Mesh(
            screenGeometry,
            screenMaterial
        );


    screen.position.z =
        .225;


    phoneGroup.add(
        screen
    );


    /* ----------------------------------------------------------
       SCREEN GLOW
    ---------------------------------------------------------- */

    const glowGeometry =
        new THREE.PlaneGeometry(
            2.05,
            4
        );


    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0x2677ff,

            transparent:
                true,

            opacity:
                .07,

            side:
                THREE.DoubleSide

        });


    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );


    glow.position.z =
        .21;


    phoneGroup.add(
        glow
    );


    /* ----------------------------------------------------------
       CAMERA MODULE
    ---------------------------------------------------------- */

    const cameraModuleGeometry =
        new THREE.BoxGeometry(
            .65,
            .85,
            .12,
            6,
            6,
            6
        );


    const cameraModuleMaterial =
        new THREE.MeshPhysicalMaterial({

            color:
                0x090c13,

            metalness:
                .9,

            roughness:
                .18

        });


    const cameraModule =
        new THREE.Mesh(
            cameraModuleGeometry,
            cameraModuleMaterial
        );


    cameraModule.position.set(
        -.55,
        1.35,
        -.27
    );


    phoneGroup.add(
        cameraModule
    );


    /* ----------------------------------------------------------
       CAMERA LENSES
    ---------------------------------------------------------- */

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const lensGeometry =
            new THREE.CylinderGeometry(
                .14,
                .14,
                .08,
                24
            );


        const lensMaterial =
            new THREE.MeshPhysicalMaterial({

                color:
                    0x020307,

                metalness:
                    .9,

                roughness:
                    .08,

                clearcoat:
                    1

            });


        const lens =
            new THREE.Mesh(
                lensGeometry,
                lensMaterial
            );


        lens.rotation.x =
            Math.PI / 2;


        lens.position.set(

            -.68 +
                (i % 2) * .28,

            1.55 -
                Math.floor(i / 2) * .28,

            -.34

        );


        phoneGroup.add(
            lens
        );

    }


    phoneGroup.position.set(
        0,
        0,
        0
    );


    threeScene.add(
        phoneGroup
    );


    /* ----------------------------------------------------------
       PARTICLES
    ---------------------------------------------------------- */

    const particleCount =
        window.innerWidth < 700
            ? 450
            : 900;


    const positions =
        new Float32Array(
            particleCount * 3
        );


    const colors =
        new Float32Array(
            particleCount * 3
        );


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const i3 =
            i * 3;


        positions[i3] =
            (Math.random() - .5) * 18;

        positions[i3 + 1] =
            (Math.random() - .5) * 12;

        positions[i3 + 2] =
            (Math.random() - .5) * 12;


        const palette = [
            [0.15,0.47,1],
            [0.55,0.30,1],
            [0.25,1,.61]
        ];


        const color =
            palette[
                Math.floor(
                    Math.random() *
                    palette.length
                )
            ];


        colors[i3] =
            color[0];

        colors[i3 + 1] =
            color[1];

        colors[i3 + 2] =
            color[2];

    }


    const particleGeometry =
        new THREE.BufferGeometry();


    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    particleGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(
            colors,
            3
        )
    );


    const particleMaterial =
        new THREE.PointsMaterial({

            size:
                window.innerWidth < 700
                    ? .018
                    : .025,

            transparent:
                true,

            opacity:
                .55,

            vertexColors:
                true,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    particles =
        new THREE.Points(
            particleGeometry,
            particleMaterial
        );


    threeScene.add(
        particles
    );


    /* ----------------------------------------------------------
       MOUSE PARALLAX
    ---------------------------------------------------------- */

    window.addEventListener(
        "mousemove",
        event => {

            const normalizedX =
                (
                    event.clientX /
                    window.innerWidth
                ) * 2 - 1;


            const normalizedY =
                -(
                    event.clientY /
                    window.innerHeight
                ) * 2 + 1;


            targetRotationY =
                normalizedX * .28;


            targetRotationX =
                normalizedY * .18;

        },
        {
            passive: true
        }
    );


    /* ----------------------------------------------------------
       RESIZE
    ---------------------------------------------------------- */

    window.addEventListener(
        "resize",
        resizeThree
    );


    animateThree();

}


function resizeThree() {

    if (
        !threeCamera ||
        !threeRenderer
    ) {

        return;

    }


    threeCamera.aspect =
        window.innerWidth /
        window.innerHeight;


    threeCamera.updateProjectionMatrix();


    threeRenderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

}


function animateThree() {

    requestAnimationFrame(
        animateThree
    );


    if (!threeScene)
        return;


    const time =
        performance.now() * .001;


    if (phoneGroup) {

        phoneGroup.rotation.y +=
            (
                targetRotationY -
                phoneGroup.rotation.y
            ) * .025;


        phoneGroup.rotation.x +=
            (
                targetRotationX -
                phoneGroup.rotation.x
            ) * .025;


        phoneGroup.rotation.z =
            Math.sin(time * .55) * .025;


        phoneGroup.position.y =
            Math.sin(time * .8) * .08;

    }


    if (particles) {

        particles.rotation.y =
            time * .008;

        particles.rotation.x =
            Math.sin(time * .1) * .04;

    }


    threeRenderer.render(
        threeScene,
        threeCamera
    );

}


/* ==============================================================
   START THREE
============================================================== */

if (!reducedMotion) {

    initThreeJS();

}


/* ==============================================================
   HERO GSAP ANIMATION
============================================================== */

function startHeroAnimation() {

    if (
        reducedMotion ||
        typeof gsap === "undefined"
    ) {

        document
            .querySelectorAll(
                ".title-line, .hero-description, .hero-actions, .hero-stats"
            )
            .forEach(el => {

                el.style.opacity = 1;
                el.style.transform =
                    "translateY(0)";

            });

        return;

    }


    const tl =
        gsap.timeline({
            defaults: {
                ease:
                    "power3.out"
            }
        });


    tl.to(
        ".hero-badge",
        {
            opacity: 1,
            y: 0,
            duration: .7
        }
    );


    tl.to(
        ".title-line",
        {
            opacity: 1,
            y: 0,
            duration: .8,
            stagger: .13
        },
        "-=.3"
    );


    tl.to(
        ".hero-description",
        {
            opacity: 1,
            y: 0,
            duration: .7
        },
        "-=.35"
    );


    tl.to(
        ".hero-actions",
        {
            opacity: 1,
            y: 0,
            duration: .7
        },
        "-=.4"
    );


    tl.to(
        ".hero-stats",
        {
            opacity: 1,
            y: 0,
            duration: .7
        },
        "-=.4"
    );


    animateCounters();

}


/* ==============================================================
   COUNTERS
============================================================== */

function animateCounters() {

    document
        .querySelectorAll(
            "[data-count]"
        )
        .forEach(element => {

            const target =
                Number(
                    element.dataset.count
                );


            if (
                reducedMotion ||
                typeof gsap === "undefined"
            ) {

                element.textContent =
                    target;

                return;

            }


            const counter = {
                value: 0
            };


            gsap.to(
                counter,
                {
                    value:
                        target,

                    duration:
                        1.8,

                    delay:
                        .6,

                    ease:
                        "power2.out",

                    onUpdate() {

                        element.textContent =
                            Math.round(
                                counter.value
                            );

                    }

                }
            );

        });

}


/* ==============================================================
   GSAP SCROLL REVEALS
============================================================== */

if (
    typeof gsap !== "undefined" &&
    typeof ScrollTrigger !== "undefined" &&
    !reducedMotion
) {

    gsap.utils
        .toArray(".reveal")
        .forEach(element => {

            gsap.fromTo(

                element,

                {
                    opacity: 0,
                    y: 45
                },

                {
                    opacity: 1,
                    y: 0,

                    duration: .85,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger:
                            element,

                        start:
                            "top 85%",

                        once:
                            true

                    }

                }

            );

        });


    /* ----------------------------------------------------------
       PRODUCT STAGGER
    ---------------------------------------------------------- */

    gsap.fromTo(

        ".product-card",

        {
            opacity: 0,
            y: 70,
            scale: .95
        },

        {
            opacity: 1,
            y: 0,
            scale: 1,

            duration: .8,

            stagger: .12,

            ease:
                "power3.out",

            scrollTrigger: {

                trigger:
                    ".products-grid",

                start:
                    "top 80%",

                once:
                    true

            }

        }

    );


    /* ----------------------------------------------------------
       FEATURES STAGGER
    ---------------------------------------------------------- */

    gsap.fromTo(

        ".feature-card",

        {
            opacity: 0,
            y: 60
        },

        {
            opacity: 1,
            y: 0,

            duration: .7,

            stagger: .12,

            ease:
                "power3.out",

            scrollTrigger: {

                trigger:
                    ".features-grid",

                start:
                    "top 82%",

                once:
                    true

            }

        }

    );


    /* ----------------------------------------------------------
       FEATURE PARALLAX
    ---------------------------------------------------------- */

    gsap.to(

        ".parallax-feature-bg",

        {

            y: 180,

            ease:
                "none",

            scrollTrigger: {

                trigger:
                    ".features-section",

                start:
                    "top bottom",

                end:
                    "bottom top",

                scrub:
                    true

            }

        }

    );

}


/* ==============================================================
   VANILLA TILT
============================================================== */

if (
    typeof VanillaTilt !== "undefined" &&
    window.innerWidth > 800
) {

    VanillaTilt.init(

        document.querySelectorAll(
            ".tilt-card"
        ),

        {
            max: 8,

            speed: 500,

            glare: true,

            "max-glare": .15,

            scale: 1.02,

            perspective: 1000

        }

    );

}


/* ==============================================================
   RIPPLE BUTTONS
============================================================== */

document
    .querySelectorAll(
        ".ripple-btn"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                const rect =
                    button.getBoundingClientRect();


                const ripple =
                    document.createElement(
                        "span"
                    );


                const size =
                    Math.max(
                        rect.width,
                        rect.height
                    );


                ripple.className =
                    "ripple";


                ripple.style.width =
                    `${size}px`;

                ripple.style.height =
                    `${size}px`;


                ripple.style.left =
                    `${event.clientX - rect.left - size / 2}px`;

                ripple.style.top =
                    `${event.clientY - rect.top - size / 2}px`;


                button.appendChild(
                    ripple
                );


                setTimeout(
                    () => ripple.remove(),
                    700
                );

            }
        );

    });


/* ==============================================================
   MAGNETIC BUTTONS
============================================================== */

if (
    !reducedMotion &&
    window.innerWidth > 900
) {

    document
        .querySelectorAll(
            ".magnetic"
        )
        .forEach(button => {

            button.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        button.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;


                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;


                    gsap.to(
                        button,
                        {
                            x: x * .12,
                            y: y * .12,
                            duration: .25,
                            overwrite: true
                        }
                    );

                }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    gsap.to(
                        button,
                        {
                            x: 0,
                            y: 0,
                            duration: .4
                        }
                    );

                }
            );

        });

}


/* ==============================================================
   CALCULATOR
============================================================== */

const productPrice =
    document.getElementById(
        "productPrice"
    );

const downPayment =
    document.getElementById(
        "downPayment"
    );

const monthsRange =
    document.getElementById(
        "monthsRange"
    );

const monthsValue =
    document.getElementById(
        "monthsValue"
    );

const calculateBtn =
    document.getElementById(
        "calculateBtn"
    );

const monthlyResult =
    document.getElementById(
        "monthlyResult"
    );

const resultPrice =
    document.getElementById(
        "resultPrice"
    );

const resultDown =
    document.getElementById(
        "resultDown"
    );

const resultMonths =
    document.getElementById(
        "resultMonths"
    );

const remainingPercent =
    document.getElementById(
        "remainingPercent"
    );

const calculatorCard =
    document.querySelector(
        ".calculator-card"
    );


let paymentChart = null;


function formatIQD(value) {

    return Math.round(value)
        .toLocaleString(
            "en-US"
        );

}


function updateMonths() {

    if (!monthsRange)
        return;


    monthsValue.textContent =
        monthsRange.value;

}


if (monthsRange) {

    monthsRange.addEventListener(
        "input",
        updateMonths
    );

}


function calculateInstallment() {

    const price =
        Math.max(
            Number(
                productPrice.value
            ) || 0,
            0
        );


    const down =
        Math.min(

            Math.max(
                Number(
                    downPayment.value
                ) || 0,
                0
            ),

            price

        );


    const months =
        Math.max(
            Number(
                monthsRange.value
            ) || 1,
            1
        );


    const remaining =
        Math.max(
            price - down,
            0
        );


    /*
       معامل افتراضي بسيط للتوضيح.
       يمكن استبداله بمعادلة المتجر الفعلية.
    */

    const serviceRate =
        .0035;


    const financingCost =
        remaining *
        serviceRate *
        months;


    const totalFinanced =
        remaining +
        financingCost;


    const monthly =
        totalFinanced /
        months;


    const downPercentage =
        price > 0
            ? (down / price) * 100
            : 0;


    const remainingPercentage =
        Math.max(
            100 - downPercentage,
            0
        );


    /* ----------------------------------------------------------
       TEXT RESULTS
    ---------------------------------------------------------- */

    resultPrice.textContent =
        formatIQD(price);


    resultDown.textContent =
        formatIQD(down);


    resultMonths.textContent =
        months;


    remainingPercent.textContent =
        `${Math.round(
            remainingPercentage
        )}%`;


    animateNumber(
        monthlyResult,
        monthly
    );


    /* ----------------------------------------------------------
       CHART
    ---------------------------------------------------------- */

    createOrUpdateChart(
        down,
        remaining
    );


    /* ----------------------------------------------------------
       FLASH EFFECT
    ---------------------------------------------------------- */

    calculatorCard.classList.remove(
        "calculated"
    );


    void calculatorCard.offsetWidth;


    calculatorCard.classList.add(
        "calculated"
    );

}


function animateNumber(
    element,
    target
) {

    if (
        reducedMotion ||
        typeof gsap === "undefined"
    ) {

        element.textContent =
            formatIQD(target);

        return;

    }


    const start = {
        value: 0
    };


    gsap.to(
        start,
        {

            value:
                target,

            duration:
                1.1,

            ease:
                "power2.out",

            onUpdate() {

                element.textContent =
                    formatIQD(
                        start.value
                    );

            }

        }
    );

}


function createOrUpdateChart(
    down,
    remaining
) {

    const canvas =
        document.getElementById(
            "paymentChart"
        );


    if (!canvas)
        return;


    const ctx =
        canvas.getContext("2d");


    if (paymentChart) {

        paymentChart.data.datasets[0]
            .data = [
                down,
                remaining
            ];

        paymentChart.update();

        return;

    }


    paymentChart =
        new Chart(
            ctx,
            {

                type:
                    "doughnut",

                data: {

                    labels: [
                        "الدفعة المقدمة",
                        "المتبقي"
                    ],

                    datasets: [{

                        data: [
                            down,
                            remaining
                        ],

                        backgroundColor: [
                            "#42ff9a",
                            "#2677ff"
                        ],

                        borderWidth: 0,

                        hoverOffset: 5

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "74%",

                    animation: {

                        duration:
                            reducedMotion
                                ? 0
                                : 1200,

                        easing:
                            "easeOutQuart"

                    },

                    plugins: {

                        legend: {
                            display: false
                        },

                        tooltip: {
                            enabled: false
                        }

                    }

                }

            }
        );

}


if (calculateBtn) {

    calculateBtn.addEventListener(
        "click",
        calculateInstallment
    );

}


/* حساب أولي */

setTimeout(
    calculateInstallment,
    500
);


/* ==============================================================
   TESTIMONIAL SLIDER
============================================================== */

const testimonialCards =
    Array.from(
        document.querySelectorAll(
            ".testimonial-card"
        )
    );


const sliderDots =
    document.getElementById(
        "sliderDots"
    );


const prevBtn =
    document.getElementById(
        "testimonialPrev"
    );


const nextBtn =
    document.getElementById(
        "testimonialNext"
    );


let testimonialIndex = 0;


if (sliderDots) {

    testimonialCards.forEach(
        (_, index) => {

            const dot =
                document.createElement(
                    "span"
                );


            dot.className =
                "slider-dot";


            if (index === 0) {

                dot.classList.add(
                    "active"
                );

            }


            dot.addEventListener(
                "click",
                () => {

                    testimonialIndex =
                        index;

                    updateTestimonials();

                }
            );


            sliderDots.appendChild(
                dot
            );

        }
    );

}


function updateTestimonials() {

    testimonialCards.forEach(
        (card, index) => {

            card.classList.remove(
                "active",
                "prev",
                "next"
            );


            if (
                index ===
                testimonialIndex
            ) {

                card.classList.add(
                    "active"
                );

            }


            else if (
                index ===
                (
                    testimonialIndex - 1 +
                    testimonialCards.length
                ) %
                testimonialCards.length
            ) {

                card.classList.add(
                    "prev"
                );

            }


            else if (
                index ===
                (
                    testimonialIndex + 1
                ) %
                testimonialCards.length
            ) {

                card.classList.add(
                    "next"
                );

            }

        });


    document
        .querySelectorAll(
            ".slider-dot"
        )
        .forEach(
            (dot, index) => {

                dot.classList.toggle(
                    "active",
                    index ===
                    testimonialIndex
                );

            }
        );

}


function nextTestimonial() {

    testimonialIndex =
        (
            testimonialIndex + 1
        ) %
        testimonialCards.length;


    updateTestimonials();

}


function previousTestimonial() {

    testimonialIndex =
        (
            testimonialIndex - 1 +
            testimonialCards.length
        ) %
        testimonialCards.length;


    updateTestimonials();

}


if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        nextTestimonial
    );

}


if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        previousTestimonial
    );


}


/* Auto slider */

let testimonialTimer =
    setInterval(
        nextTestimonial,
        5500
    );


const testimonialSlider =
    document.getElementById(
        "testimonialSlider"
    );


if (testimonialSlider) {

    testimonialSlider.addEventListener(
        "mouseenter",
        () => {

            clearInterval(
                testimonialTimer
            );

        }
    );


    testimonialSlider.addEventListener(
        "mouseleave",
        () => {

            testimonialTimer =
                setInterval(
                    nextTestimonial,
                    5500
                );

        }
    );

}


updateTestimonials();


/* ==============================================================
   BACK TO TOP
============================================================== */

if (backToTop) {

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior:
                    reducedMotion
                        ? "auto"
                        : "smooth"

            });

        }
    );

}


/* ==============================================================
   PARALLAX HERO CONTENT
============================================================== */

if (
    !reducedMotion &&
    window.innerWidth > 900
) {

    window.addEventListener(
        "mousemove",
        event => {

            const x =
                (
                    event.clientX /
                    window.innerWidth -
                    .5
                );


            const y =
                (
                    event.clientY /
                    window.innerHeight -
                    .5
                );


            const heroCopy =
                document.querySelector(
                    ".hero-copy"
                );


            if (heroCopy) {

                gsap.to(
                    heroCopy,
                    {
                        x:
                            x * -8,

                        y:
                            y * -5,

                        duration:
                            .8,

                        overwrite:
                            "auto"
                    }
                );

            }

        },
        {
            passive: true
        }
    );

}


/* ==============================================================
   LAZY LOTTIE SUPPORT
============================================================== */

/*
    تم تحميل Lottie أعلاه ويمكن استخدامه مستقبلاً بهذه الطريقة:

    lottie.loadAnimation({
        container: element,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "YOUR_LOTTIE_JSON_URL"
    });

    لم نربط ملف JSON خارجي هنا حتى لا تصبح الصفحة
    معتمدة على ملف إضافي غير موجود.
*/


/* ==============================================================
   KEYBOARD ACCESSIBILITY
============================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            mobileMenu
        ) {

            mobileMenu.classList.remove(
                "open"
            );

        }

    }
);


/* ==============================================================
   PERFORMANCE — VISIBILITY
============================================================== */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden &&
            threeRenderer
        ) {

            /*
               لا نوقف الـ renderer بالكامل لأن
               requestAnimationFrame يتوقف تلقائياً
               في أغلب المتصفحات عند الخلفية.
            */

        }

    }
);
