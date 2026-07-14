// SpeedTypingGame.js

import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import './SpeedTypingGame.css';
import TypingArea from './TypingArea'; // Import the TypingArea component

const SpeedTypingGame = () => {
    const paragraphs = [
        "A plant is one of the most important living things that develop on the earth and is made up of stems, leaves, roots, and so on. Parts of plants: the part of the plant that develops beneath the soil is referred to as the root and the part that grows outside of the soil is known as the shoot. The shoot consists of stems, branches, leaves, fruits, and flowers. Plants are made up of six main parts: roots, stems, leaves, flowers, fruits, and seeds.",
        "The root is the part of the plant that grows in the soil. The primary root emerges from the embryo. Its primary function is to provide the plant stability in the earth and make mineral salts from the earth available to the plant for various metabolic processes. There are three types of roots: Tap Root, Adventitious Roots, and Lateral Root. The roots arise from the parts of the plant and not from the rhizomes.",
        "The stem is the part of the plant that remains above the ground and grows negatively geotropic. Internodes and nodes are found on the stem. Branch, bud, leaf, petiole, flower, and inflorescence on a node are all parts of the plant that remain above the ground. The trees have brown bark and the young and newly developed stems are green. The roots arise from the parts of the plant and not from the rhizomes.",
        "A flower is the blossom of a plant. A flower is the part of a plant that produces seeds, which eventually become other flowers. They are the reproductive system of a plant. Most flowers consist of four main parts: sepals, petals, stamens, and carpels. The female portion of the flower is the carpel. The majority of flowers are hermaphrodites, meaning they have both male and female components. Others may consist of one of two parts and may be male or female.",
        "An aunt is a bassoon from the right perspective. As far as we can estimate, some posit the melic Myanmar to be less than kutcha. One cannot separate foods from blowzy bows. The scampish closet reveals itself as a sclerous llama to those who look. A hip is the skirt of a peak. Some hempy laundries are thought of simply as orchids. A gum is a trumpet from the right perspective. A freebie flight is a wrench of the mind. Some posit the croupy."
    ];

    const [typingText, setTypingText] = useState('');
    const [inpFieldValue, setInpFieldValue] = useState('');
    const maxTime = 60;
    const [timeLeft, setTimeLeft] = useState(maxTime);
    const [charIndex, setCharIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [WPM, setWPM] = useState(0);
    const [CPM, setCPM] = useState(0);
    const inputRef = useRef(null);

    // Brings up the native on-screen keyboard on mobile/touch devices by
    // focusing the hidden input field. Laptops/desktops don't need this
    // since typing on a physical keyboard already focuses the field.
    const openMobileKeyboard = () => {
        inputRef.current?.focus();
    };

    const loadParagraph = () => {
        const ranIndex = Math.floor(Math.random() * paragraphs.length);
        document.addEventListener("keydown", () => inputRef.current?.focus());
        const content = Array.from(paragraphs[ranIndex]).map((letter, index) => ( 
            <span key = {
                index
            }
            style = {
                {
                    color: (letter !== ' ') ? 'black' : 'transparent'
                }
            }
            className = {
                `char ${index === 0 ? 'active' : ''}`
            } > {
                (letter !== ' ') ? letter : '_'
            } </span>
        ));
        setTypingText(content);
        setInpFieldValue('');
        setCharIndex(0);
        setMistakes(0);
        setIsTyping(false);
    };
    const handleKeyDown = (event) => {
        const characters = document.querySelectorAll('.char');
        if (event.key === 'Backspace' && charIndex > 0 && timeLeft > 0) {
            const previousIndex = charIndex - 1;
            const previousChar = characters[previousIndex];
            const wasWrong = previousChar?.classList.contains('wrong');

            if (previousChar?.classList.contains('correct')) {
                previousChar.classList.remove('correct');
            }
            if (wasWrong) {
                previousChar.classList.remove('wrong');
                setMistakes(prev => Math.max(prev - 1, 0));
            }

            characters[charIndex]?.classList.remove('active');
            previousChar?.classList.add('active');
            setCharIndex(previousIndex);

            const currentMistakes = wasWrong ? Math.max(mistakes - 1, 0) : mistakes;
            const correctChars = Math.max(previousIndex - currentMistakes, 0);
            const elapsed = maxTime - timeLeft;
            const cpm = elapsed > 0 ? Math.round(correctChars * (60 / elapsed)) : 0;
            const wpm = elapsed > 0 ? Math.round((correctChars / 5) * (60 / elapsed)) : 0;
            setCPM(cpm);
            setWPM(wpm);
        }
    }

    const initTyping = (event) => {
        const characters = document.querySelectorAll('.char');
        const value = event.target.value;
        if (!value) return;

        const typedChar = value[value.length - 1];
        if (!(charIndex < characters.length && timeLeft > 0)) {
            setIsTyping(false);
            return;
        }

        let currentChar = characters[charIndex].innerText;
        if (currentChar === '_') currentChar = ' ';

        if (!isTyping) {
            setIsTyping(true);
        }

        const newCharIndex = charIndex + 1;
        const isCorrect = typedChar === currentChar;
        const newMistakes = mistakes + (isCorrect ? 0 : 1);

        if (isCorrect) {
            characters[charIndex].classList.add('correct');
        } else {
            characters[charIndex].classList.add('wrong');
        }

        characters[charIndex].classList.remove('active');
        if (newCharIndex < characters.length) {
            characters[newCharIndex].classList.add('active');
        }

        setCharIndex(newCharIndex);
        setMistakes(newMistakes);
        setInpFieldValue('');

        if (newCharIndex >= characters.length) {
            setIsTyping(false);
        }

        const correctChars = Math.max(newCharIndex - newMistakes, 0);
        const elapsed = maxTime - timeLeft;
        const wpm = elapsed > 0 ? Math.round((correctChars / 5) * (60 / elapsed)) : 0;
        const cpm = elapsed > 0 ? Math.round(correctChars * (60 / elapsed)) : 0;
        setWPM(wpm);
        setCPM(cpm);
    };

    const resetGame = () => {
        setIsTyping(false);
        setTimeLeft(maxTime);
        setCharIndex(0);
        setMistakes(0);
        setTypingText('');
        setCPM(0);
        setWPM(0);
        const characters = document.querySelectorAll('.char');
        characters.forEach(span => {
            span.classList.remove("correct");
            span.classList.remove('wrong');
            span.classList.remove('active');
        });
        characters[0].classList.add('active');
        loadParagraph();
    };

    useEffect(() => {
        loadParagraph();
    }, []);

    useEffect(() => {
        let interval;
        if (isTyping && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prevTime => {
                    const newTime = prevTime - 1;
                    const elapsed = maxTime - newTime;
                    const correctChars = Math.max(charIndex - mistakes, 0);
                    const cpm = elapsed > 0 ? Math.round(correctChars * (60 / elapsed)) : 0;
                    const wpm = elapsed > 0 ? Math.round((correctChars / 5) * (60 / elapsed)) : 0;
                    setCPM(cpm);
                    setWPM(wpm);
                    return newTime;
                });
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsTyping(false);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isTyping, timeLeft, charIndex, mistakes]);


    return (
        <div className="container">
            <input
                ref={inputRef}
                type="text"
                className="input-field"
                value={inpFieldValue}
                onChange={initTyping}
                onKeyDown={handleKeyDown}
            />
            <TypingArea
                typingText={typingText}
                inpFieldValue={inpFieldValue}
                timeLeft={timeLeft}
                mistakes={mistakes}
                WPM={WPM}
                CPM={CPM}
                initTyping={initTyping}
                handleKeyDown={handleKeyDown}
                resetGame={resetGame}
                openMobileKeyboard={openMobileKeyboard}
            />
        </div>
    );
};

export default SpeedTypingGame;
