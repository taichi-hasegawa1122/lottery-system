import { kv } from '@vercel/kv';

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

    try {
        // 既存データを読み込み
        let teams = await kv.get('lottery_teams') || {};

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
            await kv.set('lottery_teams', teams);
            
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
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: 'サーバーエラーが発生しました。'
        });
    }
}
