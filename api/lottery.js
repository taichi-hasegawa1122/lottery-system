import { kv } from '@vercel/kv';

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

    try {
        // 既存データを読み込み
        let teams = await kv.get('lottery_teams') || {};

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
        await kv.set('lottery_teams', teams);

        // 結果を返す
        return res.status(200).json({
            success: true,
            executive: selectedExecutive
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: 'サーバーエラーが発生しました。'
        });
    }
}
