import { ReactMediaRecorder } from 'react-media-recorder';
import RecordIcon from './RecordIcon';

type Props = {
  handleStop: any;
};

function RecordMessage({ handleStop }: Props) {
  return (
    <ReactMediaRecorder
      audio
      onStop={handleStop}
      render={({ status, startRecording, stopRecording }) => (
        <div className='mt-2'>
          <button
            className='bg-white p-4 rounded-full'
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
          >
            <RecordIcon
              classText={
                status == 'recording'
                  ? 'animate-pulse text-pink-500'
                  : 'text-blue-500'
              }
            />
          </button>
          <p className='mt-1 font-bold text-white capitalize text-sm'>
            {status}
          </p>
        </div>
      )}
    />
  );
}

export default RecordMessage;
