/* ============================================================
   ملف JavaScript الخاص بموقع Café Lumière
   يحتوي على:
   1) زر تفاعلي في صفحة "عن الكافيه" يغير النص
   2) نموذج التواصل + التحقق من الحقول + إرسال إلى json-server
   3) Fetch API لتحميل المنتجات من products.json
   4) إضافة منتج جديد (POST) إلى json-server
   5) عرض كل الرسائل في صفحة الطلبات
   6) البحث عن رسالة برقم الهاتف
   ============================================================ */


/* ============================================================
   1) الزر التفاعلي في صفحة "عن الكافيه"
   ============================================================ */
const readMoreBtn = document.getElementById('readMoreBtn');
const moreInfo = document.getElementById('moreInfo');

if (readMoreBtn) {
    readMoreBtn.addEventListener('click', function () {
        // نتحقق إذا كانت المعلومات مخفية أم لا
        if (moreInfo.classList.contains('hidden')) {
            moreInfo.classList.remove('hidden'); // إظهار المعلومات
            readMoreBtn.innerHTML = '<i class="fas fa-times"></i> إخفاء التفاصيل';
        } else {
            moreInfo.classList.add('hidden'); // إخفاء المعلومات
            readMoreBtn.innerHTML = '<i class="fas fa-book-open"></i> اقرأ المزيد';
        }
    });
}


/* ============================================================
   2) نموذج التواصل + التحقق من الحقول + الإرسال إلى json-server
   ============================================================ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); // منع الإرسال الافتراضي

        // جلب الحقول
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const message = document.getElementById('message');

        // عناصر رسائل الخطأ
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const phoneError = document.getElementById('phoneError');
        const messageError = document.getElementById('messageError');
        const successMessage = document.getElementById('successMessage');

        let isValid = true;

        // إعادة ضبط الرسائل
        nameError.textContent = '';
        emailError.textContent = '';
        phoneError.textContent = '';
        messageError.textContent = '';

        // التحقق من الاسم
        if (name.value.trim() === '') {
            nameError.textContent = 'الاسم مطلوب';
            isValid = false;
        }

        // التحقق من البريد الإلكتروني
        if (email.value.trim() === '') {
            emailError.textContent = 'البريد الإلكتروني مطلوب';
            isValid = false;
        } else if (!email.value.includes('@')) {
            emailError.textContent = 'البريد الإلكتروني غير صالح';
            isValid = false;
        }

        // التحقق من رقم الهاتف
        if (phone.value.trim() === '') {
            phoneError.textContent = 'رقم الهاتف مطلوب';
            isValid = false;
        } else if (phone.value.trim().length < 10) {
            phoneError.textContent = 'رقم الهاتف غير صحيح';
            isValid = false;
        }

        // التحقق من الرسالة
        if (message.value.trim() === '') {
            messageError.textContent = 'الرسالة مطلوبة';
            isValid = false;
        }

        // إذا كان كل شيء صحيح
        if (isValid) {
            const newMessage = {
                name: name.value,
                email: email.value,
                phone: phone.value,
                message: message.value,
                sentAt: new Date().toLocaleString('ar-EG'),
            };

            // إرسال البيانات إلى json-server
            fetch('http://localhost:3001/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage),
            })
                .then((res) => res.json())
                .then(() => {
                    successMessage.classList.remove('hidden');
                    contactForm.reset();
                    setTimeout(() => successMessage.classList.add('hidden'), 4000);
                })
                .catch((err) => {
                    console.error('خطأ في الإرسال:', err);
                    alert('حدث خطأ أثناء الإرسال، تأكد من تشغيل json-server');
                });
        }
    });
}


/* ============================================================
   3) Fetch API لتحميل المنتجات من products.json
   ============================================================ */
const productsContainer = document.getElementById('products-container');

if (productsContainer) {
    fetch('products.json')
        .then((res) => res.json())
        .then((products) => {
            productsContainer.innerHTML = ''; // تفريغ المحتوى

            products.forEach((product) => {
                const card = document.createElement('div');
                card.className = 'service-card';
                card.innerHTML = `
                    <i class="fas fa-${product.icon} service-icon"></i>
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span class="price">${product.price} ج.م</span>
                `;
                productsContainer.appendChild(card);
            });
        })
        .catch((err) => {
            productsContainer.innerHTML = '<p>تعذر تحميل المنتجات</p>';
            console.error(err);
        });
}


/* ============================================================
   4) إضافة منتج جديد (POST) إلى json-server
   ============================================================ */
const addProductForm = document.getElementById('add-product-form');

if (addProductForm) {
    addProductForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newProduct = {
            name: document.getElementById('new-name').value,
            price: document.getElementById('new-price').value,
            description: document.getElementById('new-description').value,
            icon: 'mug-hot',
        };

        fetch('http://localhost:3001/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct),
        })
            .then((res) => res.json())
            .then(() => {
                alert('✅ تم إضافة المنتج بنجاح');
                addProductForm.reset();
            })
            .catch((err) => {
                console.error(err);
                alert('تأكد من تشغيل json-server');
            });
    });
}


/* ============================================================
   5) عرض كل الرسائل + الإحصائيات في صفحة الطلبات
   ============================================================ */
const appointmentsContainer = document.getElementById('appointments-container');

if (appointmentsContainer) {
    fetch('http://localhost:3001/messages')
        .then((res) => res.json())
        .then((messages) => {
            appointmentsContainer.innerHTML = '';

            if (messages.length === 0) {
                appointmentsContainer.innerHTML = '<p>لا توجد رسائل بعد.</p>';
                return;
            }

            messages.forEach((m, index) => {
                const card = document.createElement('div');
                card.className = 'appointment-card';
                card.innerHTML = `
                    <h3>#${index + 1} - ${m.name}</h3>
                    <p><i class="fas fa-envelope"></i> ${m.email}</p>
                    <p><i class="fas fa-phone"></i> ${m.phone}</p>
                    <p><i class="fas fa-comment"></i> ${m.message}</p>
                    <small>${m.sentAt}</small>
                `;
                appointmentsContainer.appendChild(card);
            });

            // الإحصائيات
            const totalCount = document.getElementById('totalCount');
            const todayCount = document.getElementById('todayCount');
            if (totalCount) totalCount.textContent = messages.length;

            if (todayCount) {
                const today = new Date().toLocaleDateString('ar-EG');
                const todayMessages = messages.filter((m) =>
                    (m.sentAt || '').includes(today.split('/')[0])
                );
                todayCount.textContent = todayMessages.length;
            }
        })
        .catch(() => {
            appointmentsContainer.innerHTML =
                '<p>تأكد من تشغيل json-server </p>';
        });
}


/* ============================================================
   6) البحث عن رسالة برقم الهاتف
   ============================================================ */
const searchBtn = document.getElementById('searchBtn');

if (searchBtn) {
    searchBtn.addEventListener('click', function () {
        const phone = document.getElementById('searchPhone').value.trim();
        const result = document.getElementById('searchResult');

        if (!phone) {
            result.innerHTML = '<p style="color:red">من فضلك ادخل رقم الهاتف</p>';
            return;
        }

        fetch('http://localhost:3001/messages')
            .then((res) => res.json())
            .then((messages) => {
                const found = messages.find((m) => m.phone === phone);
                if (found) {
                    result.innerHTML = `
                        <div class="appointment-card">
                            <h3>${found.name}</h3>
                            <p><i class="fas fa-envelope"></i> ${found.email}</p>
                            <p><i class="fas fa-phone"></i> ${found.phone}</p>
                            <p><i class="fas fa-comment"></i> ${found.message}</p>
                            <small>${found.sentAt}</small>
                        </div>`;
                } else {
                    result.innerHTML = '<p>لا توجد رسالة بهذا الرقم</p>';
                }
            });
    });
}
