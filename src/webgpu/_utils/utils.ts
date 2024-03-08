import { fail } from "assert"

export const setupWebGPUDevice = async (): Promise<GPUDevice> => {
  const adapter = await navigator.gpu.requestAdapter()
  return await adapter?.requestDevice() || fail("WebGPU not supported!")
}