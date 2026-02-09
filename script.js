// Данные пользователей
const usersData = [
    {
        id: 1,
        name: "Иван Петров",
        email: "ivan@company.com",
        role: "Менеджер проектов",
        date: "15.03.2024",
        status: "active",
        initials: "ИП"
    },
    {
        id: 2,
        name: "Анна Сидорова",
        email: "anna@company.com",
        role: "Разработчик",
        date: "22.02.2024",
        status: "active",
        initials: "АС"
    },
    {
        id: 3,
        name: "Михаил Козлов",
        email: "mikhail@company.com",
        role: "Администратор",
        date: "10.01.2024",
        status: "active",
        initials: "МК"
    },
    {
        id: 4,
        name: "Елена Васнецова",
        email: "elena@company.com",
        role: "Тестировщик",
        date: "05.04.2024",
        status: "pending",
        initials: "ЕВ"
    },
    {
        id: 5,
        name: "Дмитрий Новиков",
        email: "dmitry@company.com",
        role: "Разработчик",
        date: "18.03.2024",
        status: "active",
        initials: "ДН"
    },
    {
        id: 6,
        name: "Ольга Морозова",
        email: "olga@company.com",
        role: "Дизайнер",
        date: "12.02.2024",
        status: "inactive",
        initials: "ОМ"
    }
];

// Текущие данные
let currentUsers = [...usersData];
let currentUserId = null;
let currentPage = 'users';

// DOM элементы
const usersTable = document.getElementById('usersTable');
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const roleFilter = document.getElementById('roleFilter');
const addUserBtn = document.getElementById('addUserBtn');
const userModal = document.getElementById('userModal');
const confirmModal = document.getElementById('confirmModal');
const notification = document.getElementById('notification');
const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');
const statsCards = document.getElementById('statsCards');
const controlPanel = document.getElementById('controlPanel');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Загрузка пользователей
    loadUsers();
    
    // Настройка навигации
    setupNavigation();
    
    // Настройка событий
    setupEvents();
}

// Загрузка пользователей в таблицу
function loadUsers() {
    tableBody.innerHTML = '';
    
    if (currentUsers.length === 0) {
        document.getElementById('emptyState').style.display = 'block';
        usersTable.style.display = 'none';
        return;
    }
    
    document.getElementById('emptyState').style.display = 'none';
    usersTable.style.display = 'table';
    
    currentUsers.forEach(user => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="table-cell">
                <div class="user-badge">
                    <div class="user-avatar-small">${user.initials}</div>
                    <div class="user-info-small">
                        <div class="name">${user.name}</div>
                        <div class="email">${user.email}</div>
                    </div>
                </div>
            </td>
            <td class="table-cell">${user.role}</td>
            <td class="table-cell">${user.date}</td>
            <td class="table-cell">
                <div class="status-indicator ${getStatusClass(user.status)}">
                    ${getStatusText(user.status)}
                </div>
            </td>
            <td class="table-cell">
                <div class="table-actions">
                    <button class="action-btn edit" onclick="editUser(${user.id})" title="Редактировать">
                        ✏️
                    </button>
                    <button class="action-btn delete" onclick="showConfirmModal(${user.id})" title="Удалить">
                        🗑️
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Настройка навигации
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Обновление активного пункта
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Изменение страницы
            currentPage = this.dataset.page;
            updatePageContent();
        });
    });
}

// Обновление контента страницы
function updatePageContent() {
    switch(currentPage) {
        case 'users':
            pageTitle.textContent = 'Управление пользователями';
            pageSubtitle.textContent = 'Всего зарегистрировано: 1,247 пользователей';
            statsCards.style.display = 'grid';
            controlPanel.style.display = 'block';
            loadUsers();
            break;
            
        case 'projects':
            pageTitle.textContent = 'Управление проектами';
            pageSubtitle.textContent = 'Активных проектов: 24';
            statsCards.style.display = 'none';
            controlPanel.style.display = 'none';
            showMessage('Раздел "Проекты" находится в разработке');
            break;
            
        case 'analytics':
            pageTitle.textContent = 'Аналитика и отчеты';
            pageSubtitle.textContent = 'Статистика за последний месяц';
            statsCards.style.display = 'none';
            controlPanel.style.display = 'none';
            showMessage('Раздел "Аналитика" находится в разработке');
            break;
            
        case 'settings':
            pageTitle.textContent = 'Настройки системы';
            pageSubtitle.textContent = 'Конфигурация параметров';
            statsCards.style.display = 'none';
            controlPanel.style.display = 'none';
            showMessage('Раздел "Настройки" находится в разработке');
            break;
            
        case 'logs':
            pageTitle.textContent = 'Журнал событий';
            pageSubtitle.textContent = 'Последние действия в системе';
            statsCards.style.display = 'none';
            controlPanel.style.display = 'none';
            showMessage('Раздел "Журнал" находится в разработке');
            break;
    }
}

// Настройка событий
function setupEvents() {
    // Поиск
    searchInput.addEventListener('input', filterUsers);
    
    // Фильтры
    statusFilter.addEventListener('change', filterUsers);
    roleFilter.addEventListener('change', filterUsers);
    
    // Добавление пользователя
    addUserBtn.addEventListener('click', () => {
        currentUserId = null;
        document.getElementById('modalTitle').textContent = 'Добавить пользователя';
        document.getElementById('userName').value = '';
        document.getElementById('userEmail').value = '';
        document.getElementById('userRole').value = '';
        document.getElementById('userStatus').value = 'active';
        userModal.style.display = 'flex';
    });
    
    // Отмена в модальном окне
    document.getElementById('cancelBtn').addEventListener('click', () => {
        userModal.style.display = 'none';
    });
    
    // Сохранение пользователя
    document.getElementById('saveBtn').addEventListener('click', saveUser);
    
    // Отмена удаления
    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        confirmModal.style.display = 'none';
    });
    
    // Подтверждение удаления
    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteUser);
    
    // Сброс фильтров
    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        statusFilter.value = '';
        roleFilter.value = '';
        filterUsers();
    });
    
    // Закрытие модальных окон при клике вне их
    window.addEventListener('click', (e) => {
        if (e.target === userModal) {
            userModal.style.display = 'none';
        }
        if (e.target === confirmModal) {
            confirmModal.style.display = 'none';
        }
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            userModal.style.display = 'none';
            confirmModal.style.display = 'none';
        }
    });
    
    // Экспорт
    document.getElementById('exportBtn').addEventListener('click', () => {
        showMessage('Экспорт данных начат');
    });
}

// Фильтрация пользователей
function filterUsers() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    const roleValue = roleFilter.value;
    
    currentUsers = usersData.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) || 
                            user.email.toLowerCase().includes(searchTerm) ||
                            user.role.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusValue || user.status === statusValue;
        const matchesRole = !roleValue || user.role.toLowerCase().includes(roleValue);
        
        return matchesSearch && matchesStatus && matchesRole;
    });
    
    loadUsers();
}

// Редактирование пользователя
function editUser(id) {
    const user = usersData.find(u => u.id === id);
    if (user) {
        currentUserId = id;
        document.getElementById('modalTitle').textContent = 'Редактировать пользователя';
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userRole').value = user.role.toLowerCase().split(' ')[0];
        document.getElementById('userStatus').value = user.status;
        userModal.style.display = 'flex';
    }
}

// Показ окна подтверждения
function showConfirmModal(id) {
    currentUserId = id;
    confirmModal.style.display = 'flex';
}

// Удаление пользователя
function deleteUser() {
    const index = usersData.findIndex(u => u.id === currentUserId);
    if (index !== -1) {
        usersData.splice(index, 1);
        filterUsers();
        showMessage('Пользователь успешно удален');
    }
    confirmModal.style.display = 'none';
}

// Сохранение пользователя
function saveUser() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const role = document.getElementById('userRole').value;
    const status = document.getElementById('userStatus').value;
    
    if (!name || !email || !role) {
        showMessage('Заполните все обязательные поля', 'error');
        return;
    }
    
    const roleText = {
        'admin': 'Администратор',
        'manager': 'Менеджер проектов',
        'developer': 'Разработчик',
        'tester': 'Тестировщик',
        'viewer': 'Наблюдатель'
    }[role] || role;
    
    if (currentUserId) {
        // Редактирование существующего пользователя
        const user = usersData.find(u => u.id === currentUserId);
        if (user) {
            user.name = name;
            user.email = email;
            user.role = roleText;
            user.status = status;
            user.initials = name.split(' ').map(n => n[0]).join('');
            showMessage('Пользователь обновлен');
        }
    } else {
        // Добавление нового пользователя
        const newUser = {
            id: usersData.length > 0 ? Math.max(...usersData.map(u => u.id)) + 1 : 1,
            name,
            email,
            role: roleText,
            date: new Date().toLocaleDateString('ru-RU'),
            status,
            initials: name.split(' ').map(n => n[0]).join('')
        };
        usersData.push(newUser);
        showMessage('Пользователь добавлен');
    }
    
    userModal.style.display = 'none';
    filterUsers();
}

// Вспомогательные функции
function getStatusClass(status) {
    switch(status) {
        case 'active': return 'status-active';
        case 'pending': return 'status-pending';
        case 'inactive': return 'status-inactive';
        default: return 'status-inactive';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'active': return 'Активный';
        case 'pending': return 'Ожидание';
        case 'inactive': return 'Неактивный';
        default: return status;
    }
}

function showMessage(text, type = 'success') {
    notification.textContent = text;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}