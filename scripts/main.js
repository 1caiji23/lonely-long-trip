// 游戏菜单功能
function showMenu() {
    const gameMenu = document.getElementById('game-menu');
    const gameMain = document.getElementById('game-main');
    
    // 显示菜单，隐藏游戏主界面
    gameMenu.classList.remove('hidden');
    gameMain.classList.add('hidden');
}

function startGame() {
    const gameMenu = document.getElementById('game-menu');
    const gameMain = document.getElementById('game-main');
    
    // 隐藏菜单，显示游戏主界面
    gameMenu.classList.add('hidden');
    gameMain.classList.remove('hidden');
    
    // 开场独白 - 分割成多行
    const introLines = [
        "将东西安置在悬浮列车上，我终于可以长长吐口气",
        "好久没看到Aleas了",
        "这次搬家终于再见面了",
        "虽然Aleas是ai仿生人",
        "但她很懂事，很听话，我也很爱她",
        "不过ai比人类强本就是不用争论的事情啦",
        "当时看到Aleas乖巧聪明的模样就决定收养她了",
        "不过，今天见到亲人，Aleas怎么不像小时候跑来大呼小叫了",
        "果然是成长了吗？",
        "......"
    ];
    
    // 创建逐行显示的动画效果
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

    // 逐行显示和消失的动画函数
    let currentLineIndex = 0;
    
    function showNextLine() {
        if (currentLineIndex < introLines.length) {
            // 清空当前文本
            actionText.textContent = '';
            
            // 显示当前行
            const currentLine = introLines[currentLineIndex];
            let charIndex = 0;
            
            function typeCharacter() {
                if (charIndex < currentLine.length) {
                    actionText.textContent += currentLine.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeCharacter, 100);
                } else {
                    // 当前行显示完成后，等待一段时间然后消失
                    setTimeout(() => {
                        // 淡出效果
                        actionText.style.transition = 'opacity 0.5s ease';
                        actionText.style.opacity = '0';
                        
                        setTimeout(() => {
                            // 重置透明度，准备下一行
                            actionText.style.opacity = '1';
                            actionText.textContent = '';
                            currentLineIndex++;
                            
                            // 显示下一行
                            setTimeout(showNextLine, 300);
                        }, 500);
                    }, 1500);
                }
            }
            
            typeCharacter();
        } else {
            // 所有行显示完毕，淡出并结束
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    initGame();
                }, 1000);
            }, 500);
        }
    }
    
    // 开始逐行显示
    showNextLine();
}

function exitGame() {
    // 退出游戏确认
    if (confirm('确定要退出游戏吗？')) {
        // 关闭窗口或返回上一页
        window.close();
        // 如果window.close()无效，尝试返回上一页
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // 如果无法返回，显示退出信息
            displayAnimation('感谢游戏！再见！', 2000);
            setTimeout(() => {
                document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: white; font-size: 24px;">游戏已结束</div>';
            }, 2000);
        }
    }
}

function initGame() {
    const gameContainer = document.getElementById('game-container');
    const dialogBox = document.getElementById('dialog-box');
    const animationContainer = document.getElementById('animation-container');

    // 初始化游戏状态
    if (typeof updateStatusDisplay === 'function') {
        updateStatusDisplay('准备就绪');
    }
    
    // 显示对话框
    dialogBox.classList.remove('hidden');
    dialogBox.style.opacity = '0';
    dialogBox.style.zIndex = '100';
    setTimeout(() => {
        dialogBox.style.transition = 'opacity 0.5s ease';
        dialogBox.style.opacity = '1';
    }, 100);
}

// 全局函数定义
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

function displayAnimation(message, duration, callback) {
    const animationContainer = document.getElementById('animation-container');
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

function endGame() {
    const dialogBox = document.getElementById('dialog-box');
    displayAnimation('Game Over', 3000);
    dialogBox.classList.add('hidden');
}

function triggerAchievement(achievement) {
    displayAnimation(`Achievement Unlocked: ${achievement}`, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const dialogBox = document.getElementById('dialog-box');
    const animationContainer = document.getElementById('animation-container');

    const userInput = document.getElementById('user-input');

    // 输入框音频波动效果 - 改为波动的长线
    userInput.addEventListener('input', (event) => {
        const value = event.target.value;
        const intensity = Math.min(value.length / 15, 1);
        
        // 获取波动线元素
        const waveLine = document.querySelector('.audio-wave-line');
        const musicPulse = document.querySelector('.music-pulse');
        
        if (waveLine && musicPulse) {
            // 根据输入强度调整波动速度
            const duration = 2 - (intensity * 1);
            const waveSpeed = Math.max(duration, 0.5);
            
            waveLine.style.setProperty('--wave-duration', `${waveSpeed}s`);
            waveLine.style.animationDuration = `${waveSpeed}s`;
            
            // 增强颜色辐射强度
            const glowIntensity = 0.8 + (intensity * 1.2);
            const pulseSize = 420 + (intensity * 200);
            
            waveLine.style.setProperty('--glow-intensity', glowIntensity);
            waveLine.style.boxShadow = `0 0 ${20 + intensity * 40}px rgba(0, 188, 212, ${glowIntensity}), 0 0 ${40 + intensity * 60}px rgba(33, 150, 243, ${glowIntensity * 0.8}), 0 0 ${60 + intensity * 80}px rgba(0, 188, 212, ${glowIntensity * 0.6})`;
            
            musicPulse.style.width = `${pulseSize}px`;
            musicPulse.style.animationDuration = `${1.5 - intensity * 0.8}s`;
            
            // 添加音乐频率变化
            const hue = 180 + (intensity * 60);
            waveLine.style.filter = `hue-rotate(${hue}deg) brightness(${1 + intensity * 0.3})`;
        }

        // 增强输入框的发光效果
        userInput.style.boxShadow = `0 0 ${30 + intensity * 40}px rgba(0, 188, 212, ${0.4 + intensity * 0.6}), 0 0 ${60 + intensity * 60}px rgba(33, 150, 243, ${0.2 + intensity * 0.4})`;
        userInput.style.transform = `scale(${1 + intensity * 0.08})`;
    });

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
        
        // 确保面板初始状态是隐藏的
        natexPanel.classList.add('hidden');
        natexPanel.style.display = 'none';
        
        // 显示Natex助理图标
        setTimeout(() => {
            natexAssistant.classList.remove('hidden');
        }, 1000);
        
        // 点击Natex助理图标
        natexAssistant.addEventListener('click', async (e) => {
            e.preventDefault();
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
            e.preventDefault();
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
        
        // 阻止面板内部的点击事件冒泡
        natexPanel.addEventListener('click', (e) => {
            e.stopPropagation();
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
    
    // 显示菜单，不自动启动游戏
    showMenu();
    
    // 初始化助手
    initAssistant();
});

// AI操作系统功能
let aiOS = null;
let currentApp = null;

// 初始化AI操作系统
document.addEventListener('DOMContentLoaded', function() {
    const terminalIcon = document.createElement('div');
    terminalIcon.className = 'terminal-icon';
    terminalIcon.innerHTML = '<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgNkgyMVYyMEgzVjZaTTYgOUwxIDlMMSAxNUw2IDE1TDYgOVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik05IDEySDE1IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZD0iTTkgMTZIMTUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K" alt="Terminal">';
    document.body.appendChild(terminalIcon);

    aiOS = document.getElementById('ai-os');
    
    terminalIcon.addEventListener('click', openAIOS);
    
    // 关闭按钮事件
    const closeBtn = document.querySelector('#ai-os .os-header button');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAIOS);
    }
    
    // 重置AI记忆按钮
    const resetBtn = document.getElementById('reset-ai-memory');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAIMemory);
    }
    
    // 应用点击事件
    initApps();
});

function openAIOS() {
    if (aiOS) {
        aiOS.style.display = 'flex';
        showApp('home');
    }
}

function closeAIOS() {
    if (aiOS) {
        aiOS.style.display = 'none';
    }
}

function initApps() {
    const appItems = document.querySelectorAll('.app-item');
    appItems.forEach(item => {
        item.addEventListener('click', function() {
            const appType = this.dataset.app;
            showApp(appType);
        });
    });
}

function showApp(appType) {
    // 隐藏所有应用面板
    document.querySelectorAll('.app-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    
    // 隐藏应用网格（当选择具体应用时）
    const appGrid = document.querySelector('.app-grid');
    if (appGrid && appType !== 'home') {
        appGrid.style.display = 'none';
    } else if (appGrid) {
        appGrid.style.display = 'grid';
        return;
    }
    
    currentApp = appType;
    
    switch(appType) {
        case 'novel':
            document.getElementById('app-novel').classList.remove('hidden');
            break;
        case 'music':
            document.getElementById('app-music').classList.remove('hidden');
            loadMusicPlayer();
            break;
        case 'weather':
            loadWeather();
            document.getElementById('app-weather').classList.remove('hidden');
            break;
        case 'news':
            loadNews();
            document.getElementById('app-news').classList.remove('hidden');
            break;
        case 'translate':
            loadTranslator();
            document.getElementById('app-translate').classList.remove('hidden');
            break;
        case 'jokes':
            loadJokes();
            document.getElementById('app-jokes').classList.remove('hidden');
            break;
    }
}

async function resetAIMemory() {
    try {
        const response = await fetch('/api/reset-memory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('AI记忆已重置！');
            closeAIOS();
        } else {
            alert('重置失败：' + (result.error || '未知错误'));
        }
    } catch (error) {
        console.error('重置AI记忆失败:', error);
        alert('重置失败，请检查网络连接');
    }
}

// 小说搜索功能 - 使用WolneLektury.pl API，带模拟数据后备
async function searchNovels() {
    const query = document.getElementById('novel-search').value;
    if (!query.trim()) return;
    
    const resultsDiv = document.getElementById('novel-results');
    resultsDiv.innerHTML = '<p>正在搜索波兰免费文学作品...</p>';
    
    try {
        // 使用WolneLektury.pl API
        const response = await fetch(`https://wolnelektury.pl/api/books/?search=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            displayBooks(data.slice(0, 10), resultsDiv);
        } else {
            // 如果没有直接匹配，尝试按作者搜索
            const authorResponse = await fetch(`https://wolnelektury.pl/api/authors/`);
            const authors = await authorResponse.json();
            const matchingAuthors = authors.filter(author => 
                author.name.toLowerCase().includes(query.toLowerCase())
            );
            
            if (matchingAuthors.length > 0) {
                resultsDiv.innerHTML = '<p>找到相关作者，正在获取作品...</p>';
                const authorBooks = await fetch(`${matchingAuthors[0].href}books/`);
                const books = await authorBooks.json();
                displayBooks(books.slice(0, 5), resultsDiv, matchingAuthors[0].name);
            } else {
                showMockBooks(query, resultsDiv);
            }
        }
    } catch (error) {
        console.warn('WolneLektury API调用失败，使用模拟数据', error);
        showMockBooks(query, resultsDiv);
    }
}

// 显示书籍列表
function displayBooks(books, resultsDiv, authorName = null) {
    resultsDiv.innerHTML = '';
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.style.cssText = 'margin-bottom: 15px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; transition: background 0.3s ease;';
        bookDiv.innerHTML = `
            <h4>${book.title}</h4>
            <p><strong>作者:</strong> ${book.author || authorName || '未知'}</p>
            <p><strong>体裁:</strong> ${book.kind || '未分类'}</p>
            <p><strong>时代:</strong> ${book.epoch || '未知'}</p>
            <p><strong>类型:</strong> ${book.genre || '未知'}</p>
            <p><strong>语言:</strong> ${book.language || '波兰语'}</p>
        `;
        
        bookDiv.addEventListener('click', () => {
            loadBookDetails(book.href || book);
        });
        
        resultsDiv.appendChild(bookDiv);
    });
}

// 显示模拟数据
function showMockBooks(query, resultsDiv) {
    const mockBooks = [
        {
            title: "《${query}相关作品》",
            author: "亚当·密茨凯维支",
            kind: "诗歌",
            epoch: "浪漫主义",
            genre: "史诗",
            language: "波兰语",
            fragment: "这是波兰文学的瑰宝..."
        },
        {
            title: "《${query}经典选集》",
            author: "亨利克·显克微支",
            kind: "小说",
            epoch: "现实主义",
            genre: "历史小说",
            language: "波兰语",
            fragment: "诺贝尔文学奖获奖作品..."
        },
        {
            title: "《${query}现代解读》",
            author: "维斯瓦娃·辛波丝卡",
            kind: "诗歌",
            epoch: "现代主义",
            genre: "抒情诗",
            language: "波兰语",
            fragment: "诺贝尔文学奖女诗人作品..."
        }
    ];
    
    resultsDiv.innerHTML = '<p>使用模拟数据展示波兰文学作品：</p>';
    displayMockBooks(mockBooks, resultsDiv);
}

// 显示模拟书籍
function displayMockBooks(books, resultsDiv) {
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.style.cssText = 'margin-bottom: 15px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; transition: background 0.3s ease;';
        bookDiv.innerHTML = `
            <h4>${book.title}</h4>
            <p><strong>作者:</strong> ${book.author}</p>
            <p><strong>体裁:</strong> ${book.kind}</p>
            <p><strong>时代:</strong> ${book.epoch}</p>
            <p><strong>类型:</strong> ${book.genre}</p>
            <p><strong>语言:</strong> ${book.language}</p>
            ${book.fragment ? `<p><strong>片段:</strong> ${book.fragment}</p>` : ''}
        `;
        
        bookDiv.addEventListener('click', () => {
            showMockBookDetails(book);
        });
        
        resultsDiv.appendChild(bookDiv);
    });
}

// 获取书籍详细信息
async function loadBookDetails(bookUrl) {
    const resultsDiv = document.getElementById('novel-results');
    resultsDiv.innerHTML = '<p>正在加载详细信息...</p>';
    
    try {
        if (typeof bookUrl === 'string' && bookUrl.startsWith('http')) {
            // 真实API调用
            const response = await fetch(bookUrl);
            const book = await response.json();
            
            resultsDiv.innerHTML = `
                <div style="padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    <h2>${book.title}</h2>
                    <p><strong>作者:</strong> ${book.author || '未知'}</p>
                    <p><strong>体裁:</strong> ${book.kind || '未分类'}</p>
                    <p><strong>时代:</strong> ${book.epoch || '未知'}</p>
                    <p><strong>类型:</strong> ${book.genre || '未知'}</p>
                    <p><strong>语言:</strong> ${book.language || '波兰语'}</p>
                    ${book.fragment ? `<p><strong>片段:</strong> ${book.fragment}</p>` : ''}
                    ${book.audiobook ? `<p><strong>有声读物:</strong> <a href="${book.audiobook}" target="_blank" style="color: #00BCD4;">点击收听</a></p>` : ''}
                    <button onclick="searchNovels()" style="margin-top: 15px; padding: 8px 15px; background: rgba(0,188,212,0.3); color: white; border: none; border-radius: 5px; cursor: pointer;">返回搜索结果</button>
                </div>
            `;
        } else {
            // 模拟数据详情
            showMockBookDetails(bookUrl);
        }
    } catch (error) {
        console.warn('加载详细信息失败，使用模拟数据', error);
        showMockBookDetails(bookUrl);
    }
}

// 显示模拟书籍详情
function showMockBookDetails(book) {
    const resultsDiv = document.getElementById('novel-results');
    resultsDiv.innerHTML = `
        <div style="padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px;">
            <h2>${book.title}</h2>
            <p><strong>作者:</strong> ${book.author}</p>
            <p><strong>体裁:</strong> ${book.kind}</p>
            <p><strong>时代:</strong> ${book.epoch}</p>
            <p><strong>类型:</strong> ${book.genre}</p>
            <p><strong>语言:</strong> ${book.language}</p>
            ${book.fragment ? `<p><strong>片段:</strong> ${book.fragment}</p>` : ''}
            <p><strong>简介:</strong> 这是波兰文学的经典作品，展现了波兰文学的深厚底蕴和独特魅力。</p>
            <button onclick="searchNovels()" style="margin-top: 15px; padding: 8px 15px; background: rgba(0,188,212,0.3); color: white; border: none; border-radius: 5px; cursor: pointer;">返回搜索结果</button>
        </div>
    `;
}

// 按体裁浏览功能
async function browseByGenre() {
    const resultsDiv = document.getElementById('novel-results');
    resultsDiv.innerHTML = '<p>正在加载文学体裁...</p>';
    
    try {
        const response = await fetch('https://wolnelektury.pl/api/genres/');
        const genres = await response.json();
        
        resultsDiv.innerHTML = '<h3>文学体裁</h3>';
        genres.forEach(genre => {
            const genreDiv = document.createElement('div');
            genreDiv.style.cssText = 'margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer;';
            genreDiv.innerHTML = `<strong>${genre.name}</strong>`;
            genreDiv.addEventListener('click', () => loadBooksByGenre(genre.href));
            resultsDiv.appendChild(genreDiv);
        });
    } catch (error) {
        console.warn('加载体裁失败，使用模拟数据', error);
        showMockGenres();
    }
}

// 显示模拟体裁列表
function showMockGenres() {
    const resultsDiv = document.getElementById('novel-results');
    const mockGenres = [
        { name: '叙事文学', href: 'epika' },
        { name: '抒情诗', href: 'liryka' },
        { name: '戏剧', href: 'dramat' },
        { name: '小说', href: 'powiesc' },
        { name: '短篇小说', href: 'opowiadanie' }
    ];
    
    resultsDiv.innerHTML = '<h3>文学体裁</h3>';
    mockGenres.forEach(genre => {
        const genreDiv = document.createElement('div');
        genreDiv.style.cssText = 'margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer;';
        genreDiv.innerHTML = `<strong>${genre.name}</strong>`;
        genreDiv.addEventListener('click', () => loadBooksByGenre(genre.href));
        resultsDiv.appendChild(genreDiv);
    });
}

// 按体裁获取书籍
async function loadBooksByGenre(genreUrl) {
    const resultsDiv = document.getElementById('novel-results');
    resultsDiv.innerHTML = '<p>正在获取该体裁的作品...</p>';
    
    try {
        if (typeof genreUrl === 'string' && genreUrl.startsWith('http')) {
            const response = await fetch(`${genreUrl}books/`);
            const books = await response.json();
            displayBooks(books);
        } else {
            showMockBooksByGenre(genreUrl);
        }
    } catch (error) {
        console.warn('加载书籍失败，使用模拟数据', error);
        showMockBooksByGenre(genreUrl);
    }
}

// 显示模拟体裁书籍
function showMockBooksByGenre(genreSlug) {
    const mockBooks = [
        {
            title: `${genreSlug}体裁代表作品`,
            author: '波兰文学大师',
            epoch: '现代',
            href: { title: `${genreSlug}体裁代表作品`, author: '波兰文学大师', kind: genreSlug, epoch: '现代', genre: genreSlug, language: '波兰语' }
        },
        {
            title: `${genreSlug}体裁经典之作`,
            author: '波兰著名作家',
            epoch: '当代',
            href: { title: `${genreSlug}体裁经典之作`, author: '波兰著名作家', kind: genreSlug, epoch: '当代', genre: genreSlug, language: '波兰语' }
        }
    ];
    
    displayMockBooks(mockBooks);
}

// 显示书籍列表的辅助函数
function displayBooks(books) {
    const resultsDiv = document.getElementById('novel-results');
    resultsDiv.innerHTML = '';
    
    if (!books || books.length === 0) {
        resultsDiv.innerHTML = '<p>未找到相关书籍</p>';
        return;
    }
    
    books.slice(0, 10).forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.style.cssText = 'margin-bottom: 15px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer;';
        bookDiv.innerHTML = `
            <h4>${book.title}</h4>
            <p><strong>作者:</strong> ${book.author || '未知'}</p>
            <p><strong>时代:</strong> ${book.epoch || '未知'}</p>
            <p><strong>体裁:</strong> ${book.kind || book.genre || '未分类'}</p>
        `;
        bookDiv.addEventListener('click', () => loadBookDetails(book.href || book));
        resultsDiv.appendChild(bookDiv);
    });
}

// 显示模拟书籍列表
function displayMockBooks(books) {
    const resultsDiv = document.getElementById('novel-results');
    resultsDiv.innerHTML = '';
    
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.style.cssText = 'margin-bottom: 15px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer;';
        bookDiv.innerHTML = `
            <h4>${book.title}</h4>
            <p><strong>作者:</strong> ${book.author}</p>
            <p><strong>时代:</strong> ${book.epoch}</p>
            <p><strong>体裁:</strong> ${book.kind || book.genre}</p>
        `;
        bookDiv.addEventListener('click', () => loadBookDetails(book));
        resultsDiv.appendChild(bookDiv);
    });
}

// 音乐播放器功能
let currentMusicTrack = null;
let isMusicPlaying = false;

function loadMusicPlayer() {
    // 初始化音乐播放器
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const volumeSlider = document.getElementById('volume-slider');
    
    if (playBtn) playBtn.addEventListener('click', playMusic);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseMusic);
    if (volumeSlider) volumeSlider.addEventListener('input', setVolume);
    
    // 加载音乐列表
    loadMusicList();
}

async function loadMusicList() {
    try {
        // 使用SoundCloud API或模拟数据
        const musicList = [
            { title: '轻松爵士', artist: 'Relaxing Jazz', url: 'https://soundcloud.com/relaxing-jazz' },
            { title: '古典钢琴', artist: 'Classical Piano', url: 'https://soundcloud.com/classical-piano' },
            { title: '电子音乐', artist: 'Electronic Beats', url: 'https://soundcloud.com/electronic-beats' }
        ];
        
        const musicListDiv = document.getElementById('music-list');
        if (!musicListDiv) return;
        
        musicListDiv.innerHTML = '';
        musicList.forEach((track, index) => {
            const trackDiv = document.createElement('div');
            trackDiv.style.cssText = 'margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer;';
            trackDiv.innerHTML = `<strong>${track.title}</strong> - ${track.artist}`;
            trackDiv.addEventListener('click', () => selectTrack(track));
            musicListDiv.appendChild(trackDiv);
        });
    } catch (error) {
        console.error('加载音乐列表失败:', error);
    }
}

function selectTrack(track) {
    currentMusicTrack = track;
    const musicInfo = document.getElementById('music-info');
    if (musicInfo) {
        musicInfo.innerHTML = `<strong>当前选择:</strong> ${track.title} - ${track.artist}`;
    }
}

function playMusic() {
    if (currentMusicTrack) {
        isMusicPlaying = true;
        const musicInfo = document.getElementById('music-info');
        if (musicInfo) {
            musicInfo.innerHTML = `<strong>正在播放:</strong> ${currentMusicTrack.title} - ${currentMusicTrack.artist}`;
        }
    }
}

function pauseMusic() {
    isMusicPlaying = false;
    const musicInfo = document.getElementById('music-info');
    if (musicInfo && currentMusicTrack) {
        musicInfo.innerHTML = `<strong>已暂停:</strong> ${currentMusicTrack.title} - ${currentMusicTrack.artist}`;
    }
}

function setVolume() {
    const volume = document.getElementById('volume-slider')?.value || 50;
    // 设置音量逻辑
    console.log('音量设置为:', volume);
}

// 天气功能
async function loadWeather() {
    try {
        const weatherPanel = document.getElementById('weather-panel');
        const weatherDiv = document.createElement('div');
        weatherDiv.innerHTML = '<p>正在获取天气信息...</p>';
        weatherPanel.appendChild(weatherDiv);
        
        // 使用OpenWeatherMap API
        setTimeout(() => {
            weatherDiv.innerHTML = `
                <h3>北京天气</h3>
                <p>温度: 25°C</p>
                <p>天气: 晴朗</p>
                <p>湿度: 60%</p>
                <p>风速: 3.5 m/s</p>
            `;
        }, 1000);
    } catch (error) {
        console.error('获取天气失败:', error);
    }
}

// 新闻功能
async function loadNews() {
    try {
        const newsPanel = document.getElementById('news-panel');
        const newsDiv = document.createElement('div');
        newsDiv.innerHTML = '<p>正在加载新闻...</p>';
        newsPanel.appendChild(newsDiv);
        
        setTimeout(() => {
            newsDiv.innerHTML = `
                <h3>最新科技新闻</h3>
                <div style="margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <h4>AI技术取得重大突破</h4>
                    <p>最新研究表明，人工智能在多个领域实现了革命性进展...</p>
                </div>
                <div style="margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <h4>量子计算新进展</h4>
                    <p>科学家们在量子计算领域取得新的里程碑...</p>
                </div>
            `;
        }, 1000);
    } catch (error) {
        console.error('加载新闻失败:', error);
    }
}

// 翻译功能
function loadTranslator() {
    const translatePanel = document.getElementById('translate-panel');
    const translatorDiv = document.createElement('div');
    translatorDiv.innerHTML = `
        <h3>文本翻译</h3>
        <textarea placeholder="请输入要翻译的文本..." style="width: 100%; height: 100px; padding: 10px; border: none; border-radius: 8px; background: rgba(255,255,255,0.1); color: white; margin-bottom: 10px;"></textarea>
        <select style="padding: 5px; margin-bottom: 10px; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px;">
            <option value="en">英语</option>
            <option value="zh">中文</option>
            <option value="ja">日语</option>
            <option value="ko">韩语</option>
        </select>
        <button onclick="translateText()" style="padding: 8px 15px; background: rgba(0,188,212,0.3); color: white; border: none; border-radius: 5px; cursor: pointer;">翻译</button>
        <div id="translation-result" style="margin-top: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; min-height: 50px;"></div>
    `;
    translatePanel.appendChild(translatorDiv);
}

function translateText() {
    const resultDiv = document.getElementById('translation-result');
    if (resultDiv) {
        resultDiv.innerHTML = '翻译中...';
        
        setTimeout(() => {
            resultDiv.innerHTML = '翻译功能正在开发中，敬请期待！';
        }, 1000);
    }
}

// 笑话功能
async function loadJokes() {
    try {
        const jokesDiv = document.getElementById('jokes-content');
        if (!jokesDiv) return;
        
        jokesDiv.innerHTML = '<p>正在加载笑话...</p>';
        
        const jokes = [
            "为什么程序员喜欢黑暗？因为光明会产生bug！",
            "为什么AI不会感冒？因为它有防火墙！",
            "为什么电脑经常生病？因为它有病毒！",
            "为什么程序员总是混淆万圣节和圣诞节？因为Oct 31 == Dec 25！"
        ];
        
        setTimeout(() => {
            jokesDiv.innerHTML = '<h3>今日笑话</h3>';
            jokes.forEach(joke => {
                const jokeP = document.createElement('p');
                jokeP.style.cssText = 'margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;';
                jokeP.textContent = joke;
                jokesDiv.appendChild(jokeP);
            });
        }, 500);
    } catch (error) {
        console.error('加载笑话失败:', error);
    }
}

// 点击弹窗外部关闭
window.addEventListener('click', function(event) {
    if (aiOS && event.target === aiOS) {
        closeAIOS();
    }
});
