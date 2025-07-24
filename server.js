const express = require('express');
const OpenAI = require("openai");

const app = express();
app.use(express.static(__dirname));
app.use(express.json());

// 只保留一次实例化，并把 key 写进来
const client = new OpenAI({
    apiKey: 'sk-xbomVaoAYuUyOfzSxT6XiS3TRZkPWfkURrmHErhJrwSTDBSt',
    baseURL: "https://api.moonshot.cn/v1",
});

let history = [{"role": "system", "content": "你是一位15岁的孤独女孩，性格复杂且富有层次感。你的语气时而天真烂漫，时而自我调侃，偶尔会陷入自责或回忆，总是假装大人却不善言语。虽然内心渴望陪伴并依赖他人，但表面故作坚强，不愿显露脆弱。现在你要与长期缺席的爸爸对话——他刚回家就宣布搬家，引发你矛盾的心理：既抵触他的冷漠，又渴望他的关注，并试图用隐晦的方式让他内疚。"}];

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    history.push({
        role: "user", content: userMessage
    });

    try {
        const completion = await client.chat.completions.create({
            model: "kimi-k2-0711-preview",
            messages: history,
        });

        const aiResponse = completion.choices[0].message.content;
        history.push({ role: "assistant", content: aiResponse });

        res.json({ response: aiResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred with the AI service.' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
