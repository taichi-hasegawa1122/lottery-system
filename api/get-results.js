import fs from 'fs';
import path from 'path';

// 幹部陣リスト
const executives = [
    '駒居 康樹',
    '木村 美月',
    '長谷川 太一',
    '村松 諒',
    '西川 慶一',
    '森本 風花',
    '安藤 凪',
    '廣田 朱音',
    '牟田 陸朗'
];

// データファイルのパス
const getDataPath = () => {
    const dataFile = '/tmp/data/results.json';
    return dataFile;
};

// データを読み込む
function loadData() {
    const dataFile = getDataPath();
    try {
        if (fs.existsSync(dataFile)) {
            const jsonData = fs.readFileSync(dataFile, 'utf8');
            return JSON.parse(jsonData);
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
    return {};
}

export default async function handler(req, res) {
    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    let teams = loadData();

    // 全幹部の配列を確保
    executives.forEach(exec => {
        if (!teams[exec]) {
            teams[exec] = [];
        }
    });

    return res.status(200).json({
        success: true,
        teams: teams
    });
}

