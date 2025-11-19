'use client';

import { useState } from 'react';

export default function Home() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [input, setInput] = useState('TIME MAKES DIFFERENT');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const encryptWord = (word: string): string => {
    const upperWord = word.toUpperCase();
    let result = '';
    let lastCharPosition = 0;
    
    for (let i = 0; i < upperWord.length; i++) {
      const char = upperWord[i];
      // 只处理字母
      if (!/[A-Z]/.test(char)) continue;
      
      const position = char.charCodeAt(0) - 'A'.charCodeAt(0) + 1; // 1-26
      
      if (lastCharPosition === 0) {
        // 第一个字母：直接写位置
        result += position.toString();
        lastCharPosition = position;
      } else {
        // 后续字母：计算与前一个字母的差值
        const diff = position - lastCharPosition;
        
        if (diff === 0) {
          result += '^0';
        } else if (diff > 0) {
          result += `>${diff}`;
        } else {
          result += `<${Math.abs(diff)}`;
        }
        lastCharPosition = position;
      }
    }
    return result;
  };

  const encrypt = (text: string): string => {
    // 将文本按行分割
    const lines = text.split('\n');
    const results: string[] = [];
    
    lines.forEach(line => {
      // 将每行按空格或标点分割成单词
      const words = line.split(/\s+/).filter(word => word.trim());
      
      words.forEach(word => {
        // 移除标点符号，只保留字母
        const cleanWord = word.replace(/[^a-zA-Z]/g, '');
        if (cleanWord) {
          results.push(encryptWord(cleanWord));
        }
      });
    });
    
    return results.join('\n');
  };

  const decryptWord = (encrypted: string): string => {
    let result = '';
    let currentPosition = 0;
    let i = 0;
    
    while (i < encrypted.length) {
      if (/\d/.test(encrypted[i])) {
        // 读取数字
        let numStr = '';
        while (i < encrypted.length && /\d/.test(encrypted[i])) {
          numStr += encrypted[i];
          i++;
        }
        const num = parseInt(numStr);
        
        if (currentPosition === 0) {
          // 第一个数字是绝对位置
          currentPosition = num;
        } else {
          // 不应该出现连续的纯数字
          currentPosition = num;
        }
        
        // 转换为字母
        if (currentPosition >= 1 && currentPosition <= 26) {
          result += String.fromCharCode('A'.charCodeAt(0) + currentPosition - 1);
        }
      } else if (encrypted[i] === '<' || encrypted[i] === '>' || encrypted[i] === '^') {
        const operator = encrypted[i];
        i++;
        
        // 读取数字
        let numStr = '';
        while (i < encrypted.length && /\d/.test(encrypted[i])) {
          numStr += encrypted[i];
          i++;
        }
        const num = parseInt(numStr);
        
        // 计算新位置
        if (operator === '<') {
          currentPosition -= num;
        } else if (operator === '>') {
          currentPosition += num;
        }
        // ^ 表示相同，位置不变
        
        // 转换为字母
        if (currentPosition >= 1 && currentPosition <= 26) {
          result += String.fromCharCode('A'.charCodeAt(0) + currentPosition - 1);
        }
      } else {
        i++;
      }
    }
    
    return result;
  };

  const decrypt = (text: string): string => {
    const lines = text.split('\n');
    const words: string[] = [];
    
    lines.forEach(line => {
      const encrypted = line.trim();
      if (encrypted) {
        words.push(decryptWord(encrypted));
      }
    });
    
    return words.join(' ');
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    
    try {
      if (mode === 'encrypt') {
        setOutput(encrypt(input));
      } else {
        setOutput(decrypt(input));
      }
    } catch (error) {
      setOutput('转换失败，请检查输入格式');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleConvert();
    }
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <main className="w-full max-w-4xl flex flex-col gap-6">
        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Drift Cipher
          </h1>
          <p className="text-slate-600 dark:text-slate-400">简易加密解密工具</p>
        </div>

        {/* 主内容卡片 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 space-y-4">
          {/* 模式选择 */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setMode('encrypt')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                mode === 'encrypt'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              🔒 加密
            </button>
            <button
              onClick={() => setMode('decrypt')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                mode === 'decrypt'
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              🔓 解密
            </button>
          </div>

          {/* 输入框 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              输入文本
            </label>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={`请输入要${mode === 'encrypt' ? '加密' : '解密'}的文本...\n提示：Ctrl+Enter 快速转换`}
                className="w-full h-32 px-4 py-3 pr-12 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              {input && (
                <button
                  onClick={() => setInput('')}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                  title="清空输入"
                >
                  <span className="text-slate-600 dark:text-slate-400">🗑️</span>
                </button>
              )}
            </div>
          </div>

          {/* 转换按钮 */}
          <button
            onClick={handleConvert}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            转换
          </button>

          {/* 输出框 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              输出结果
            </label>
            <div className="relative">
              <textarea
                value={output}
                readOnly
                placeholder="转换结果将显示在这里..."
                className="w-full h-32 px-4 py-3 pr-12 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
              />
              {output && (
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                  title="复制到剪贴板"
                >
                  {copied ? (
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  ) : (
                    <span className="text-slate-600 dark:text-slate-400">📋</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 底部备注 */}
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 space-y-2">
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            作者：
            <a
              href="https://space.bilibili.com/600592"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
            >
              十月的寒流
            </a>
          </p>
          <div className="space-y-1">
            <p>灵感来源：</p>
            <a
              href="https://www.bilibili.com/video/BV1YQC1B4Ezh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              GM的秘密基地
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
