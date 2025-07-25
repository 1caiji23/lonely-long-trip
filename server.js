const express = require('express');
const OpenAI = require("openai");

const app = express();
app.use(express.static(__dirname));
app.use(express.json());

// 只保留一次实例化，并把 key 写进来
const client = new OpenAI({
    apiKey: 'sk-5mXMR6Ak8xA64kZE8uEOjwpM4wRf9q4nO9aXwIWfqQFTtqEZ',
    baseURL: "https://api.moonshot.cn/v1",
});

const fs = require('fs');
const promptContent = fs.readFileSync(__dirname + '/promot', 'utf8');
const prompt2Content = fs.readFileSync(__dirname + '/promot2', 'utf8');
let history = [{"role": "system", "content": promptContent}];

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const usePrompt2 = req.body.usePrompt2 || false;
    
    let currentHistory = [...history];
    
    // 如果使用promot2，替换系统提示词
    if (usePrompt2) {
        currentHistory = [{"role": "system", "content": prompt2Content}];
    }
    
    currentHistory.push({
        role: "user", content: userMessage
    });

    try {
        const completion = await client.chat.completions.create({
            model: "kimi-k2-0711-preview",
            messages: currentHistory,
        });

        const aiResponse = completion.choices[0].message.content;
        
        // 如果不使用promot2，才添加到历史记录
        if (!usePrompt2) {
            history.push({ role: "assistant", content: aiResponse });
        }

        res.json({ response: aiResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred with the AI service.' });
    }
});

// 添加获取助理提示词的端点
app.get('/get-assistant-prompt', (req, res) => {
    try {
        res.json({ prompt: prompt2Content });
    } catch (error) {
        console.error('读取助理提示词失败:', error);
        res.status(500).json({ error: '无法获取助理提示词' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
