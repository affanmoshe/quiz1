document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form')
    if (loginForm) {
        setupLoginForm()
    }

    const signupForm = document.getElementById('signup-form')
    if (signupForm) {
        setupSignUpForm()
    }
})


function setupLoginForm() {
    const loginForm = document.getElementById('login-form')
    const emailInput = document.getElementById('email')
    const passwordInput = document.getElementById('password')
    const messageContainer = document.getElementById('message-container')

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault()
        clearErrors()

        const email = emailInput.value.trim()
        const password = passwordInput.value.trim()
        let isValid = true

        // === Validate Fields ===
        if (email === '') {
            showError(emailInput, 'Email harus diisi.')
            isValid = false
        } else if (!isValidEmail(email)) {
            showError(emailInput, 'Format email tidak valid.')
            isValid = false
        }

        if (password === '') {
            showError(passwordInput, 'Kata sandi harus diisi.')
            isValid = false
        }

        if (!isValid) return

        const storedUserData = localStorage.getItem('user_data')

        if (!storedUserData) {
            showMessage('Tidak ada akun yang terdaftar. Silakan daftar terlebih dahulu.', 'error')
            return
        }

        let users
        try {
            users = JSON.parse(storedUserData)
        } catch (error) {
            showMessage('Data akun rusak. Silakan daftar ulang.', 'error')
            localStorage.removeItem('user_data')
            return
        }

        const foundUser = users.find(user => user.email === email && user.password === password)

        if (foundUser) {
            showMessage('Login berhasil! Mengalihkan ke halaman utama...', 'success')

            localStorage.setItem('isLoggedIn', 'true')
            localStorage.setItem('user_info', JSON.stringify({ fullName: foundUser.fullName, email: foundUser.email }))

            setTimeout(() => {
                window.location.assign('index.html')
            }, 2000)
        } else {
            showMessage('Email atau kata sandi salah.', 'error')
        }
    })

    function showError(inputElement, message) {
        const formGroup = inputElement.parentElement
        formGroup.classList.add('error')
        const errorElement = formGroup.querySelector('.error-message')
        errorElement.textContent = message
    }

    function clearErrors() {
        const formGroups = loginForm.querySelectorAll('.form-group')
        formGroups.forEach(group => {
            group.classList.remove('error')
            group.querySelector('.error-message').textContent = ''
        })
        messageContainer.innerHTML = ''
        messageContainer.className = ''
    }

    function showMessage(message, type) {
        messageContainer.textContent = message
        messageContainer.className = type 
    }

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }
}

function setupSignUpForm() {
    const signupForm = document.getElementById('signup-form')
    const fullNameInput = document.getElementById('fullName')
    const phoneInput = document.getElementById('phone')
    const emailInput = document.getElementById('email')
    const passwordInput = document.getElementById('password')
    const confirmPasswordInput = document.getElementById('confirmPassword')
    const messageContainer = document.getElementById('message-container')

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault() 
        clearErrors()
        let isValid = true

        // validasi username 
        const fullName = fullNameInput.value.trim()
        if (fullName === '') {
            showError(fullNameInput, 'Nama lengkap harus diisi.')
            isValid = false
        } else if (fullName.length < 3) {
            showError(fullNameInput, 'Nama lengkap minimal 3 karakter.')
            isValid = false
        } else if (fullName.length > 32) {
            showError(fullNameInput, 'Nama lengkap maksimal 32 karakter.')
            isValid = false
        } else if (/\d/.test(fullName)) {
            showError(fullNameInput, 'Nama lengkap tidak boleh mengandung angka.')
            isValid = false
        }

        // validasi nomor handphone
        const phone = phoneInput.value.trim()
        if (phone === '') {
            showError(phoneInput, 'Nomor handphone harus diisi.')
            isValid = false
        } else if (!/^08\d{8,14}$/.test(phone)) {
            showError(phoneInput, 'Format nomor handphone tidak valid (harus diawali 08xx, panjang 10-16 digit).')
            isValid = false
        }

        // validasi Email
        const email = emailInput.value.trim()
        if (email === '') {
            showError(emailInput, 'Email harus diisi.')
            isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError(emailInput, 'Format email tidak valid.')
            isValid = false
        }

        // validasi password 
        const password = passwordInput.value.trim()
        if (password === '') {
            showError(passwordInput, 'Kata sandi harus diisi.')
            isValid = false
        } else if (password.length < 8) {
            showError(passwordInput, 'Kata sandi minimal 8 karakter.')
            isValid = false
        }

        const confirmPassword = confirmPasswordInput.value.trim()
        if (confirmPassword === '') {
            showError(confirmPasswordInput, 'Konfirmasi kata sandi harus diisi.')
            isValid = false
        } else if (password !== confirmPassword) {
            showError(confirmPasswordInput, 'Kata sandi dan konfirmasi tidak cocok.')
            isValid = false
        }

        if (isValid) {
            let users = JSON.parse(localStorage.getItem('user_data')) || []

            // mengecek jika emai sudah terdaftar 
            const emailExists = users.some(user => user.email === email)
            if (emailExists) {
                showMessage('Email sudah terdaftar, silakan gunakan email lain.', 'error')
                return
            }

            const newUser = { fullName, phone, email, password }
            users.push(newUser)

            // save data user local storage 
            localStorage.setItem('user_data', JSON.stringify(users))

            showMessage('Pendaftaran berhasil! Anda akan dialihkan ke halaman login.', 'success')

            setTimeout(() => {
                window.location.assign('login.html')
            }, 2500)
        }
    })

    function showError(inputElement, message) {
        const formGroup = inputElement.parentElement
        formGroup.classList.add('error')
        const errorElement = formGroup.querySelector('.error-message')
        errorElement.textContent = message
    }

    function clearErrors() {
        const formGroups = signupForm.querySelectorAll('.form-group')
        formGroups.forEach(group => {
            group.classList.remove('error')
            group.querySelector('.error-message').textContent = ''
        })
        messageContainer.innerHTML = ''
        messageContainer.className = ''
    }

    function showMessage(message, type) {
        messageContainer.textContent = message
        messageContainer.className = type 
    }
}
