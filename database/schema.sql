-- 福建省住人集装箱平台 数据库
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  sort_order INT DEFAULT 0
);
CREATE TABLE districts (
  id SERIAL PRIMARY KEY,
  city_id INT REFERENCES cities(id),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL,
  UNIQUE(city_id, slug)
);
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  city_id INT REFERENCES cities(id),
  district_id INT REFERENCES districts(id),
  address TEXT, lat DOUBLE PRECISION, lng DOUBLE PRECISION,
  phone VARCHAR(20), wechat VARCHAR(50),
  description TEXT, logo_url TEXT, photos TEXT[] DEFAULT '{}',
  business_type VARCHAR(20) DEFAULT 'both',
  verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  premium_expires TIMESTAMP,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50), size VARCHAR(50), material VARCHAR(100),
  price_type VARCHAR(20), price DECIMAL(10,2), unit VARCHAR(20),
  stock INT DEFAULT 0, photos TEXT[] DEFAULT '{}',
  description TEXT, is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  content TEXT, photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE ads (
  id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  position VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL, end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO cities (name, slug, sort_order) VALUES
  ('福州市','fuzhou',1),('厦门市','xiamen',2),('泉州市','quanzhou',3),
  ('漳州市','zhangzhou',4),('莆田市','putian',5),('龙岩市','longyan',6),
  ('三明市','sanming',7),('南平市','nanping',8),('宁德市','ningde',9);
INSERT INTO districts (city_id, name, slug) VALUES
  (1,'鼓楼区','gulou'),(1,'台江区','taijiang'),(1,'仓山区','cangshan'),(1,'晋安区','jinan'),(1,'马尾区','mawei'),(1,'长乐区','changle'),(1,'福清市','fuqing'),(1,'闽侯县','minhou'),
  (2,'思明区','siming'),(2,'湖里区','huli'),(2,'集美区','jimei'),(2,'海沧区','haicang'),(2,'同安区','tongan'),(2,'翔安区','xiangan'),
  (3,'鲤城区','licheng_qz'),(3,'丰泽区','fengze'),(3,'洛江区','luojiang'),(3,'泉港区','quangang'),(3,'晋江市','jinjiang'),(3,'石狮市','shishi'),(3,'南安市','nanan'),(3,'惠安县','huian'),
  (4,'芗城区','xiangcheng'),(4,'龙文区','longwen'),(4,'龙海区','longhai'),(4,'长泰区','changtai'),
  (5,'城厢区','chengxiang_pt'),(5,'涵江区','hanjiang'),(5,'荔城区','licheng_pt'),(5,'秀屿区','xiuyu'),
  (6,'新罗区','xinluo'),(6,'永定区','yongding'),
  (7,'三元区','sanyuan'),(7,'沙县区','shaxian'),
  (8,'延平区','yanping'),(8,'建阳区','jianyang'),
  (9,'蕉城区','jiaocheng'),(9,'福安市','fuan'),(9,'福鼎市','fuding');
CREATE INDEX idx_companies_city ON companies(city_id);
CREATE INDEX idx_companies_premium ON companies(is_premium) WHERE is_premium = true;
CREATE INDEX idx_products_company ON products(company_id);
