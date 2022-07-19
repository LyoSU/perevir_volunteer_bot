next-button = Наступна ➡️ 
previous-button = ⬅ Попередня️
back-button = Назад ⬅️

# Auth

need-auth = 
    Щоб отримати доступ до кабінету волонтера пройди авторизацію натиснувши на кнопку “☎️ Поділитися номером” внизу

request-contact = ☎️ Поділитися номером

auth-success =
    🎉 Ти успішно авторизувався!
    
    💪 Віддтепер тобі доступний кабінет волонтера в меню нище
    
    Щоб ефективно опрацьовувати запити, радимо пройти курс молодого волонтера боту ПЕРЕВІРКА!

tutorial-button = 🎓 Пройти курс

# Cabinet

cabinet-button = 💪 Кабінет волонтера

main =
    <b>💪 Кабінет волонтера</b>

    ☀️ Оброблено сьогодні: { $today_requests }
    💬 Залишено коментарів: { $comments_count }
    🗃 Оброблено заявок всього: { $requests_count }

start-work-button = ▶️ Розпочати роботу
wait-volunteer-button = ⏳ Очікують волонтера ({ $wait_count })
my-requests-button = 🧑‍💻 Мої заявки ({ $my_requests_count })
archive-button = 🗃 Архів ({ $archive_count } / { $archive_count })
faq-button = 💬 Бази знань

# Requests
sources =
    { $type ->
        *[mixed]
            ❓ Джерело: { $name }
            ├ Тип: не відомо
            └ { $true_procent }% true / ${ $fake_procent }% mixed (на основі 75 дописів)
        [fake]
            ❌ Джерело: { $name }
            ├ Тип: пропаганда РФ
            ├ Опис: { $description }
            └ { $true_procent }% true / ${ $mixed_procent }% mixed / ${ $fake_procent }% fake (на основі 50 дописів)
        [true]
            ✅ Джерело: { $name }
            ├ Тип: офіційне українське джерело
            ├ Опис: { $description }
            └ { $true_procent }% true (на основі 84 дописів)
    }

request-view =
    ⏳ Заявка №{ $request_id } від { $from_name }
    📅 { DATETIME($date, hour: "numeric", minute: "numeric", day: "numeric", month: "long") }
    🤖️ Повʼязаних запитів: 5
    
    { $text }

    { $source }

my_requests =
    <b>Заявки</b>

# Moderation

moderation-stopped =
    🚫 Модерація зупинена

    Ви можете почати модерування запитів знову натиснувши на кнопку “▶️ Розпочати роботу”

moderation-comment =
    ✅ Заявка №{ $request_id } від { $from_name }
    Вкажи посилання на офіційне джерело інформації або коментар, після цього користувачу надійде сповіщення

moderation-skip-comment-button = ↪ Пропустити коментар

moderation-success =
    🎉 Заявка №{ $request_id } успішно опрацьована
    
    Користувачу відправлено сповіщення
    
    якуємо за твою роботу 💛💙

fake-status = { $status ->
    *[true] ✅ Правда
    [fake] ❌ Фейк
    [reject] Відхилено
    [noproof] Бракує доказів
    [manipulation] Маніпуляція
    [other] 🤷‍♂️ Інше 
}

take-button = 👨‍💻 Взяти собі

taked =
    Ти взяв собі заявку №{ $request_id } на обробку

moderation-status =
    Заявка №{ $request_id } від { $from_name }
    Обери категорію в яку потрібно віднести заявку

stop-work-button = < Закінчити роботу

# FAQ
faq-message =
    🧐 <a href="https://gwaramedia.com/metodologiya-faktchekingu-perevirka/">Методологія фактчекінгу в редакції Gwara Media та боті Перевірка</a>
    ⚖️ <a href="https://gwaramedia.com/politika-faktchekingu/">Політика фактчекінгу</a>

    Організаційні питання / пропозиції: @serhiiprokopenko
    Технічні питання / пропозиції: @fominvo

# Error

error = 
    <b>Сталася невідома помилка, спробуйте ще раз.</b>

    Якщо проблема не зникне, напишіть адміністратору.

any-message =
    Це щось невідоме для мене