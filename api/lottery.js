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

// データファイルのパス（Vercelの/tmpディレクトリを使用）
const getDataPath = () => {
    const dataDir = '/tmp/data';
    const dataFile = path.join(dataDir, 'results.json');
    return { dataDir, dataFile };
};

// データを読み込む
function loadData() {
    const { dataFile } = getDataPath();
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
            message: 'Method not allowed'
        });
    }

    const { name } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: 'お名前を入力してください。'
        });
    }

    const staffName = name.trim();

    // 既存データを読み込み
    let teams = loadData();

    // 初期化：幹部陣全員の配列を作成
    executives.forEach(exec => {
        if (!teams[exec]) {
            teams[exec] = [];
        }
    });

    // すでに登録済みかチェック
    for (const exec of executives) {
        if (teams[exec] && teams[exec].includes(staffName)) {
            return res.status(200).json({
                success: true,
                executive: exec,
                message: 'すでに登録済みです。'
            });
        }
    }

    // 最も人数が少ないチームを見つける
    let minCount = Infinity;
    const candidateExecs = [];

    executives.forEach(exec => {
        const count = teams[exec] ? teams[exec].length : 0;
        if (count < minCount) {
            minCount = count;
            candidateExecs.length = 0;
            candidateExecs.push(exec);
        } else if (count === minCount) {
            candidateExecs.push(exec);
        }
    });

    // 候補の中からランダムに選択
    const selectedExecutive = candidateExecs[Math.floor(Math.random() * candidateExecs.length)];

    // スタッフを追加
    if (!teams[selectedExecutive]) {
        teams[selectedExecutive] = [];
    }
    teams[selectedExecutive].push(staffName);

    // データを保存
    if (!saveData(teams)) {
        return res.status(500).json({
            success: false,
            message: 'データの保存に失敗しました。'
        });
    }

    // 結果を返す
    return res.status(200).json({
        success: true,
        executive: selectedExecutive
    });
}

