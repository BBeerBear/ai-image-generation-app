import { useState } from 'react';
import axios from 'axios';

type Props = {
  setMessages: any;
};

function Title({ setMessages }: Props) {
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const resetConversation = async () => {
    setIsResetting(true);
    axios
      .get('http://localhost:8000/reset')
      .then((res: any) => {
        if (res.status == 200) {
          setMessages([]);
        }
      })
      .catch((err) => {});

    setIsResetting(false);
  };

  return (
    <div className='bg-gray-900 w-full p-4 flex justify-between items-center font-bold text-white'>
      <div className='italic'>ENG GO</div>
      <button onClick={resetConversation} className={''}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className={
            'w-6 h-6 hover:scale-110 ' + (isResetting ? 'animate-spin' : '')
          }
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
          />
        </svg>
      </button>
    </div>
  );
}

export default Title;
