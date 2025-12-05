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
            message: 'Invalid request method'
        });
    }

    try {
        // 空のデータで初期化
        const teams = {};
        executives.forEach(exec => {
            teams[exec] = [];
        });

        // データを保存
        await kv.set('lottery_teams', teams);

        return res.status(200).json({
            success: true,
            message: 'データをリセットしました。'
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: 'サーバーエラーが発生しました。'
        });
    }
}
