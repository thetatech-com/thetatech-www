import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'

const LiveStream = () => {
  const { user } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  const startStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
    // Add logic to send stream to a media server
    setIsStreaming(true)
  }

  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsStreaming(false)
  }

  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold">Live Stream</h1>
      <div className="my-4">
        <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg bg-muted" />
      </div>
      <div className="flex gap-4">
        {!isStreaming ? (
          <button onClick={startStream} className="rounded-lg bg-green-500 px-4 py-2 text-white">
            Start Streaming
          </button>
        ) : (
          <button onClick={stopStream} className="rounded-lg bg-red-500 px-4 py-2 text-white">
            Stop Streaming
          </button>
        )}
      </div>
    </div>
  )
}

export default LiveStream
