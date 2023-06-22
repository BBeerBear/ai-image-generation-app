import { useState } from 'react';
import axios from 'axios';
import RecordMessage from './RecordMessage';
import Title from './Title';

function Controller() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log(messages);

  const createBlobURL = (data: any) => {
    const blob = new Blob([data], { type: 'audio/mpeg' });
    const blobURL = URL.createObjectURL(blob);
    return blobURL;
  };

  const handleStop = async (blobUrl: string) => {
    setIsLoading(true);

    // Append user recorded message to messages
    const userMessage = { sender: 'me', blobUrl };
    const messagesArr = [...messages, userMessage];

    // Convert blobURL to FormData object
    fetch(blobUrl)
      .then((res) => res.blob())
      .then(async (blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'userAudio.wav');

        // Send form data & Get chat response
        axios
          .post('http://localhost:8000/post-audio-get/', formData, {
            headers: { 'Content-Type': 'audio/mpeg' },
            responseType: 'arraybuffer',
          })
          .then((res: any) => {
            if (res.status == 200) {
              const blob = res.data;
              const audio = new Audio();
              audio.src = createBlobURL(blob);

              // Append ai response audio to messages
              const joshMessage = { sender: 'josh', blobUrl: audio.src };
              messagesArr.push(joshMessage);
              setMessages(messagesArr);

              // Play audio
              setIsLoading(false);
              audio.play();
            }
          })
          .catch((err: any) => {
            console.log(err);
            setIsLoading(false);
          });
      });
  };

  return (
    <div className='w-full h-screen overflow-y-hidden'>
      <Title setMessages={setMessages} />

      <div className='flex flex-col justify-between h-full overflow-y-auto pb-96 bg-red-100'>
        {/* Conversation */}
        <div className='px-5 mt-2'>
          {messages?.map((audio, index) => {
            return (
              <div
                key={index + audio.sender}
                className={
                  'flex flex-col ' + (audio.sender === 'me' && 'items-end')
                }
              >
                {/* Sender */}
                <div className='mt-1'>
                  <p
                    className={
                      'font-bold capitalize ' +
                      (audio.sender === 'me'
                        ? 'text-pink-500 mr-2'
                        : 'text-blue-500 ml-2')
                    }
                  >
                    {audio.sender}
                  </p>
                </div>
                <audio
                  src={audio.blobUrl}
                  className='appearance-none mt-1 h-10'
                  controls
                />
              </div>
            );
          })}
        </div>

        {/* Loading */}
        {messages.length === 0 && isLoading && (
          <div className='text-center font-light italic mt-10 '>Loading...</div>
        )}

        {/* Recorder */}
        <div className='fixed bottom-0 w-full py-2 border-t text-center bg-gradient-to-r from-blue-500 to-pink-500'>
          <div className='flex justify-center items-center'>
            <RecordMessage handleStop={handleStop} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Controller;
