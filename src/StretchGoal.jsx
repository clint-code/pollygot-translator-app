import { useState } from 'react';
import { OPENROUTER_API_KEY } from '../config';
import { Link } from 'react-router-dom';
import './App.css';
import Header from './components/header';

function StretchGoal() {
    const [loading, setLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [sentTextValue, setSentTextValue] = useState('');
    const [textValue, setTextValue] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('French');

    // Import assets
    const frFlag = new URL('./assets/img/fr-flag.png', import.meta.url).href;
    const spFlag = new URL('./assets/img/sp-flag.png', import.meta.url).href;
    const jpnFlag = new URL('./assets/img/jpn-flag.png', import.meta.url).href;
    const sendBtn = new URL('./assets/img/send-btn.png', import.meta.url).href;

    const onSubmitTranslateText = (e) => {
        e.preventDefault();
        console.log(e);

        //onTranslateUsingOpenRouterAI();

    };

    const onSendingText = () => {

        const textToTranslate = textValue;
        const targetLanguage = selectedLanguage;

        setSentTextValue(textToTranslate);
        setTextValue('');

        console.log("Sent text value:", textToTranslate);
        console.log("Language:", targetLanguage);

        onTranslateUsingOpenRouterAI(textToTranslate, targetLanguage);

    };

    const onTranslateUsingOpenRouterAI = async (textToTranslate, targetLanguage) => {

        setLoading(true);

        console.log("Translating text:", textToTranslate);
        console.log("Language:", targetLanguage);

        const messages = [
            {
                role: 'system',
                content: `You are a helpful assistant that translates text into the user\'s selected language.
                Translate the following text to ${targetLanguage}: "${textToTranslate} `
            },
            {
                role: 'user',
                content: `Follow the instructions between ### to set the style of translation. Here's your translation:

                ###
                Only give me the translated text, nothing else.
                ###

                ###
                Where possible, when translating to Japanese and both hiragana and katakana are used, also show the romaji in parentheses. Use this format when translating: 
                わたしのなまえはクリントンです (Watashi wa Kurinton-san desu)
                ###
                
                ###
                And where possible, when translating to Japanese and only katakana is used, also show the romaji in parentheses. Use this format when translating: 
                スペシャル (Supesharu)
                ###
                `
            }
        ];

        try {

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': window.location.href,
                },
                body: JSON.stringify({
                    model: 'meta-llama/llama-3.1-8b-instruct',
                    messages: messages,
                    temperature: 0,
                    max_tokens: 1000,
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('Error 401: Unauthorized. Please check your API key.');
                } else if (response.status === 400) {
                    toast.error('Error 400: Bad Request. Please check your request parameters.');
                } else if (response.status === 500) {
                    toast.error('Error 500: Internal Server Error. Please try again later.');
                } else {
                    toast.error('An error occurred during translation.');
                }
                return;
            }

            const data = await response.json();

            // Extract the translated text from the response
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const translatedText = data.choices[0].message.content;
                console.log("Translated text:", translatedText);
                setTranslatedText(translatedText);
            }

        } catch (error) {
            console.error('Error during translation:', error);
        } finally {
            setLoading(false);
        }

    };

    return (
        <>
            <Header />

            <div className="m-10 p-10">

                <h1 className="text-4xl font-bold text-center text-[#035A9D] mb-8">
                    Welcome to PollyGlot 2.0! 🎉
                </h1>

                <p className="text-lg text-center text-[#333333] mb-8">
                    This is the new and improved version of PollyGlot.
                </p>

                <div className="chat-section border-4 border-[#1D2B3A] rounded-2xl p-6 bg-white w-full mx-auto shadow-xl">

                    {/* Bot Instruction */}
                    <div className="bg-[#035A9D] text-white p-4 rounded-xl mb-10 relative">
                        <p className="font-semibold text-lg leading-tight">
                            Select the language you want me to translate into, type your text and hit send!
                        </p>
                    </div>

                    {/* User Text */}
                    {sentTextValue && (
                        <div className="flex justify-end mb-6">
                            <div className="bg-[#78DC78] text-[#1D2B3A] p-4 rounded-xl max-w-[80%]">
                                <p className="font-bold text-lg">{sentTextValue}</p>
                            </div>
                        </div>
                    )}

                    {/* Bot Translation */}
                    {translatedText && (
                        <div className="bg-[#005999] text-white p-4 rounded-xl mb-8 max-w-[80%]">
                            <p className="font-bold text-lg">{translatedText}</p>
                        </div>
                    )}

                    {/* Input Field */}
                    <div className="relative mb-8">
                        <input
                            type="text"
                            className="border-1 border-[#1D2B3A] rounded-xl py-4 px-6 text-lg font-bold text-[#333333] bg-[#EFF0F4] w-full p-5"
                            placeholder="Type here..."
                            value={textValue}
                            onChange={(e) => setTextValue(e.target.value)} />

                        <button
                            disabled={textValue === ''}
                            onClick={onSendingText}
                            className="absolute right-4 top-1/2 -translate-y-1/2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <img src={sendBtn} alt="Send" className="w-6 h-6" />
                        </button>

                    </div>

                    {/* Language Selectors */}
                    <div className="flex justify-center gap-8">

                        <button
                            className={`transition-transform hover:scale-110 ${selectedLanguage === 'French' ? 'ring-4 rounded-sm' : ''}`}
                            onClick={() => setSelectedLanguage('French')}
                        >
                            <img src={frFlag} alt="French" className="w-16 h-10 object-cover shadow-md" />
                        </button>

                        <button
                            className={`transition-transform hover:scale-110 ${selectedLanguage === 'Spanish' ? 'ring-4 rounded-sm' : ''}`}
                            onClick={() => setSelectedLanguage('Spanish')}
                        >
                            <img src={spFlag} alt="Spanish" className="w-16 h-10 object-cover shadow-md" />
                        </button>

                        <button
                            className={`transition-transform hover:scale-110 ${selectedLanguage === 'Japanese' ? 'ring-4 rounded-sm' : ''}`}
                            onClick={() => setSelectedLanguage('Japanese')}
                        >
                            <img src={jpnFlag} alt="Japanese" className="w-16 h-10 object-cover shadow-md" />
                        </button>

                    </div>

                </div>

                <div className="footer-button">
                    <Link to="/">
                        <button
                            className="bg-[#035A9D] text-white font-bold py-3 px-6 rounded-lg mt-5 hover:bg-blue-700">
                            Back to PollyGlot 1.0
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default StretchGoal;