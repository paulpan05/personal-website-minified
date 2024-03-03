import type { NextComponentType } from 'next'
import { setupWebGPUDevice } from './src/utils';
import { useEffect } from 'react';

const WebGPU: NextComponentType = () => {
  useEffect(() => {
    setupWebGPUDevice().then((device) => {
      console.log(device);
    })
  }, []);
  return (
    <><p>hello</p></>
  );
}

export default WebGPU;