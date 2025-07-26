const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.static(__dirname));
app.use(express.json());

// 火山引擎API配置
const VOLC_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const VOLC_API_KEY = 'Bearer f26f57ca-4301-4eb7-8e5e-0bde835ad73f'; // 从api文件获取的token

const fs = require('fs');
const promptContent = fs.readFileSync(__dirname + '/promot', 'utf8');
const prompt2Content = fs.readFileSync(__dirname + '/promot2', 'utf8');
// 加载 promot_final 内容
const promptFinalContent = fs.readFileSync(__dirname + '/promot_final', 'utf8');
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
        let completion;
if (req.body.final) {
    currentHistory = [{"role": "system", "content": promptFinalContent}];
}
try {
    const response = await axios.post(VOLC_API_URL, {
        model: "doubao-seed-1-6-flash-250715",
        messages: currentHistory
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': VOLC_API_KEY
        }
    });
    completion = { choices: [{ message: { content: response.data.choices[0].message.content } }] };
} catch (error) {
    throw new Error('火山API调用失败: ' + error.message);
}

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
