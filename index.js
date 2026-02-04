import { vocabData } from "./vocabData.js";
import { clozeText } from "./clozeText.js";

// 步骤二、听力填空
function renderCloze(text) {
    const container = document.getElementById("cloze-container");
    let gapCount = 0; // 序号计数器

    // 🔥 核心优化：使用 replace 方法
    // /\{(.+?)\}/g 是正则表达式：
    // g 代表 global (全局匹配)，找完一个继续找下一个
    // match 是完整的 "{答案}"
    // p1 是括号里的 "答案" (capture group 1)

    // replace 会把文本里每一个 {...} 替换成 return 后面的 HTML
    const htmlContent = text.replace(/\{(.+?)\}/g, (match, p1) => {
        gapCount++;
        const answer = p1.trim(); // 去掉可能的首尾空格
        const width = Math.max(60, answer.length * 10); // 计算宽度

        // 返回生成的 HTML 片段代替原来的 {...}
        return `
            <span class="input-wrapper">
                (${gapCount})
                <input 
                    type="text" 
                    class="cloze-input" 
                    style="width: ${width}px" 
                    data-answer="${answer}" 
                    autocomplete="off"
                />
            </span>
        `;
    });

    // 将替换完成的整段 HTML 放入容器，并用 <p> 包裹以保持段落格式
    container.innerHTML = `<p>${htmlContent}</p>`;
}

// 检查按钮的逻辑保持不变
function setupCheckButton() {
    const btn = document.getElementById("check-btn");
    // 如果没有按钮就别报错
    if (!btn) return;

    btn.addEventListener("click", () => {
        const inputs = document.querySelectorAll(".cloze-input");

        inputs.forEach((input) => {
            // 获取用户输入（转小写，去空格）
            const userAnswer = input.value.trim().toLowerCase();
            // 获取正确答案（从 data-answer 属性里拿）
            const correctAnswer = input.dataset.answer.toLowerCase();

            input.classList.remove("correct", "wrong");

            if (userAnswer === correctAnswer) {
                input.classList.add("correct");
            } else {
                input.classList.add("wrong");
            }
        });
    });
}

renderCloze(clozeText);
setupCheckButton();

// 步骤三、词汇学习渲染
const vocabContainer = document.getElementById("vocab-container");

function renderVocab(data) {
    let vocabHtml = "";

    for (let vocab of data) {
        let examplesHtml = "";
        for (let example of vocab.examples) {
            examplesHtml += `
            <div class="quiz-box">
                <p>${example.question}</p>
                <details class="answer-toggle">
                    <summary>🌰 查看参考例句</summary>
                    <div class="answer-content">
                        <span>${example.answer}</span>
                    </div>
                </details>
            </div>
            `;
        }

        vocabHtml += `
        <div class="vocab-item">
            <div class="vocab-main">
                <span class="word">${vocab.id}. ${vocab.term}</span>
                <span class="meaning">${vocab.definition}</span>
                <span class="usage">${vocab.note}</span>
            </div>
            ${examplesHtml}
            
         </div>
        `;
    }
    vocabContainer.innerHTML = vocabHtml;
}

renderVocab(vocabData);
