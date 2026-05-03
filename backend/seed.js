const pool = require('./src/config/db');

const toysData = [
  {
    "title": "Плюшевый мишка Классик",
    "description": "Мягкий и уютный медвежонок, который станет верным другом вашему ребенку. Идеально подходит для объятий перед сном.",
    "price": 1200,
    "image_url": "/images/alexas_fotos-bear-3215700_1920.jpg"
  },
  {
    "title": "Медвежонок в свитере",
    "description": "Милый коллекционный медведь в стильной одежде. Отличное дополнение к интерьеру детской комнаты.",
    "price": 1450,
    "image_url": "/images/alexas_fotos-bear-7278747_1920.jpg"
  },
  {
    "title": "Мышонок Пик",
    "description": "Маленькая и очень мягкая мышка с большими ушами. Выполнена из гипоаллергенных материалов.",
    "price": 850,
    "image_url": "/images/alexas_fotos-mouse-3215692_1920.jpg"
  },
  {
    "title": "Мудрая сова",
    "description": "Пушистая лесная сова с выразительными глазами. Поможет развить воображение и любовь к природе.",
    "price": 990,
    "image_url": "/images/alexas_fotos-owl-3296618_1920.jpg"
  },
  {
    "title": "Совушка Сплюшка",
    "description": "Компактная мягкая игрушка, которую удобно брать с собой в путешествия или детский сад.",
    "price": 750,
    "image_url": "/images/alexas_fotos-owl-3852209_1920.jpg"
  },
  {
    "title": "Винтажный Тедди",
    "description": "Медведь в классическом стиле с мягким ворсом. Настоящая классика среди мягких игрушек.",
    "price": 1600,
    "image_url": "/images/alexas_fotos-teddy-2989138_1920.jpg"
  },
  {
    "title": "Медведь Тедди",
    "description": "Большой и добрый мишка, который принесет радость и уют в ваш дом. Прекрасный подарок на любой праздник.",
    "price": 2100,
    "image_url": "/images/alexas_fotos-teddy-3094151_1920.jpg"
  },
  {
    "title": "Мишка с лентой",
    "description": "Очаровательный медвежонок с праздничным бантом. Очень мягкий на ощупь.",
    "price": 1300,
    "image_url": "/images/alexas_fotos-teddy-3117760_1920.jpg"
  },
  {
    "title": "Малыш Тедди",
    "description": "Миниатюрный медведь для самых маленьких. Безопасные швы и отсутствие мелких деталей.",
    "price": 600,
    "image_url": "/images/alexas_fotos-teddy-3131095_1920.jpg"
  },
  {
    "title": "Черепашка Тортилла",
    "description": "Забавная мягкая черепаха с прочным панцирем и доброй улыбкой. Развивает тактильное восприятие.",
    "price": 1100,
    "image_url": "/images/alexas_fotos-tortoise-3105126_1920.jpg"
  },
  {
    "title": "Рок-Гитара для детей",
    "description": "Яркая игрушечная гитара для юных музыкантов. Помогает развивать слух и чувство ритма.",
    "price": 2500,
    "image_url": "/images/hans-guitar-59655_1920.jpg"
  },
  {
    "title": "Футбольный мяч",
    "description": "Классический мяч для активных игр на свежем воздухе. Прочный и износостойкий материал.",
    "price": 1800,
    "image_url": "/images/hans-soccer-59648_1920.jpg"
  },
  {
    "title": "Семейство мишек",
    "description": "Набор из нескольких медведей разного размера. Отлично подходит для сюжетно-ролевых игр.",
    "price": 3200,
    "image_url": "/images/myriams-fotos-teddy-bears-1936200_1920.jpg"
  },
  {
    "title": "Фигурка человека",
    "description": "Стильная минималистичная фигурка для сборных моделей или коллекции. Прочный пластик.",
    "price": 550,
    "image_url": "/images/peggy_marco-white-male-1847751_1920.jpg"
  },
  {
    "title": "Танцующий Миньон",
    "description": "Веселый персонаж из любимого мультфильма. Подарит массу положительных эмоций и смеха.",
    "price": 1950,
    "image_url": "/images/stevepb-dancing-dave-minion-510835_1920.jpg"
  },
  {
    "title": "Набор деревянных кубиков",
    "description": "Экологически чистые игрушки из натурального дерева. Развивают мелкую моторику и логику.",
    "price": 2200,
    "image_url": "/images/theresamuth-toys-5993702_1920.jpg"
  },
  {
    "title": "Детский конструктор",
    "description": "Разноцветный набор для строительства городов и машин. Бесконечные возможности для творчества.",
    "price": 1750,
    "image_url": "/images/trimlack-childrens-toys-4412827_1920.jpg"
  }
];

async function seed() {
  try {
    console.log('Начинаю импорт данных...');

    for (const toy of toysData) {
      const query = `
        INSERT INTO toys (title, description, price, image_url)
        VALUES ($1, $2, $3, $4)
      `;
      const values = [toy.title, toy.description, toy.price, toy.image_url];

      await pool.query(query, values);
    }

    console.log('Данные успешно загружены!');
  } catch (err) {
    console.error('Ошибка:', err.message);
  } finally {
    await pool.end();
    process.exit();
  }
}

seed();