import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { OPENROUTER_API_KEY } from '../config';

import './App.css';

import Header from './components/header';

function App() {
  //const [count, setCount] = useState(0)
  const [language, setLanguage] = useState('French');
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textValue, setTextValue] = useState('');


  const onSubmitTranslateText = (e) => {
    e.preventDefault();

    onTranslateUsingOpenRouterAI();

  };

  const onTranslateUsingOpenRouterAI = async () => {
    setLoading(true);

    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant that translates text into the user\'s selected language.'
      },
      {
        role: 'user',
        content: 'Translate the following text to Spanish: "Hello, how are you?"'
      }
    ];

    try {

      //  const openai = new OpenAI({
      //       baseURL: 'https://openrouter.ai/api/v1',
      //       apiKey: OPENROUTER_API_KEY,
      //       //dangerouslyAllowBrowser: true
      // })

      const response = await fetch('https://openrouter.ai/api/v1',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct',
          messages: messages
        })
      });

        //renderReport(response.choices[0].message.content)
        
        console.log(response);

    } catch (error) {
      console.error('Error during translation:', error);  
    }

}


return (
  <>
    {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}

    {/* <h1>Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div> */}

    <Header />

    <form className="m-10 p-10" onSubmit={onSubmitTranslateText}>

      <div className="border-2 border-black rounded-2xl p-6">

        <div className="textToTranslate mt-5 mb-5">
          <label htmlFor="textInput" className="block mb-2 font-bold text-2xl text-center text-[#035A9D]">
            Text to translate 👇
          </label>

          <input type="text" className="font-bold text-[#333333] bg-[#EFF0F4] w-full p-5" placeholder='How are you?' />
        </div>

        <div className="selectLanguage mt-5 mb-5">
          <label htmlFor="textInput" className="block mb-2 font-bold text-2xl text-center text-[#035A9D]">
            Select language 👇
          </label>

          <div className="inline-block">
            <input type="radio" name="french" />
            <label htmlFor="french">French</label>

            <input type="radio" name="spanish" />
            <label htmlFor="spanish">Spanish</label>

            <input type="radio" name="japanese" />
            <label htmlFor="japanese">Japanese</label>
          </div>

          <button className="bg-[#035A9D] text-white font-bold py-3 px-6 rounded-lg mt-5 hover:bg-blue-700">
            Translate
          </button>


        </div>

      </div>
    </form>

  </>
);
}

export default App;
