import { useState } from 'react';
import OpenAI from 'openai';
import { OPEN_AI_KEY, OPEN_AI_MODEL, OPEN_AI_URL, HUGGINGFACE_API_KEY, HUGGINGFACE_MODEL, HUGGINGFACE_URL } from '../config';
import { Link } from 'react-router-dom';
import './App.css';
import Header from './components/header';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StretchGoal() {

    const openai = new OpenAI({
        apiKey: OPEN_AI_KEY,
        baseURL: OPEN_AI_URL,
        dangerouslyAllowBrowser: true,
    });

    const [loading, setLoading] = useState(false);
    const [textValue, setTextValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('French');

    // Import assets
    const frFlag = new URL('./assets/img/fr-flag.png', import.meta.url).href;
    const spFlag = new URL('./assets/img/sp-flag.png', import.meta.url).href;
    const jpnFlag = new URL('./assets/img/jpn-flag.png', import.meta.url).href;
    const sendBtn = new URL('./assets/img/send-btn.png', import.meta.url).href;

    const onSendingText = () => {

        const textToTranslate = textValue.trim();
        const targetLanguage = selectedLanguage;

        if (!/[a-zA-Z]/.test(textToTranslate)) {

            toast.error('ERROR: Invalid input. Please enter a valid text and no special characters to translate.');

        } else {
            // Add user message to history
            setMessages(prev => [...prev, {
                text: textToTranslate,
                type: 'user'
            }]);
            setTextValue('');
            onTranslateUsingOpenRouterAI(textToTranslate, targetLanguage);

        }

    };

    const onTranslateUsingOpenRouterAI = async (textToTranslate, targetLanguage) => {

        setLoading(true);

        const messages = [
            {
                role: 'system',
                content: `You are a helpful assistant that translates text into the user\'s selected language.
                Translate the following text to ${targetLanguage}: "${textToTranslate} `
            },
            {
                role: 'user',
                content: `Follow the instructions between ### and ### to set the style of translation:

                ###
                Only give me the translated text, nothing else.
                ###

                ###
                Where possible, when translating to Japanese, and both hiragana and katakana are used, also show the romaji in parentheses. Use this format when translating: 
                フォーミュラワンがすきです (Fōmyura wan ga suki desu)
                ###

                ###
                Where possible, when translating to Japanese, and kanji is used, also show the romaji in parentheses. Use this format when translating: 
                友達 (Tomodachi)
                ###

                ###
                Where possible, when translating to Japanese, and kanji and hiragana are used, also show the romaji in parentheses. Use this format when translating: 
                日々は特別な日です (Hibi wa tokubetsu na hi desu)
                ###

                ###
                If the text to translate is either a number or special character or both, throw an error.
                Only say "ERROR: Invalid input. Please enter a valid text to translate."
                ###
                
                `
            }
        ];

        try {

            const words = textToTranslate.trim().split(" ");
            const isDescriptionIsShort = words.length <= 3;
            let imageUrl = null;

            if (isDescriptionIsShort) {

                const hresponse = await fetch(
                    HUGGINGFACE_URL,
                    {
                        headers: {
                            'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            prompt: textToTranslate,
                            model: HUGGINGFACE_MODEL,
                            response_format: "b64_json"
                        })
                    });

                if (hresponse.ok) {

                    const hfData = await hresponse.json();

                    if (hfData.data && hfData.data[0]) {
                        imageUrl = hfData.data[0].url || (hfData.data[0].b64_json ? `data:image/png;base64,${hfData.data[0].b64_json}` : null);
                    }
                }

            } else {
                toast.error('Error: Description is too long. Please enter a description with 3 words or less.');
            }

            const response = await openai.chat.completions.create({
                model: OPEN_AI_MODEL,
                messages: messages,
                //temperature: 0.5,
                //max_tokens: 1000,
            });

            console.log("Response: ", response);

            // if (!response.ok) {
            //     if (response.status === 401) {
            //         toast.error('Error 401: Unauthorized. Please check your API key.');
            //     } else if (response.status === 400) {
            //         toast.error('Error 400: Bad Request. Please check your request parameters.');
            //     } else if (response.status === 500) {
            //         toast.error('Error 500: Internal Server Error. Please try again later.');
            //     } else if (response.status === 402) {
            //         toast.error('"Insufficient credits. This account never purchased credits. Make sure your key is on the correct account or org, and if so, purchase more at https://openrouter.ai/settings/credits');
            //     } else {
            //         toast.error('An error occurred during translation.');
            //     }
            //     return;
            // }

            // Extract the translated text from the response
            if (response) {
                const translatedText = response.choices[0].message.content;

                // Add bot translation to history
                setMessages(prev => [...prev, {
                    text: translatedText,
                    image: imageUrl,
                    type: 'bot'
                }]);
            } else {
                toast.error('Error: ', error);
            }

        } catch (error) {
            toast.error('Error: ' + error);
        } finally {
            setLoading(false);
        }

    };

    return (
        <>
            <Header />

            <div className="p-5">

                <h1 className="text-4xl font-bold text-center text-[#035A9D] mb-8">
                    Welcome to PollyGlot 2.0! 🎉
                </h1>

                <p className="text-lg text-center text-[#333333] mb-8">
                    This is the new and improved version of PollyGlot.
                </p>

                <div className="chat-section border-4 border-[#1D2B3A] rounded-2xl p-6 bg-white w-full mx-auto shadow-xl max-[640px]:p-3">

                    {/* Bot Instruction */}
                    <div className="bg-[#035A9D] text-white p-4 rounded-xl mb-10 relative">
                        <p className="font-semibold text-lg leading-tight">
                            Select the language you want me to translate into, type your text and hit send!
                        </p>
                    </div>

                    {/* Message History */}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
                            <div className={
                                `${msg.type === 'user' ? 'bg-[#4cd24c] text-white'
                                    : (msg.text.includes('ERROR:') ? 'bg-red-500 text-white'
                                        : 'bg-[#005999] text-white')} p-4 rounded-xl max-w-[80%] shadow-md`
                            }>
                                <p className="font-bold text-lg">{msg.text}</p>
                                {msg.image && (
                                    <div className="mt-3">
                                        <img
                                            src={msg.image}
                                            alt="Generated-image"
                                            className="rounded-lg shadow-sm border border-black/10 w-1/4 max-[520px]:w-3/4" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start mb-6">
                            <div className="bg-[#005999] text-white p-4 rounded-xl max-w-[80%] shadow-md">
                                <p className="font-bold text-lg animate-pulse">....</p>
                            </div>
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
                            disabled={textValue === '' || !textValue.trim()}
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
                            <img src={frFlag} alt="French" className="w-16 h-10 object-cover shadow-md max-[520px]:w-10 max-[520px]:h-6" />
                        </button>

                        <button
                            className={`transition-transform hover:scale-110 ${selectedLanguage === 'Spanish' ? 'ring-4 rounded-sm' : ''}`}
                            onClick={() => setSelectedLanguage('Spanish')}
                        >
                            <img src={spFlag} alt="Spanish" className="w-16 h-10 object-cover shadow-md max-[520px]:w-10 max-[520px]:h-6" />
                        </button>

                        <button
                            className={`transition-transform hover:scale-110 ${selectedLanguage === 'Japanese' ? 'ring-4 rounded-sm' : ''}`}
                            onClick={() => setSelectedLanguage('Japanese')}
                        >
                            <img src={jpnFlag} alt="Japanese" className="w-16 h-10 object-cover shadow-md max-[520px]:w-10 max-[520px]:h-6" />
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

            <ToastContainer
                position="top-right"
                theme="dark"
            />

        </>
    );
}

export default StretchGoal;