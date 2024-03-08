import type { NextPage } from 'next'
import { setupWebGPUDevice } from '../../src/webgpu/_utils/utils';
import { useEffect } from 'react';

const WebGPU: NextPage = () => {
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