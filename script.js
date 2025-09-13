document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.getElementById('navLinks');
    const mobileMenu = document.getElementById('mobileMenu');
    const headerNavLinks = document.querySelectorAll('.nav-links a');
    const logoLink = document.querySelector('.logo');

    // Function to navigate between separate pages
    window.showPage = function(pageId) {
        let targetUrl;
        
        switch(pageId) {
            case 'home':
                targetUrl = 'index.html';
                break;
            case 'content':
                targetUrl = 'content.html';
                break;
            case 'join':
                targetUrl = 'join.html';
                break;
            case 'contact':
                targetUrl = 'contact.html';
                break;
            default:
                targetUrl = 'index.html';
        }
        
        window.location.href = targetUrl;
    };

    // Function to set active navigation link based on current page
    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        headerNavLinks.forEach(link => {
            link.classList.remove('active-link');
            
            const linkPage = link.getAttribute('onclick');
            if (linkPage) {
                if ((currentPage === 'index.html' && linkPage.includes("'home'")) ||
                    (currentPage === '' && linkPage.includes("'home'")) ||
                    (currentPage === 'content.html' && linkPage.includes("'content'")) ||
                    (currentPage === 'join.html' && linkPage.includes("'join'")) ||
                    (currentPage === 'contact.html' && linkPage.includes("'contact'"))) {
                    link.classList.add('active-link');
                }
            }
        });
    };

    // Mobile menu toggle
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    // Close mobile menu when clicking nav links
    headerNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('open');
            }
        });
    });

    // Logo click handler
    if (logoLink) {
        logoLink.addEventListener('click', (event) => {
            event.preventDefault();
            showPage('home');
        });
    }

    // Set active nav link on page load
    setActiveNavLink();

    // Smooth scroll for anchor links (for same-page navigation)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Submission
    window.submitContactForm = function(event) {
        event.preventDefault();
        alert('تم إرسال رسالتك بنجاح! شكراً لك.');
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.reset();
        }
    };

    // ---------------------- Slider Logic Start ----------------------
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (sliderWrapper && prevBtn && nextBtn) {
        const cards = Array.from(sliderWrapper.querySelectorAll('.slider-card'));
       
        // Find the index of the card closest to the center of the slider
        const findCenteredCardIndex = () => {
            const wrapperCenter = sliderWrapper.scrollLeft + sliderWrapper.offsetWidth / 2;
            let closestIndex = 0;
            let minDiff = Infinity;

            cards.forEach((card, index) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const diff = Math.abs(cardCenter - wrapperCenter);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = index;
                }
            });
            return closestIndex;
        };

        nextBtn.addEventListener('click', () => {
            const currentIndex = findCenteredCardIndex();
            const nextIndex = (currentIndex + 1) % cards.length;
            const nextCard = cards[nextIndex];
            const targetPos = nextCard.offsetLeft - (sliderWrapper.offsetWidth / 2) + (nextCard.offsetWidth / 2);

            sliderWrapper.scrollTo({
                left: targetPos,
                behavior: 'smooth'
            });
        });

        prevBtn.addEventListener('click', () => {
            const currentIndex = findCenteredCardIndex();
            const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
            const prevCard = cards[prevIndex];
            const targetPos = prevCard.offsetLeft - (sliderWrapper.offsetWidth / 2) + (prevCard.offsetWidth / 2);

            sliderWrapper.scrollTo({
                left: targetPos,
                behavior: 'smooth'
            });
        });
    }
    // ---------------------- Slider Logic End ----------------------

    // Handle back/forward browser navigation
    window.addEventListener('popstate', () => {
        setActiveNavLink();
    });

    // Prevent default click behavior for navigation links
    headerNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const onclick = link.getAttribute('onclick');
            if (onclick) {
                eval(onclick);
            }
        });
    });
});






// دالة إرسال البريد الإلكتروني
function sendEmail() {
    // التحقق من وجود البيانات
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const subject = document.querySelector("#subject").value.trim();
    const message = document.querySelector("#message").value.trim();

    // التحقق من أن جميع الحقول مملوءة
    if (!name || !email || !subject || !message) {
        alert("يرجى ملء جميع الحقول المطلوبة.");
        return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("يرجى إدخال بريد إلكتروني صحيح.");
        return;
    }

    const templateParams = {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        to_name: "فريق أكنان"
    };

    console.log("إرسال البيانات:", templateParams);

    // إظهار حالة التحميل
    const button = document.getElementById("sendBtn");
    const originalText = button.textContent;
    button.textContent = "جاري الإرسال...";
    button.disabled = true;

    // إرسال الرسالة باستخدام الـ Service ID والـ Template ID الجديدين
    emailjs.send("service_sye2ygn", "template_9uguk78", templateParams)
    .then(function(response) {
        console.log("نجح الإرسال:", response.status, response.text);
        alert("تم إرسال رسالتك بنجاح! شكراً لك.");
        // تفريغ النموذج بعد الإرسال الناجح
        document.querySelector("#contactForm").reset();
    })
    .catch(function(error) {
        console.error("فشل الإرسال:", error);
        
        // رسالة خطأ مفصلة حسب نوع الخطأ
        let errorMessage = "حدث خطأ أثناء إرسال الرسالة.";
        
        if (error.status === 412) {
            errorMessage = "مشكلة في صلاحيات الخدمة. يرجى التواصل معنا مباشرة على: aknanchannel@gmail.com";
        } else if (error.status === 400) {
            errorMessage = "خطأ في البيانات المرسلة. يرجى التحقق من صحة المعلومات.";
        } else if (error.status === 401) {
            errorMessage = "خطأ في المصادقة. يرجى المحاولة لاحقاً.";
        } else if (error.text) {
            errorMessage = error.text;
        }
        
        alert(errorMessage + "\n\nللمساعدة العاجلة: aknanchannel@gmail.com");
    })
    .finally(function() {
        // إعادة حالة الزر الأصلية
        button.textContent = originalText;
        button.disabled = false;
    });
}

// دالة عرض الصفحات
function showPage(page) {
    // منطق عرض الصفحات
    console.log('Showing page:', page);
    // يمكنك إضافة منطق التنقل بين الصفحات هنا
}

// تفعيل قائمة الهاتف المحمول
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // إضافة تأثيرات على النموذج
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});

// دالة للتحقق من الاتصال بالإنترنت
function checkInternetConnection() {
    if (!navigator.onLine) {
        alert("يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة.");
        return false;
    }
    return true;
}

// إضافة معالج للنموذج لمنع الإرسال المكرر
let isSubmitting = false;

function sendEmail() {
    // التحقق من الاتصال بالإنترنت
    if (!checkInternetConnection()) {
        return;
    }

    // منع الإرسال المكرر
    if (isSubmitting) {
        alert("يتم إرسال رسالتك حالياً، يرجى الانتظار...");
        return;
    }

    // التحقق من وجود البيانات
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const subject = document.querySelector("#subject").value.trim();
    const message = document.querySelector("#message").value.trim();

    // التحقق من أن جميع الحقول مملوءة
    if (!name || !email || !subject || !message) {
        alert("يرجى ملء جميع الحقول المطلوبة.");
        return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("يرجى إدخال بريد إلكتروني صحيح.");
        return;
    }

    // التحقق من طول الرسالة
    if (message.length < 10) {
        alert("يرجى كتابة رسالة أطول (على الأقل 10 أحرف).");
        return;
    }

    const templateParams = {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        to_name: "فريق أكنان"
    };

    console.log("إرسال البيانات:", templateParams);

    // تعيين حالة الإرسال
    isSubmitting = true;

    // إظهار حالة التحميل
    const button = document.getElementById("sendBtn");
    const originalText = button.textContent;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    button.disabled = true;

    // إرسال الرسالة
    emailjs.send("service_sye2ygn", "template_9uguk78", templateParams)
    .then(function(response) {
        console.log("نجح الإرسال:", response.status, response.text);
        alert("✅ تم إرسال رسالتك بنجاح! شكراً لك.\n\nسنتواصل معك قريباً على البريد الإلكتروني المسجل.");
        // تفريغ النموذج بعد الإرسال الناجح
        document.querySelector("#contactForm").reset();
    })
    .catch(function(error) {
        console.error("فشل الإرسال:", error);
        
        // رسالة خطأ مفصلة
        let errorMessage = "❌ حدث خطأ أثناء إرسال الرسالة.";
        
        if (error.status === 412) {
            errorMessage = "مشكلة في صلاحيات الخدمة.";
        } else if (error.status === 400) {
            errorMessage = "خطأ في البيانات المرسلة.";
        } else if (error.status === 401) {
            errorMessage = "خطأ في المصادقة.";
        } else if (error.status === 403) {
            errorMessage = "الخدمة غير مسموحة حالياً.";
        } else if (error.status >= 500) {
            errorMessage = "خطأ في الخادم، يرجى المحاولة لاحقاً.";
        }
        
        alert(errorMessage + "\n\nيمكنك التواصل معنا مباشرة على:\naknanchannel@gmail.com");
    })
    .finally(function() {
        // إعادة حالة الزر الأصلية
        button.innerHTML = originalText;
        button.disabled = false;
        isSubmitting = false;
    });
}