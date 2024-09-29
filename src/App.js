import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';

const appStyles = `
body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: black;
    color: white;
    font-family: 'Play', sans-serif;
}

nav {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: nowrap; /* 改行を防ぐ */
}

nav a {
    color: white;
    text-decoration: none;
    padding: 0 10px;
    white-space: nowrap; /* 改行を禁止 */
}

nav a.active {
    border-bottom: 2px solid white;
}


section {
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
}

#intro { z-index: 3; }
#about-me { z-index: 2; }
#accounts, #links { z-index: 1; }

h1, h2 {
    margin: 0;
}

.scroll-indicator {
    font-size: 2em;
    animation: bounce 2s infinite;
}

.banners {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap; /* 小さい画面では縦並びに */
}

.banners a {
    flex: 1 1 auto; /* 自動で幅調整 */
}

.banners img {
    width: 233px;
    height: 80px;
}

@media (max-width: 768px) {
    .banners {
        flex-direction: column; /* スマホでは縦並び */
        gap: 10px; /* 間隔を少し狭める */
    }

    .banners img {
        max-width: 100%; /* 画像の最大幅を制限 */
        height: auto; /* 高さを自動調整 */
    }
    
    /* モバイル向けのレスポンシブ調整 */
    @media (max-width: 600px) {
        nav {
            gap: 10px; /* 狭い画面では隙間を小さく */
        }
}
}

footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.8);
}
`;

function App() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sections = useRef([]);
    const startY = useRef(null);
    const endY = useRef(null);

    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = appStyles;
        document.head.appendChild(styleSheet);

        $(sections.current[currentIndex]).show();

        const handleScroll = (e) => {
            if (e.originalEvent.deltaY > 0) {
                if (currentIndex < sections.current.length - 1) {
                    showSection(currentIndex + 1);
                }
            } else {
                if (currentIndex > 0) {
                    showSection(currentIndex - 1);
                }
            }
        };

        const handleTouchStart = (e) => {
            startY.current = e.originalEvent.touches[0].pageY;
        };

        const handleTouchMove = (e) => {
            endY.current = e.originalEvent.touches[0].pageY;
        };

        const handleTouchEnd = () => {
            if (startY.current > endY.current + 5) {
                if (currentIndex < sections.current.length - 1) {
                    showSection(currentIndex + 1);
                }
            } else if (startY.current < endY.current - 5) {
                if (currentIndex > 0) {
                    showSection(currentIndex - 1);
                }
            }
        };

        const showSection = (index) => {
            $(sections.current[currentIndex]).fadeOut(500, () => {
                $(sections.current[index]).fadeIn(500);
                setCurrentIndex(index);
            });
        };

        $(window).on('wheel', handleScroll);
        $(window).on('touchstart', handleTouchStart);
        $(window).on('touchmove', handleTouchMove);
        $(window).on('touchend', handleTouchEnd);

        return () => {
            $(window).off('wheel', handleScroll);
            $(window).off('touchstart', handleTouchStart);
            $(window).off('touchmove', handleTouchMove);
            $(window).off('touchend', handleTouchEnd);
        };
    }, [currentIndex]);

    const scrollToSection = (index) => {
        // すべてのセクションをまず非表示にする
        sections.current.forEach((section, i) => {
            if (i !== index) {
                $(section).hide();  // ターゲット以外のセクションを隠す
            }
        });
        
        const section = sections.current[index];
        if (section) {
            $(section).fadeIn(500);  // ターゲットセクションを滑らかに表示する
            setCurrentIndex(index);
        }
    };    

    return (
        <div>
            <nav>
                <a href="#intro" onClick={(e) => { e.preventDefault(); scrollToSection(0); }} className={currentIndex === 0 ? 'active' : ''}>Intro</a>
                <a href="#about-me" onClick={(e) => { e.preventDefault(); scrollToSection(1); }} className={currentIndex === 1 ? 'active' : ''}>About Me</a>
                <a href="#accounts" onClick={(e) => { e.preventDefault(); scrollToSection(2); }} className={currentIndex === 2 ? 'active' : ''}>Accounts</a>
                <a href="#links" onClick={(e) => { e.preventDefault(); scrollToSection(3); }} className={currentIndex === 3 ? 'active' : ''}>Links</a>
            </nav>

            <section id="intro" ref={(el) => (sections.current[0] = el)}>
                <div>
                    <h1>みりえるどっとねっと</h1>
                    <h2>Mirielのサイトへようこそ。</h2>
                    <p>下にスクロールしてください</p>
                    <div className="scroll-indicator">↓</div>
                </div>
            </section>

            <section id="about-me" style={{ display: 'none' }} ref={(el) => (sections.current[1] = el)}>
                <div>
                    <h1>About Me</h1>
                    <p>Miriel は 2014年 からTwitter(現 X) で活動を開始した人である。主にプログラム関連などでやっている。</p>
                    <p>現在は RosekeyというSNS の Developerもしている。</p>
                    <p>今は Twitter(現 X) / Rosekey (ActivityPub) / TikTok / Instagram などで活動をしている。</p>
                    <h3>実績</h3>
                    <p>
                        2020/08 ~ 2021/02 37ch Developers Member<br />
                        2021/03 ~ 2023/04 Mirial.jp Read Developer<br />
                        2023/09 ~ 2023/10 Sharkey Contributor<br />
                        2024/01 ~ Rosekey Read Developer<br />
                        2024/06 ~ CherryPick Contributor
                    </p>
                </div>
            </section>

            <section id="accounts" style={{ display: 'none' }} ref={(el) => (sections.current[2] = el)}>
                <div>
                    <h1>Accounts</h1>
                    <p>
                        Twitter(現 X) <a href="https://x.com/mirielnet" target="_blank" rel="noopener noreferrer">@mirielnet</a>
                        <br />Rosekey (ActivityPub): <a href="https://p0.waka.style/@miriel">@miriel@p0.waka.style</a>
                        <br />GitHub (Git): <a href="https://github.com/mirielnet" target="_blank" rel="noopener noreferrer">@mirielnet</a>
                        <br />TikTok: <a href="https://tiktok.com/@mirielnet" target="_blank" rel="noopener noreferrer">@mirielnet</a>
                        <br />Instagram: <a href="https://instagram.com/mirielnet">@mirielnet</a>
                        <br />E-Mail: <a href="mailto:contact@waka.style">contact@waka.style</a> or <a href="mailto:me@miriel.net">me@miriel.net</a>
                    </p>
                </div>
            </section>

            <section id="links" style={{ display: 'none' }} ref={(el) => (sections.current[3] = el)}>
                <div>
                    <h1>Links</h1>
                    <div className="banners">
                        <a href="https://tmksoft.net" target="_blank" rel="noopener noreferrer">
                            <img src="https://tmksoft.net/banner.png" alt="TMKSoft Banner" />
                        </a>
                        <a href="https://hakurei.win" target="_blank" rel="noopener noreferrer">
                            <img src="https://hakurei.win/assets/mybanner.webp" alt="Hakurei Banner" />
                        </a>
                    </div>
                </div>
            </section>

            <footer>
                <p>Copyright © 2014-2024 Miriel(@mirielnet) All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default App;
