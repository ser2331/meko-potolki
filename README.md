# MEKO — Натяжные потолки в Краснодаре

Лендинг компании **MEKO** по установке натяжных потолков.  
Дизайн по референсу [mekopotolki.ru](https://mekopotolki.ru/). Фокус на **SEO**.

## Бренд

- **MEKO** (с буквой K, не MECO)
- Логотип: `assets/images/logo.png` или URL из `js/config.js`
- Шрифты: Montserrat + Open Sans
- Цвета: navy `#1a4480`, красный `#e31e24`

## Быстрый старт

```bash
python -m http.server 8080
```

Открыть `http://localhost:8080`

## Настройка

Все контакты и настройки — в `js/config.js` (`MEKO_CONFIG`):

```js
phone: '+79528495584',
phoneDisplay: '+7 (952) 849-55-84',
email: 'meko.krd@yandex.com',
logo: 'https://mekopotolki.ru/wp-content/uploads/2025/02/logo.png',
```

Header и footer генерируются автоматически через `js/layout.js`.

## Структура

```
index.html              Главная
portfolio/              Наши работы (с фильтром)
uslugi/                 Услуги
tseny.html              Цены
kontakty.html           Контакты
js/config.js            Конфигурация
js/layout.js            Header / Footer
css/                    Стили
```

## Этап 2 (планируется)

- [ ] Калькулятор стоимости
- [ ] Реальные фото работ
- [ ] Яндекс.Метрика + карта
- [ ] Админ-панель

## Cursor AI

Правило `.cursor/rules/meko-project.mdc` — контекст проекта для AI.
