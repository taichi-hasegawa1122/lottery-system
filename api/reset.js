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
    '廣田 朱音'
];

// データファイルのパス
const getDataPath = () => {
    const dataDir = '/tmp/data';
    const dataFile = path.join(dataDir, 'results.json');
    return { dataDir, dataFile };
};

// データを保存する
function saveData(teams) {
    const { dataDir, dataFile } = getDataPath();
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(
            dataFile,
            JSON.stringify(teams, null, 2),
            'utf8'
        );
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

export default async function handler(req, res) {
    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Invalid request method'
        });
    }

    // 空のデータで初期化
    const teams = {};
    executives.forEach(exec => {
        teams[exec] = [];
    });

    // データを保存
    if (!saveData(teams)) {
        return res.status(500).json({
            success: false,
            message: 'データの保存に失敗しました。'
        });
    }

    return res.status(200).json({
        success: true,
        message: 'データをリセットしました。'
    });
}

