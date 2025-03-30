// 初始化物品数据
let itemsData = [];

// 从JSON文件加载数据
fetch('items.json')
    .then(response => response.json())
    .then(data => {
        itemsData = data;
        renderItems(itemsData);
        setupEventListeners();
    })
    .catch(error => {
        console.error('Error loading items data:', error);
        // 如果加载失败，使用示例数据
        itemsData = [
            {
                "物品名称": "皇家战靴",
                "品质": "神兵",
                "生命值": 400,
                "魔法值": 0,
                "回血": 15,
                "回蓝": 150,
                "护甲": 20,
                "攻击": 40,
                "攻速": 40,
                "移速": 522,
                "力量": 0,
                "敏捷": 0,
                "智力": 0,
                "暴击": 0,
                "分裂": 0,
                "减伤": 0,
                "吸血": 0,
                "闪避": 0,
                "魔抗": 0,
                "总生命": 400,
                "总魔法": 0,
                "总攻速": 40,
                "总护甲": 20,
                "三维": 0,
                "合成": "",
                "来源": "合成",
                "价格": 23700,
                "配方/掉落": "战士之足+紫晶之靴+黑血布鞋+碧空布鞋",
                "其他": "传送代替走路，回血回蓝瞬间移动"
            },
        ];
        renderItems(itemsData);
        setupEventListeners();
    });

// 渲染物品网格
function renderItems(items) {
    const itemsGrid = document.getElementById('itemsGrid');
    itemsGrid.innerHTML = '';
    
    items.forEach(item => {
        const itemCard = createItemCard(item);
        itemsGrid.appendChild(itemCard);
    });
}

// 创建单个物品卡片
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = item['物品名称'].replace(/\s+/g, '-');
    card.classList.add(getRarityClass(item['品质'])); // 将品质类直接添加到卡片
    
    // 物品头部（图标、名称、价格、品质）
    const header = document.createElement('div');
    header.className = 'item-header';
    
    const icon = document.createElement('div');
    icon.className = 'item-icon';
    
    // 生成图标文件名：去除空格等特殊字符
    const iconName = item['图标']
        .replace(/\s+/g, '-')  // 空格变横杠
        .replace(/[^\w-]/g, '') // 移除非字母数字字符
        .toLowerCase();        // 全小写
    
    // 尝试加载图标
    const img = document.createElement('img');
    img.src = `assets/icons/${iconName}.jpg`;
    img.alt = item['物品名称'];
    img.onerror = function() {
        // 如果图标不存在，使用默认图标
        this.onerror = null;
        this.src = 'assets/icons/default.jpg';
        // 或者使用字体图标备选方案
        // this.parentElement.innerHTML = `<i class="fas fa-question"></i>`;
    };
    icon.appendChild(img);
    
    const cost = document.createElement('span');
    cost.className = 'item-cost';
    cost.textContent = item['价格'] || '0';
    card.appendChild(cost);
    
    const title = document.createElement('div');
    title.className = 'item-title';
    
    const name = document.createElement('h3');
    name.className = 'item-name';
    name.textContent = item['物品名称'];
    
    const rarity = document.createElement('div');
    rarity.className = `item-rarity ${getRarityClass(item['品质'])}`;
    rarity.textContent = item['品质'];
    
    title.appendChild(name);
    title.appendChild(rarity);
    
    header.appendChild(icon);
    header.appendChild(title);
    
    // 物品属性
    const stats = document.createElement('div');
    stats.className = 'item-stats';
    
    // 添加主要属性
    if (item['生命值']) {
        stats.appendChild(createStatRow('生命值', `+${item['生命值']}`));
    }
    if (item['魔法值']) {
        stats.appendChild(createStatRow('魔法值', `+${item['魔法值']}`));
    }
    if (item['护甲']) {
        stats.appendChild(createStatRow('护甲', `+${item['护甲']}`));
    }
    if (item['攻击']) {
        stats.appendChild(createStatRow('攻击力', `+${item['攻击']}`));
    }
    if (item['攻速']) {
        stats.appendChild(createStatRow('攻击速度', `+${item['攻速']}`));
    }    
    if (item['回血']) {
        stats.appendChild(createStatRow('生命恢复', `+${item['回血']}`));
    }
    if (item['回蓝']) {
        stats.appendChild(createStatRow('魔法恢复', `+${item['回蓝']}`));
    }
    if (item['力量']) {
        stats.appendChild(createStatRow('力量', `+${item['力量']}`));
    }
    if (item['敏捷']) {
        stats.appendChild(createStatRow('敏捷', `+${item['敏捷']}`));
    }
    if (item['智力']) {
        stats.appendChild(createStatRow('智力', `+${item['智力']}`));
    }
    if (item['移速']) {
        stats.appendChild(createStatRow('移动速度', `+${item['移速']}`));
    }
    if (item['减伤']) {
        stats.appendChild(createStatRow('普通攻击伤害抵挡', `+${item['减伤']}`));
    }
    if (item['闪避']) {
        stats.appendChild(createStatRow('闪避', `+${item['闪避']}`));
    }
    if (item['吸血']) {
        stats.appendChild(createStatRow('生命偷取', `+${item['吸血']}`));
    }
    if (item['魔抗']) {
        stats.appendChild(createStatRow('魔法抗性', `+${item['魔抗']}`));
    }    
    if (item['暴击']) {
        stats.appendChild(createStatRow('暴击率', `+${item['暴击']}`));
    }  
    
// 物品描述（特殊效果）
const description = document.createElement('div');
description.className = 'item-description';

if (item['其他']) {
    // 1. 处理冷却时间
    const coolMatch = item['其他'].match(/(冷却时间|CD)\s*[:：]?\s*(\d+)\s*秒/);
    let mainText = item['其他'];
    let coolTime = null;
    
    if (coolMatch) {
        coolTime = coolMatch[2];
        mainText = mainText.replace(coolMatch[0], '').trim();
    }

    // 2. 初始化效果分类存储
    const effectGroups = {
        passive: [],
        active: [],
        unique: []
    };

    // 3. 改进的独特被动提取
    const extractUniquePassives = (text) => {
        const uniquePassives = [];
        const uniqueRegex = /(?:[。，、]\s*)*独特被动\s*[:：]\s*([^:：。]+)\s*[:：]\s*([^。]*)/g;
        
        let match;
        while ((match = uniqueRegex.exec(text)) !== null) {
            const passiveName = match[1].trim();
            const passiveDesc = match[2].trim();
            uniquePassives.push(`独特被动: ${passiveName}: ${passiveDesc}`);
            text = text.substring(0, match.index) + text.substring(match.index + match[0].length);
        }
        return { uniquePassives, remainingText: text };
    };

    // 4. 提取独特被动
    const { uniquePassives, remainingText } = extractUniquePassives(mainText);
    effectGroups.unique = uniquePassives;
    mainText = remainingText.replace(/[。，、]+/g, '。').replace(/。+/g, '。').trim();

    // 5. 分割主要效果
    const effects = mainText.split(/(?<=。)\s*(?=被动|主动|光环)/)
                          .filter(e => e.trim())
                          .map(e => e.replace(/[。，、]+$/, '').trim());

    // 6. 分类存储主要效果
    effects.forEach(effect => {
        effect = effect.replace(/[。，,]+$/, '').trim();
        if (effect.startsWith('主动')) {
            effectGroups.active.push(effect);
        } else if (effect.startsWith('被动') || effect.startsWith('光环')) {
            effectGroups.passive.push(effect);
        }
    });

    // 7. 显示函数
    const displayEffect = (effect, isUnique = false) => {
        const typeMatch = effect.match(/^(被动|主动|光环|独特被动)\s*[:：]\s*(.*)/);
        if (!typeMatch) return;

        const [_, type, content] = typeMatch;
        const p = document.createElement('p');
        
        // 设置样式类
        p.className = isUnique ? 'item-unique-passive' : 
                     type === '主动' ? 'item-active' : 
                     type === '光环' ? 'item-aura' : 'item-passive';

        // 确定显示类型
        const displayType = type === '主动' ? '主动' :
                          type === '光环' ? '光环' :
                          type === '独特被动' ? '独特被动' : '被动';

        // 创建标题span
        const titleSpan = document.createElement('span');
        titleSpan.className = `skill-title ${getRarityClass(item['品质'])}`;
        
        // 提取技能名称
        const nameMatch = content.match(/^([^,:：]+)/);
        const skillName = nameMatch ? nameMatch[0].trim() : '';
        
        // 设置标题文本
        titleSpan.textContent = `${displayType} - ${skillName}`;
        
        // 处理描述内容
        let descText = skillName ? content.substring(skillName.length) : content;
        descText = descText.replace(/^[:：]\s*/, ': ')
                         .replace(/,(\S)/g, ', $1')
                         .replace(/,\s*$/, '')
                         .trim();

        // 创建内容span
        const contentSpan = document.createElement('span');
        contentSpan.className = 'skill-content';
        contentSpan.textContent = descText;

        p.appendChild(titleSpan);
        p.appendChild(contentSpan);
        description.appendChild(p);
    };

    // 8. 按顺序显示效果
    effectGroups.passive.forEach(effect => displayEffect(effect));
    effectGroups.unique.forEach(effect => displayEffect(effect, true));
    effectGroups.active.forEach(effect => displayEffect(effect));

    // 9. 显示冷却时间
    if (coolTime) {
        const coolP = document.createElement('p');
        coolP.className = 'item-cooldown';
        coolP.style.fontSize = '0.85em';
        coolP.style.opacity = '0.7';
        coolP.innerHTML = `<span class="keyword">冷却时间: </span>${coolTime}秒`;
        description.appendChild(coolP);
    }
}
    // 合成路线
    const build = document.createElement('div');
    build.className = 'item-build';
    
    const buildTitle = document.createElement('div');
    buildTitle.className = 'build-title';
    
    const components = document.createElement('div');
    components.className = 'components';
    
    if (item['来源'] === '合成') {
        buildTitle.textContent = '合成路线';
        if (item['配方/掉落']) {
            const recipes = item['配方/掉落'].split('+');
            recipes.forEach(recipe => {
                const component = document.createElement('div');
                component.className = 'component';
                component.innerHTML = '<i class="fas fa-cube"></i>';
                component.title = recipe.trim();
                components.appendChild(component);
            });
        }
    } else if (item['来源'] === '掉落') {
        buildTitle.textContent = '掉落来源';
        components.textContent = item['配方/掉落'] || '怪物掉落';
    } else if (item['来源'] === '高级商店' || item['来源'] === '中级商店' || item['来源'] === '初级商店') {
        buildTitle.textContent = '购买来源';
        components.textContent = item['来源'];
    } else {
        buildTitle.textContent = '获取来源';
        components.textContent = item['来源'] || '商店购买';
    }
    
    build.appendChild(buildTitle);
    build.appendChild(components);
    
    // 背景文本
    const flavor = document.createElement('div');
    flavor.className = 'item-flavor';
    flavor.textContent = getFlavorText(item);
    
    // 组装卡片
    card.appendChild(header);
    card.appendChild(stats);
    card.appendChild(description);
    card.appendChild(build);
    card.appendChild(flavor);
    
    // 添加点击事件
    card.addEventListener('click', () => showItemDetails(item));
    
    return card;
}

// 创建属性行
function createStatRow(name, value) {
    const row = document.createElement('div');
    row.className = 'stat-row';
    
    const statName = document.createElement('span');
    statName.className = 'stat-name';
    statName.textContent = name;
    
    const statValue = document.createElement('span');
    statValue.className = 'stat-value';
    statValue.textContent = value;
    
    // 根据值设置颜色
    if (value.startsWith('+')) {
        statValue.classList.add('positive-stat');
    } else if (value.startsWith('-')) {
        statValue.classList.add('negative-stat');
    }
    
    row.appendChild(statName);
    row.appendChild(statValue);
    
    return row;
}

// 获取品质对应的CSS类
function getRarityClass(rarity) {
    switch(rarity) {
        case '神兵': return 'immemorial';
        case '传说': return 'legendary';
        case '史诗': return 'epic';
        case '精良': return 'rare';
        case '优秀': return 'uncommon';
        default: return 'common';
    }
}


// 获取背景文本
function getFlavorText(item) {
    return item['背景'] || "无";
}

// 设置事件监听器
function setupEventListeners() {
    // 关闭详情
    document.getElementById('closeDetails').addEventListener('click', function() {
        document.getElementById('itemDetails').style.display = 'none';
    });
    
    // 搜索功能
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredItems = itemsData.filter(item => 
            item['物品名称'].toLowerCase().includes(searchTerm) || 
            (item['其他'] && item['其他'].toLowerCase().includes(searchTerm))
        );
        renderItems(filteredItems);
    });
    
    // 品质过滤
    document.getElementById('rarityFilter').addEventListener('change', function(e) {
        applyFilters();
    });
    
    // 来源过滤
    document.getElementById('sourceFilter').addEventListener('change', function(e) {
        applyFilters();
    });
    
    // 属性过滤
    document.getElementById('statsFilter').addEventListener('change', function(e) {
        applyFilters();
    });
}

// 应用所有过滤器
function applyFilters() {
    const rarity = document.getElementById('rarityFilter').value;
    const source = document.getElementById('sourceFilter').value;
    const stat = document.getElementById('statsFilter').value;
    
    let filteredItems = [...itemsData];
    
    // 品质过滤
    if (rarity) {
        filteredItems = filteredItems.filter(item => item['品质'] === rarity);
    }
    
    // 来源过滤
    if (source) {
        filteredItems = filteredItems.filter(item => item['来源'] === source);
    }
    
    // 属性过滤
    if (stat) {
        // 将属性名称映射到数据中的键
        const statMap = {
            '生命值': '生命值',
            '魔法值': '魔法值',
            '生命恢复': '回血',
            '魔法恢复': '回蓝',
            '护甲': '护甲',
            '攻击力': '攻击',
            '攻击速度': '攻速',
            '移动速度': '移速',
            '力量': '力量',
            '敏捷': '敏捷',
            '智力': '智力',
            '暴击率': '暴击',
            '普通攻击伤害抵挡': '减伤',
            '生命偷取': '吸血',
            '闪避': '闪避',
            '魔法抗性': '魔抗'
        };
        
        const dataKey = statMap[stat];
        
        // 过滤出拥有该属性的物品
        filteredItems = filteredItems.filter(item => item[dataKey] && item[dataKey] > 0);
        
        // 按属性值降序排序
        filteredItems.sort((a, b) => {
            const valueA = a[dataKey] || 0;
            const valueB = b[dataKey] || 0;
            return valueB - valueA;
        });
    } else {
        // 如果没有选择属性，按价格降序排序
        filteredItems.sort((a, b) => {
            const priceA = a['价格'] || 0;
            const priceB = b['价格'] || 0;
            return priceB - priceA;
        });
    }
    
    renderItems(filteredItems);
}


// ...（后面的代码保持不变）