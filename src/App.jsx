import { useState } from 'react';
import { OPENROUTER_API_KEY } from '../config';
import { Routes, Route, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StretchGoal from './StretchGoal';

import './App.css';

import Header from './components/header';

function App() {
  const [language, setLanguage] = useState('French');
  const [loading, setLoading] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [translatedText, setTranslatedText] = useState('');



  const onSubmitTranslateText = (e) => {
    e.preventDefault();

    onTranslateUsingOpenRouterAI();

  };

  const handleStartOver = (e) => {

    e.preventDefault();

    setTextValue('');
    setTranslatedText('');
    setLoading(false);
    setLanguage('Swahili');
  };

  const onTranslateUsingOpenRouterAI = async () => {

    setLoading(true);

    const messages = [
      {
        role: 'system',
        content: `You are a helpful assistant that translates text into the user\'s selected language.
        Translate the following text to ${language}: "${textValue} `
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
          temperature: 0.5,
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
        setTranslatedText(translatedText);
      }

    } catch (error) {
      console.error('Error during translation:', error);
    } finally {
      setLoading(false);
    }

  };


  return (
    <Routes>
      <Route path="/" element={
        <>

          <Header />

          <form className="m-10 p-10" onSubmit={onSubmitTranslateText}>

            <div className="border-2 border-black rounded-2xl p-6">

              <div className="textToTranslate mt-5 mb-5">

                {!translatedText && !loading && (
                  <label htmlFor="textInput" className="block mb-2 font-bold text-xl text-center text-[#035A9D]">
                    Text to translate 👇
                  </label>
                )}

                {translatedText && !loading && (
                  <label htmlFor="textInput" className="block mb-2 font-bold text-xl text-center text-[#035A9D]">
                    Original Text 👇
                  </label>
                )}

                <input
                  type="text"
                  value={textValue}
                  className="font-bold text-[#333333] bg-[#EFF0F4] w-full p-5"
                  placeholder='How are you?'
                  onChange={(e) => setTextValue(e.target.value)} />
              </div>

              <div className="selectLanguage mt-5 mb-5">

                {!translatedText && (
                  <>
                    <div className="mb-5">

                      <label className="block mb-2 font-bold text-xl text-center text-[#035A9D]">
                        Select language 👇
                      </label>

                      <div className="language-options">

                        <div className="flex items-center mb-3">
                          <input
                            type="radio"
                            id="swahili"
                            name="language"
                            value="Swahili"
                            checked={language === 'Swahili'}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="mr-3"
                          />
                          <label htmlFor="swahili" className="text-lg font-semibold cursor-pointer">
                            Swahili 🇰🇪
                          </label>
                        </div>

                        <div className="flex items-center mb-3">
                          <input
                            type="radio"
                            id="french"
                            name="language"
                            value="French"
                            checked={language === 'French'}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="mr-3"
                          />
                          <label htmlFor="french" className="text-lg font-semibold cursor-pointer">
                            French 🇫🇷
                          </label>
                        </div>

                        <div className="flex items-center mb-3">
                          <input
                            type="radio"
                            id="spanish"
                            name="language"
                            value="Spanish"
                            checked={language === 'Spanish'}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="mr-3"
                          />
                          <label htmlFor="spanish" className="text-lg font-semibold cursor-pointer">
                            Spanish 🇪🇸
                          </label>
                        </div>

                        <div className="flex items-center mb-3">
                          <input
                            type="radio"
                            id="japanese"
                            name="language"
                            value="Japanese"
                            checked={language === 'Japanese'}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="mr-3"
                          />
                          <label htmlFor="japanese" className="text-lg font-semibold cursor-pointer">
                            Japanese 🇯🇵
                          </label>
                        </div>

                        <div className="flex items-center mb-3">
                          <input
                            type="radio"
                            id="italian"
                            name="language"
                            value="Italian"
                            checked={language === 'Italian'}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="mr-3"
                          />
                          <label htmlFor="italian" className="text-lg font-semibold cursor-pointer">
                            Italian 🇮🇹
                          </label>
                        </div>

                        <div className="flex items-center mb-3">
                          <input
                            type="radio"
                            id="german"
                            name="language"
                            value="German"
                            checked={language === 'German'}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="mr-3"
                          />
                          <label htmlFor="german" className="text-lg font-semibold cursor-pointer">
                            German 🇬🇪
                          </label>
                        </div>

                      </div>

                      <button
                        disabled={textValue === ''}
                        className="bg-[#035A9D] text-white font-bold py-3 px-6 rounded-lg mt-5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        Translate
                      </button>

                    </div>
                  </>
                )}

                {loading && (
                  <div className="text-center py-10">
                    <p className="text-2xl font-bold text-[#035A9D] animate-pulse">
                      Loading Translation...
                    </p>
                  </div>
                )}

                {translatedText && !loading && (
                  <div className="translated-text-section">

                    <h2 className="text-xl font-bold mb-5 text-center text-[#035A9D]">
                      Your translation 👇
                    </h2>

                    <input
                      type="text"
                      value={translatedText}
                      readOnly
                      className="font-bold text-[#333333] bg-[#EFF0F4] w-full p-5" />

                    <button
                      onClick={handleStartOver}
                      className="bg-[#035A9D] text-white font-bold py-3 px-6 rounded-lg mt-5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                      Start Over
                    </button>

                  </div>
                )}

              </div>

            </div>

            <Link to="/stretch-goal">
              <button
                className="bg-[#035A9D] text-white font-bold py-3 px-6 rounded-lg mt-5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Checkout PollyGlot 2.0
              </button>
            </Link>

          </form>

          <ToastContainer
            position="top-right"
            theme="dark" />

        </>

      } />

      <Route
        path="/stretch-goal"
        element={<StretchGoal />}
      />
    </Routes>
  );
}

export default App;
