import fs from 'fs';
import path from 'path';

// データファイルのパス
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
            message: 'Invalid request method'
        });
    }

    const { executive, member } = req.body;

    if (!executive || !member) {
        return res.status(400).json({
            success: false,
            message: '必要なパラメータが不足しています。'
        });
    }

    const { dataFile } = getDataPath();

    // データファイルが存在しない場合
    if (!fs.existsSync(dataFile)) {
        return res.status(404).json({
            success: false,
            message: 'データファイルが見つかりません。'
        });
    }

    // 既存データを読み込み
    let teams = loadData();

    if (!teams || typeof teams !== 'object') {
        return res.status(500).json({
            success: false,
            message: 'データの読み込みに失敗しました。'
        });
    }

    // 指定された幹部のチームが存在するか確認
    if (!teams[executive]) {
        return res.status(404).json({
            success: false,
            message: '指定された幹部が見つかりません。'
        });
    }

    // メンバーを削除
    const memberIndex = teams[executive].indexOf(member);
    if (memberIndex !== -1) {
        teams[executive].splice(memberIndex, 1);
        
        // データを保存
        if (!saveData(teams)) {
            return res.status(500).json({
                success: false,
                message: 'データの保存に失敗しました。'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'メンバーを削除しました。'
        });
    } else {
        return res.status(404).json({
            success: false,
            message: '指定されたメンバーが見つかりません。'
        });
    }
}

