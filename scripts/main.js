document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const dialogBox = document.getElementById('dialog-box');
    const animationContainer = document.getElementById('animation-container');

    function startGame() {
        // Initial setup without welcome message
        dialogBox.classList.remove('hidden');
        dialogBox.style.opacity = '0';
        dialogBox.style.zIndex = '100';
        setTimeout(() => {
            dialogBox.style.transition = 'opacity 0.5s ease';
            dialogBox.style.opacity = '1';
        }, 100);
    }

    function endGame() {
        displayAnimation('Game Over', 3000);
        dialogBox.classList.add('hidden');
    }

    function triggerAchievement(achievement) {
        displayAnimation(`Achievement Unlocked: ${achievement}`, 3000);
    }

    function displayAnimation(message, duration, callback) {
        // Clear previous content
        animationContainer.innerHTML = '';
        animationContainer.classList.remove('hidden');
        
        // Create a container for the text
        const textContainer = document.createElement('div');
        textContainer.className = 'streaming-text';
        textContainer.style.opacity = '1';
        animationContainer.appendChild(textContainer);
        
        // Stream the message character by character
        streamText(message, textContainer, () => {
            // After streaming complete, wait for duration then fade out
            setTimeout(() => {
                animationContainer.style.transition = 'opacity 0.5s ease';
                animationContainer.style.opacity = '0';
                setTimeout(() => {
                    animationContainer.classList.add('hidden');
                    animationContainer.style.opacity = '1'; // Reset for next time
                    if (callback) callback();
                }, 500);
            }, duration);
        });
    }

    const userInput = document.getElementById('user-input');

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const message = userInput.value;
            if (message.trim() !== '') {
                sendMessage(message);
                userInput.value = '';
            }
        }
    });

    async function sendMessage(message) {
        // Display user message in animation container
        displayAnimation(`You: ${message}`, 2000);

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (response.ok) {
                const data = await response.json();
                processAIResponse(data.response);
            } else {
                processAIResponse('Error: Could not get a response from the server.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            processAIResponse('Error: Could not connect to the server.');
        }
    }

    function processAIResponse(response) {
        console.log('原始AI响应:', response);
        
        // 检测[]中内容
        const bracketMatch = response.match(/\[([^\]]*)\]/);
        if (bracketMatch) {
            const statusContent = bracketMatch[1];
            const cleanResponse = response.replace(/\[[^\]]*\]/g, '').trim();
            
            // 更新左上角状态显示
            updateStatusDisplay(statusContent);
            
            // 继续处理清理后的响应
            response = cleanResponse;
        }
        
        // 支持中文括号和英文括号
        const actionMatch = response.match(/[（(]([^）)]*)[）)]/);
        
        if (actionMatch) {
            console.log('检测到动作内容:', actionMatch);
            // Extract action content and clean response
            const actionContent = actionMatch[1];
            const cleanResponse = response.replace(/[（(][^）)]*[）)]/g, '').trim();
            
            console.log('动作内容:', actionContent);
            console.log('清理后的回复:', cleanResponse);
            
            // Enter action display mode，完成后检查成就
            enterActionMode(actionContent, cleanResponse, () => {
                // 动作展示完成后检查成就
                setTimeout(() => {
                    checkAchievements(response);
                }, 1000);
            });
        } else {
            console.log('未检测到括号内容，正常显示');
            // Normal display，完成后检查成就
            displayAnimation(`AI: ${response}`, 5000, () => {
                // AI文字显示完成后检查成就
                setTimeout(() => {
                    checkAchievements(response);
                }, 1000);
            });
        }
    }
    
    let currentStatus = '0';
    
    function updateStatusDisplay(newStatus) {
        const statusDisplay = document.getElementById('status-display');
        const statusValue = document.getElementById('status-value');
        
        // 确保状态显示始终可见
        statusDisplay.style.display = 'block';
        statusDisplay.style.visibility = 'visible';
        
        // 判断变化趋势
        const oldValue = parseInt(currentStatus) || 0;
        const newValue = parseInt(newStatus) || 0;
        
        let animationClass = 'changing';
        if (!isNaN(oldValue) && !isNaN(newValue)) {
            animationClass = newValue > oldValue ? 'increase' : 'decrease';
        }
        
        // 应用动画
        statusValue.classList.remove('changing', 'increase', 'decrease');
        statusValue.classList.add(animationClass);
        statusValue.textContent = newStatus;
        
        setTimeout(() => {
            statusValue.classList.remove(animationClass);
        }, 800);
        
        currentStatus = newStatus;
    }

    function enterActionMode(actionContent, cleanResponse, callback) {
        // Create overlay for dark background
        const overlay = document.createElement('div');
        overlay.id = 'action-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 1s ease;
        `;

        // Create action text container
        const actionText = document.createElement('div');
        actionText.id = 'action-text';
        actionText.style.cssText = `
            color: white;
            font-size: 2em;
            text-align: center;
            max-width: 80%;
            font-family: serif;
        `;

        overlay.appendChild(actionText);
        document.body.appendChild(overlay);

        // Fade in overlay
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 100);

        // Stream the action content
        streamText(actionContent, actionText, () => {
            // After streaming complete, wait and fade out
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    // Display the cleaned response
                    if (cleanResponse.trim()) {
                        displayAnimation(`Aleas: ${cleanResponse}`, 5000, callback);
                    } else if (callback) {
                        callback();
                    }
                }, 1000);
            }, 2000);
        });
    }

    function streamText(text, element, callback) {
        let index = 0;
        const speed = 100; // milliseconds per character
        
        function typeNext() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeNext, speed);
            } else {
                callback();
            }
        }
        
        element.textContent = '';
        typeNext();
    }

    // 成就系统
    let achievements = [];
    let unlockedAchievements = [];
    
    // 加载成就配置
    async function loadAchievements() {
        try {
            const response = await fetch('/achievements/achievements.json');
            const data = await response.json();
            achievements = data.achievements;
            console.log('成就加载成功:', achievements);
            
            // 创建成就UI
            createAchievementUI();
            
            // 预加载成就图片以提高性能
            preloadAchievementImages();
        } catch (error) {
            console.error('加载成就失败:', error);
        }
    }
    
    // 预加载成就图片以提高性能
    function preloadAchievementImages() {
        if (!achievements || !achievements.length) return;
        
        const imagePromises = achievements.map(achievement => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = achievement.image;
            });
        });
        
        Promise.allSettled(imagePromises).then(results => {
            console.log(`预加载完成: ${results.filter(r => r.status === 'fulfilled').length}/${results.length} 张图片`);
        });
    }
    
    // 创建成就UI
    function createAchievementUI() {
        const achievementPanel = document.createElement('div');
        achievementPanel.id = 'achievement-panel';
        achievementPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            z-index: 1001;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;
        
        // 使用网络图标
        const icon = document.createElement('img');
        icon.src = 'https://cdn-icons-png.flaticon.com/512/3208/3208615.png';
        icon.style.cssText = `
            width: 30px;
            height: 30px;
            filter: invert(1);
        `;
        
        // 成就数量徽章
        const badge = document.createElement('div');
        badge.id = 'achievement-badge';
        badge.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ff4444;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            display: none;
        `;
        
        // 创建成就详情弹窗
        const achievementDetail = document.createElement('div');
        achievementDetail.id = 'achievement-detail';
        achievementDetail.style.cssText = `
            position: fixed;
            top: 70px;
            right: 10px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 15px;
            border-radius: 10px;
            min-width: 250px;
            max-width: 300px;
            z-index: 1002;
            display: none;
            font-size: 14px;
        `;
        
        const title = document.createElement('div');
        title.textContent = '已解锁成就';
        title.style.cssText = 'font-weight: bold; margin-bottom: 10px; text-align: center;';
        
        const list = document.createElement('div');
        list.id = 'achievement-list';
        
        achievementDetail.appendChild(title);
        achievementDetail.appendChild(list);
        
        // 点击事件
        achievementPanel.addEventListener('click', () => {
            const detail = document.getElementById('achievement-detail');
            detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
        });
        
        // 悬停效果
        achievementPanel.addEventListener('mouseenter', () => {
            achievementPanel.style.transform = 'scale(1.1)';
        });
        
        achievementPanel.addEventListener('mouseleave', () => {
            achievementPanel.style.transform = 'scale(1)';
        });
        
        // 点击外部关闭
        document.addEventListener('click', (e) => {
            const detail = document.getElementById('achievement-detail');
            const panel = document.getElementById('achievement-panel');
            if (!detail.contains(e.target) && !panel.contains(e.target)) {
                detail.style.display = 'none';
            }
        });
        
        achievementPanel.appendChild(icon);
        achievementPanel.appendChild(badge);
        document.body.appendChild(achievementPanel);
        document.body.appendChild(achievementDetail);
    }
    
    // 检查成就触发
    function checkAchievements(response) {
        achievements.forEach(achievement => {
            if (unlockedAchievements.includes(achievement.id)) return;
            
            const hasKeyword = achievement.keywords.some(keyword => 
                response.toLowerCase().includes(keyword.toLowerCase())
            );
            
            if (hasKeyword) {
                unlockAchievement(achievement);
            }
        });
    }
    
    // 解锁成就
    function unlockAchievement(achievement) {
        unlockedAchievements.push(achievement.id);
        
        // 更新UI
        updateAchievementList();
        
        // 显示成就动画
        showAchievementUnlock(achievement);
    }
    
    // 更新成就列表
    function updateAchievementList() {
        const list = document.getElementById('achievement-list');
        const badge = document.getElementById('achievement-badge');
        
        // 更新徽章数量
        if (badge) {
            if (unlockedAchievements.length > 0) {
                badge.textContent = unlockedAchievements.length;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
        
        // 使用DocumentFragment优化DOM操作
        const fragment = document.createDocumentFragment();
        
        if (unlockedAchievements.length === 0) {
            const empty = document.createElement('div');
            empty.textContent = '暂无解锁成就';
            empty.style.cssText = 'text-align: center; opacity: 0.7; padding: 10px;';
            fragment.appendChild(empty);
        } else {
            // 批量创建成就项目
            const achievementItems = unlockedAchievements.map(id => {
                const achievement = achievements.find(a => a.id === id);
                if (!achievement) return null;
                
                const item = document.createElement('div');
                item.style.cssText = 'margin: 5px 0; padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 5px; display: flex; align-items: center;';
                
                // 添加成就图标
                const icon = document.createElement('img');
                icon.src = achievement.image;
                icon.style.cssText = 'width: 30px; height: 30px; margin-right: 10px; border-radius: 3px;';
                
                const info = document.createElement('div');
                const name = document.createElement('div');
                name.textContent = achievement.name;
                name.style.cssText = 'font-weight: bold; font-size: 12px;';
                
                const desc = document.createElement('div');
                desc.textContent = achievement.description;
                desc.style.cssText = 'font-size: 11px; opacity: 0.8; margin-top: 2px;';
                
                info.appendChild(name);
                info.appendChild(desc);
                
                item.appendChild(icon);
                item.appendChild(info);
                return item;
            }).filter(item => item !== null);
            
            // 一次性添加到fragment
            achievementItems.forEach(item => fragment.appendChild(item));
        }
        
        // 一次性更新DOM
        list.innerHTML = '';
        list.appendChild(fragment);
    }
    
    // 显示成就解锁动画
    function showAchievementUnlock(achievement) {
        const overlay = document.createElement('div');
        overlay.id = 'achievement-unlock-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 1002;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 1s ease;
        `;

        // 成就图标
        const icon = document.createElement('img');
        icon.src = achievement.image;
        icon.style.cssText = `
            width: 150px;
            height: 150px;
            margin-bottom: 20px;
            border-radius: 50%;
            border: 3px solid gold;
            animation: pulse 2s infinite;
        `;

        // 成就标题
        const title = document.createElement('div');
        title.textContent = '成就解锁！';
        title.style.cssText = `
            color: gold;
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        `;

        // 成就名称
        const name = document.createElement('div');
        name.textContent = achievement.name;
        name.style.cssText = `
            color: white;
            font-size: 2em;
            margin-bottom: 10px;
            text-align: center;
        `;

        // 成就描述
        const description = document.createElement('div');
        description.textContent = achievement.description;
        description.style.cssText = `
            color: #ccc;
            font-size: 1.2em;
            text-align: center;
            max-width: 400px;
        `;

        // 添加脉冲动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);

        overlay.appendChild(icon);
        overlay.appendChild(title);
        overlay.appendChild(name);
        overlay.appendChild(description);
        document.body.appendChild(overlay);

        // 淡入效果
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 100);

        // 3秒后淡出
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.head.removeChild(style);
            }, 1000);
        }, 3000);
    }



    // 视频控制功能
    function initVideoControls() {
        const bgVideo = document.getElementById('bg-video');
        const volumeToggle = document.getElementById('volume-toggle');
        const volumeSlider = document.getElementById('volume-slider');
        const fullscreenToggle = document.getElementById('fullscreen-toggle');
        
        if (!bgVideo || !volumeToggle || !volumeSlider || !fullscreenToggle) {
            console.error('Video control elements not found');
            return;
        }

        // 音量控制
        let isMuted = true;
        
        volumeToggle.addEventListener('click', () => {
            isMuted = !isMuted;
            bgVideo.muted = isMuted;
            
            const volumeIcon = volumeToggle.querySelector('img');
            if (isMuted) {
                volumeIcon.src = 'https://cdn-icons-png.flaticon.com/512/1082/1082587.png';
                volumeSlider.classList.remove('active');
            } else {
                volumeIcon.src = 'https://cdn-icons-png.flaticon.com/512/1082/1082553.png';
                volumeSlider.classList.add('active');
            }
        });

        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value;
            bgVideo.volume = volume;
            bgVideo.muted = volume === 0;
            
            if (volume > 0) {
                isMuted = false;
                const volumeIcon = volumeToggle.querySelector('img');
                volumeIcon.src = 'https://cdn-icons-png.flaticon.com/512/1082/1082553.png';
                volumeSlider.classList.add('active');
            }
        });

        // 全屏控制
        fullscreenToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (!document.fullscreenElement) {
                const gameContainer = document.documentElement;
                if (gameContainer.requestFullscreen) {
                    gameContainer.requestFullscreen().catch(err => {
                        console.error('Error attempting to enable fullscreen:', err);
                    });
                } else if (gameContainer.webkitRequestFullscreen) {
                    gameContainer.webkitRequestFullscreen();
                } else if (gameContainer.msRequestFullscreen) {
                    gameContainer.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        });

        // 监听全屏变化
        document.addEventListener('fullscreenchange', () => {
            const fullscreenIcon = fullscreenToggle.querySelector('img');
            if (document.fullscreenElement) {
                fullscreenIcon.src = 'https://cdn-icons-png.flaticon.com/512/748/748122.png';
            } else {
                fullscreenIcon.src = 'https://cdn-icons-png.flaticon.com/512/748/748138.png';
            }
        });
    }

    // Natex助理功能
    let natexSuggestions = [];
    
    function initAssistant() {
        const natexAssistant = document.getElementById('natex-assistant');
        const natexPanel = document.getElementById('natex-suggestions');
        const closeBtn = document.getElementById('close-natex');
        
        if (!natexAssistant || !natexPanel || !closeBtn) {
            console.error('Natex assistant elements not found');
            return;
        }
        
        // 显示Natex助理图标
        setTimeout(() => {
            natexAssistant.classList.remove('hidden');
        }, 1000);
        
        // 点击Natex助理图标
        natexAssistant.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (natexPanel.classList.contains('hidden')) {
                try {
                    // 先显示加载状态
                    displayLoadingState();
                    natexPanel.classList.remove('hidden');
                    natexPanel.style.display = 'block';
                    
                    const suggestions = await getAssistantSuggestions();
                    displaySuggestions(suggestions);
                } catch (error) {
                    console.error('Failed to get Natex suggestions:', error);
                    displaySuggestions(['连接失败，请检查网络或稍后重试']);
                }
            } else {
                natexPanel.classList.add('hidden');
                natexPanel.style.display = 'none';
            }
        });
        
        // 关闭建议面板
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            natexPanel.classList.add('hidden');
            natexPanel.style.display = 'none';
        });
        
        // 点击面板外部关闭
        document.addEventListener('click', (e) => {
            if (!natexPanel.contains(e.target) && !natexAssistant.contains(e.target)) {
                natexPanel.classList.add('hidden');
                natexPanel.style.display = 'none';
            }
        });
    }
    
    async function getAssistantSuggestions() {
        try {
            const promptResponse = await fetch('/get-assistant-prompt');
            if (!promptResponse.ok) {
                throw new Error('Failed to get assistant prompt');
            }
            
            const promptData = await promptResponse.json();
            const prompt = promptData.prompt;
            
            const chatResponse = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    message: prompt,
                    usePrompt2: true
                })
            });
            
            if (!chatResponse.ok) {
                throw new Error('Failed to get AI response');
            }
            
            const data = await chatResponse.json();
            return parseSuggestions(data.response);
        } catch (error) {
            console.error('获取建议失败:', error);
            throw error;
        }
    }
    
    function displayLoadingState() {
        const natexContent = document.querySelector('.natex-content');
        natexContent.innerHTML = '<div style="text-align: center; padding: 20px; opacity: 0.7;">量子神经网络正在计算中...</div>';
    }

    function displaySuggestions(suggestions) {
        const natexContent = document.querySelector('.natex-content');
        natexContent.innerHTML = '';
        
        suggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'natex-item';
            item.style.cursor = 'pointer';
            item.style.transition = 'background-color 0.2s ease';
            item.style.padding = '10px';
            item.style.margin = '5px 0';
            item.style.borderRadius = '5px';
            item.innerHTML = `<strong>${index + 1}.</strong> ${suggestion}`;
            
            // 添加悬停效果
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = 'transparent';
            });
            
            // 添加点击事件
            item.addEventListener('click', () => {
                selectSuggestion(suggestion);
            });
            
            natexContent.appendChild(item);
        });
    }
    
    function parseSuggestions(response) {
        // 清理响应文本
        const cleanResponse = response.trim();
        if (!cleanResponse) {
            return ['AI正在思考中，请稍后重试...'];
        }
        
        const suggestions = [];
        
        // 方法1: 查找明确编号的建议 (1. 2. 3. 或 1、2、3、)
        const numberedMatches = cleanResponse.match(/(?:^|\n)(?:\d+|[一二三四五六七八九十]+)[.、]\s*([^\n]+)/g);
        if (numberedMatches && numberedMatches.length >= 1) {
            suggestions.push(...numberedMatches.map(match => 
                match.replace(/^(?:\d+|[一二三四五六七八九十]+)[.、]\s*/, '').trim()
            ));
        }
        
        // 方法2: 查找以-或•开头的建议
        if (suggestions.length === 0) {
            const bulletMatches = cleanResponse.match(/(?:^|\n)[\s]*[-•·]\s*([^\n]+)/g);
            if (bulletMatches && bulletMatches.length >= 1) {
                suggestions.push(...bulletMatches.map(match => 
                    match.replace(/^[\s]*[-•·]\s*/, '').trim()
                ));
            }
        }
        
        // 方法3: 按句子分割，寻找完整的建议句子
        if (suggestions.length === 0) {
            const sentences = cleanResponse.split(/[。！？\n]+/).filter(s => s.trim().length > 5);
            suggestions.push(...sentences.slice(0, 3).map(s => s.trim()));
        }
        
        // 方法4: 如果以上都失败，按段落分割
        if (suggestions.length === 0) {
            const paragraphs = cleanResponse.split(/\n\n+/).filter(p => p.trim().length > 5);
            suggestions.push(...paragraphs.slice(0, 3).map(p => p.trim()));
        }
        
        // 清理和验证建议
        const validSuggestions = suggestions
            .map(s => s.replace(/^["']|["']$/g, '').trim()) // 移除引号
            .filter(s => s.length > 2 && s.length < 100) // 限制长度
            .slice(0, 3); // 最多3条
        
        // 确保至少有1条有效建议
        if (validSuggestions.length === 0) {
            return [cleanResponse.substring(0, 80) + (cleanResponse.length > 80 ? '...' : '')];
        }
        
        return validSuggestions;
    }

    function selectSuggestion(suggestion) {
        // 将建议发送到聊天
        sendMessage(suggestion);
        
        // 关闭建议面板
        const natexPanel = document.getElementById('natex-suggestions');
        natexPanel.classList.add('hidden');
        natexPanel.style.display = 'none';
    }

    // 修改server.js以支持使用promot2
    async function modifyServerForAssistant() {
        // 这个函数将在服务器端处理，客户端不需要
    }

    // 初始化
    loadAchievements();
    initVideoControls();
    
    // Start the game
    startGame();
    
    // 初始化助手
    initAssistant();
});
